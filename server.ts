import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_WORKFLOWS,
  INITIAL_EXECUTIONS,
  INITIAL_INQUIRIES,
  INITIAL_INTEGRATIONS,
  INITIAL_NOTIFICATIONS
} from './src/data/initialData.ts';
import {
  Product,
  Order,
  AutomationWorkflow,
  AutomationExecution,
  SupportInquiry,
  IntegrationConfig,
  StoreNotification,
  AgencyInquiry
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database Store
let products: Product[] = [...INITIAL_PRODUCTS];
let orders: Order[] = [...INITIAL_ORDERS];
let workflows: AutomationWorkflow[] = [...INITIAL_WORKFLOWS];
let executions: AutomationExecution[] = [...INITIAL_EXECUTIONS];
let inquiries: SupportInquiry[] = [...INITIAL_INQUIRIES];
let integrations: IntegrationConfig[] = [...INITIAL_INTEGRATIONS];
let notifications: StoreNotification[] = [...INITIAL_NOTIFICATIONS];
let agencyInquiries: AgencyInquiry[] = [];

// Helper to trigger Workflow A (New Order Alert)
function triggerWorkflowA(newOrder: Order) {
  const wfA = workflows.find((w) => w.code === 'WORKFLOW_A');
  if (!wfA || !wfA.isEnabled) return;

  const execution: AutomationExecution = {
    id: `exec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    workflowId: wfA.id,
    workflowName: wfA.name,
    triggeredAt: new Date().toISOString(),
    status: 'success',
    triggerEvent: `order.created (${newOrder.id})`,
    details: `Order ${newOrder.id} successfully verified. Amount: PKR ${newOrder.total.toLocaleString()}. Method: ${newOrder.paymentMethod.toUpperCase()}. Dashboard notification dispatched.`,
    outputPayload: {
      orderId: newOrder.id,
      amount: newOrder.total,
      customer: newOrder.customerName,
      itemsCount: newOrder.items.length
    }
  };

  executions.unshift(execution);
  wfA.lastRun = execution.triggeredAt;
  wfA.totalRuns += 1;

  // Create Staff Notification
  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Cash on Delivery Order',
    message: `Order ${newOrder.id} for PKR ${newOrder.total.toLocaleString()} placed by ${newOrder.customerName} (${newOrder.city}).`,
    type: 'order',
    timestamp: new Date().toISOString(),
    read: false,
    link: 'orders'
  });
}

// Helper to check and trigger Workflow B (Low Stock Alert)
function checkLowStockWorkflow(affectedProduct: Product) {
  if (affectedProduct.stock <= affectedProduct.lowStockThreshold) {
    const wfB = workflows.find((w) => w.code === 'WORKFLOW_B');
    if (!wfB || !wfB.isEnabled) return;

    // Deduplication check: Avoid multiple alerts for the same stock level within 5 minutes
    const recent = executions.find(
      (e) =>
        e.workflowId === wfB.id &&
        e.details.includes(affectedProduct.name) &&
        Date.now() - new Date(e.triggeredAt).getTime() < 300000
    );
    if (recent) return;

    const execution: AutomationExecution = {
      id: `exec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      workflowId: wfB.id,
      workflowName: wfB.name,
      triggeredAt: new Date().toISOString(),
      status: 'warning',
      triggerEvent: `inventory.level_below_threshold (${affectedProduct.sku})`,
      details: `Product "${affectedProduct.name}" has ${affectedProduct.stock} unit(s) remaining (threshold: ${affectedProduct.lowStockThreshold}). Reorder alert issued.`,
      outputPayload: {
        productId: affectedProduct.id,
        sku: affectedProduct.sku,
        currentStock: affectedProduct.stock,
        threshold: affectedProduct.lowStockThreshold
      }
    };

    executions.unshift(execution);
    wfB.lastRun = execution.triggeredAt;
    wfB.totalRuns += 1;

    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Low Stock: ${affectedProduct.name}`,
      message: `Only ${affectedProduct.stock} units remaining (Threshold is ${affectedProduct.lowStockThreshold}).`,
      type: 'inventory',
      timestamp: new Date().toISOString(),
      read: false,
      link: 'inventory'
    });
  }
}

// ---------------- REST API ROUTES ----------------

// Health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    platform: 'NovaCart AI',
    agency: 'Future Rank Studio',
    aiEnabled: false,
    environment: 'demo'
  });
});

// Products
app.get('/api/products', (req, res) => {
  const { category, search, minPrice, maxPrice, inStockOnly, sort } = req.query;

  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter((p) => p.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    result = result.filter((p) => (p.salePrice || p.price) >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter((p) => (p.salePrice || p.price) <= Number(maxPrice));
  }
  if (inStockOnly === 'true') {
    result = result.filter((p) => p.stock > 0);
  }

  if (sort === 'price_asc') {
    result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sort === 'price_desc') {
    result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sort === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({ products: result, total: result.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  // Related products from same category
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  res.json({ product, related });
});

app.post('/api/products', (req, res) => {
  const body = req.body;
  if (!body.name || !body.price || !body.category) {
    res.status(400).json({ error: 'Name, price, and category are required' });
    return;
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: body.name,
    description: body.description || '',
    fabricDetails: body.fabricDetails || 'Premium Blend',
    category: body.category,
    price: Number(body.price),
    salePrice: body.salePrice ? Number(body.salePrice) : undefined,
    currency: 'PKR',
    images: body.images && body.images.length > 0 ? body.images : ['/src/assets/images/product_embroidered_pret_1792821527541.jpg'],
    availableSizes: body.availableSizes || ['S', 'M', 'L'],
    availableColours: body.availableColours || [{ name: 'Default', hex: '#E5E5E5' }],
    stock: Number(body.stock || 10),
    sku: body.sku || `NC-DEMO-${Math.floor(100 + Math.random() * 900)}`,
    status: body.status || 'published',
    isFeatured: !!body.isFeatured,
    tags: body.tags || ['fashion', 'pret'],
    lowStockThreshold: Number(body.lowStockThreshold || 5),
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  products[index] = {
    ...products[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
    salePrice: req.body.salePrice !== undefined ? (req.body.salePrice ? Number(req.body.salePrice) : undefined) : products[index].salePrice,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock
  };

  checkLowStockWorkflow(products[index]);
  res.json({ product: products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const removed = products.splice(index, 1)[0];
  res.json({ success: true, removed });
});

// Orders & Checkout
app.get('/api/orders', (req, res) => {
  const { status, search } = req.query;
  let result = [...orders];

  if (status && status !== 'all') {
    result = result.filter((o) => o.status === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.city.toLowerCase().includes(q)
    );
  }

  res.json({ orders: result, total: result.length });
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json({ order });
});

app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, customerPhone, shippingAddress, city, postalCode, items, paymentMethod } = req.body;

  // Validation
  if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city) {
    res.status(400).json({ error: 'Please provide all required shipping details.' });
    return;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Cart is empty. Cannot process checkout.' });
    return;
  }

  // Recalculate totals securely from backend product catalog & check stock
  let computedSubtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const catalogProduct = products.find((p) => p.id === item.productId);
    if (!catalogProduct) {
      res.status(400).json({ error: `Product with ID ${item.productId} was not found in catalog.` });
      return;
    }

    if (catalogProduct.stock < item.quantity) {
      res.status(400).json({
        error: `Insufficient stock for "${catalogProduct.name}". Only ${catalogProduct.stock} unit(s) available.`
      });
      return;
    }

    const unitPrice = catalogProduct.salePrice || catalogProduct.price;
    computedSubtotal += unitPrice * item.quantity;

    verifiedItems.push({
      productId: catalogProduct.id,
      productName: catalogProduct.name,
      size: item.selectedSize || 'Standard',
      color: item.selectedColor || 'Standard',
      quantity: item.quantity,
      price: unitPrice,
      image: catalogProduct.images[0]
    });
  }

  // Shipping calculation (PKR 350 flat domestic, free over PKR 25,000)
  const shippingCost = computedSubtotal >= 25000 ? 0 : 350;
  const computedTotal = computedSubtotal + shippingCost;

  // Decrement inventory securely
  for (const item of items) {
    const catalogProduct = products.find((p) => p.id === item.productId);
    if (catalogProduct) {
      catalogProduct.stock -= item.quantity;
      checkLowStockWorkflow(catalogProduct);
    }
  }

  // Create unique order ID
  const orderId = `NC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim(),
    customerPhone: customerPhone.trim(),
    shippingAddress: shippingAddress.trim(),
    city: city.trim(),
    postalCode: postalCode ? postalCode.trim() : '44000',
    items: verifiedItems,
    subtotal: computedSubtotal,
    shippingCost,
    total: computedTotal,
    currency: 'PKR',
    paymentMethod: paymentMethod === 'card_unconfigured' ? 'card_unconfigured' : 'cash_on_delivery',
    status: 'pending',
    timeline: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        note: `Order placed via Cash on Delivery (${verifiedItems.length} items).`,
        actor: 'customer'
      }
    ],
    internalNotes: ['Awaiting dispatch verification call.'],
    isDemo: true
  };

  orders.unshift(newOrder);

  // Trigger Workflow A
  triggerWorkflowA(newOrder);

  res.status(201).json({
    success: true,
    order: newOrder,
    message: 'Order created successfully. Stored in database.'
  });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status, note } = req.body;
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const validStatuses = ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid order status' });
    return;
  }

  order.status = status;
  order.timeline.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${status}`,
    actor: 'merchant'
  });

  // Trigger Workflow E if delivered
  if (status === 'delivered') {
    const wfE = workflows.find((w) => w.code === 'WORKFLOW_E');
    if (wfE && wfE.isEnabled) {
      const execution: AutomationExecution = {
        id: `exec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        workflowId: wfE.id,
        workflowName: wfE.name,
        triggeredAt: new Date().toISOString(),
        status: 'success',
        triggerEvent: `order.status_changed (delivered: ${order.id})`,
        details: `Order ${order.id} marked as delivered. Garment care instructions queued for ${order.customerName}.`,
        outputPayload: { orderId: order.id, customer: order.customerName }
      };
      executions.unshift(execution);
      wfE.lastRun = execution.triggeredAt;
      wfE.totalRuns += 1;
    }
  }

  res.json({ order });
});

// Inventory
app.get('/api/inventory', (_req, res) => {
  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);
  const outOfStock = products.filter((p) => p.stock === 0);
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);

  res.json({
    inventory: products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      status: p.stock === 0 ? 'out_of_stock' : p.stock <= p.lowStockThreshold ? 'low_stock' : 'in_stock'
    })),
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
    totalUnits
  });
});

app.post('/api/inventory/adjust', (req, res) => {
  const { productId, newStock, threshold } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  if (typeof newStock === 'number') {
    product.stock = Math.max(0, newStock);
  }
  if (typeof threshold === 'number') {
    product.lowStockThreshold = Math.max(1, threshold);
  }

  checkLowStockWorkflow(product);

  res.json({
    success: true,
    product: {
      id: product.id,
      name: product.name,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold
    }
  });
});

// Automation Workflows
app.get('/api/workflows', (_req, res) => {
  res.json({
    workflows,
    executions: executions.slice(0, 30)
  });
});

app.post('/api/workflows/:id/toggle', (req, res) => {
  const wf = workflows.find((w) => w.id === req.params.id);
  if (!wf) {
    res.status(404).json({ error: 'Workflow not found' });
    return;
  }

  wf.isEnabled = !wf.isEnabled;
  res.json({ workflow: wf });
});

app.post('/api/workflows/:id/test', (req, res) => {
  const wf = workflows.find((w) => w.id === req.params.id);
  if (!wf) {
    res.status(404).json({ error: 'Workflow not found' });
    return;
  }

  const execution: AutomationExecution = {
    id: `exec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    workflowId: wf.id,
    workflowName: wf.name,
    triggeredAt: new Date().toISOString(),
    status: 'success',
    triggerEvent: `manual.test_run (${wf.code})`,
    details: `Manual test execution of "${wf.name}" completed successfully. Verified trigger rules and state validation.`,
    outputPayload: { testMode: true, timestamp: Date.now() }
  };

  executions.unshift(execution);
  wf.lastRun = execution.triggeredAt;
  wf.totalRuns += 1;

  res.json({ success: true, execution, workflow: wf });
});

// Support Inquiries
app.get('/api/inquiries', (_req, res) => {
  res.json({ inquiries });
});

app.post('/api/inquiries', async (req, res) => {
  const { customerName, customerEmail, customerPhone, message, topic } = req.body;
  if (!customerName || !customerEmail || !message) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }

  let categorizedTopic = topic || 'general';
  let priority = 'medium';
  let suggestedResponse = '';

  if (!suggestedResponse) {
    // Transparent rule-based fallback
    if (message.toLowerCase().includes('size') || message.toLowerCase().includes('fit')) {
      categorizedTopic = 'sizing';
      priority = 'medium';
      suggestedResponse = `Dear ${customerName}, thank you for inquiring. Our garments are tailored to standard true-to-size dimensions. You can view our detailed bust, waist, and length charts on the product page.`;
    } else if (message.toLowerCase().includes('deliver') || message.toLowerCase().includes('ship')) {
      categorizedTopic = 'delivery';
      priority = 'high';
      suggestedResponse = `Dear ${customerName}, our standard delivery timeline across Pakistan is 24 to 48 hours via TCS Express. Cash on Delivery is gladly available.`;
    } else {
      suggestedResponse = `Dear ${customerName}, thank you for reaching out to NovaCart AI. Our customer care team has received your inquiry and will respond within 2-4 business hours.`;
    }
  }

  const newInquiry: SupportInquiry = {
    id: `inq-${Date.now()}`,
    customerName,
    customerEmail,
    customerPhone: customerPhone || '',
    topic: categorizedTopic,
    priority: priority as any,
    message,
    status: 'triaged',
    aiSuggestedResponse: suggestedResponse,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);

  // Trigger Workflow C execution record
  const wfC = workflows.find((w) => w.code === 'WORKFLOW_C');
  if (wfC && wfC.isEnabled) {
    const execution: AutomationExecution = {
      id: `exec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      workflowId: wfC.id,
      workflowName: wfC.name,
      triggeredAt: new Date().toISOString(),
      status: 'success',
      triggerEvent: `customer.inquiry_received (${newInquiry.id})`,
      details: `Inquiry from ${newInquiry.customerName} classified as [topic: ${categorizedTopic}, priority: ${priority}]. AI draft response prepared.`,
      outputPayload: { inquiryId: newInquiry.id, topic: categorizedTopic, priority }
    };
    executions.unshift(execution);
    wfC.lastRun = execution.triggeredAt;
    wfC.totalRuns += 1;
  }

  res.status(201).json({ inquiry: newInquiry });
});

app.patch('/api/inquiries/:id', (req, res) => {
  const inq = inquiries.find((i) => i.id === req.params.id);
  if (!inq) {
    res.status(404).json({ error: 'Inquiry not found' });
    return;
  }

  if (req.body.status) inq.status = req.body.status;
  if (req.body.merchantReply) inq.merchantReply = req.body.merchantReply;
  inq.updatedAt = new Date().toISOString();

  res.json({ inquiry: inq });
});

// Analytics
app.get('/api/analytics', (req, res) => {
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const ordersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;
  const openInquiries = inquiries.filter((i) => i.status !== 'resolved').length;

  // Product sales calculation from actual stored orders
  const productSalesMap: Record<string, { name: string; unitsSold: number; revenue: number }> = {};
  for (const ord of orders) {
    if (ord.status === 'cancelled') continue;
    for (const it of ord.items) {
      if (!productSalesMap[it.productId]) {
        productSalesMap[it.productId] = { name: it.productName, unitsSold: 0, revenue: 0 };
      }
      productSalesMap[it.productId].unitsSold += it.quantity;
      productSalesMap[it.productId].revenue += it.price * it.quantity;
    }
  }

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

  // Status breakdown
  const statusCounts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    dispatched: 0,
    delivered: 0,
    cancelled: 0
  };
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  res.json({
    totalSales,
    ordersCount,
    pendingOrders,
    lowStockCount,
    openInquiries,
    currency: 'PKR',
    topProducts,
    statusCounts,
    automationStats: {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter((w) => w.isEnabled).length,
      recentExecutions: executions.length
    }
  });
});

// Integrations
app.get('/api/integrations', (_req, res) => {
  res.json({ integrations });
});

app.post('/api/integrations/:id/test', async (req, res) => {
  const integ = integrations.find((i) => i.id === req.params.id);
  if (!integ) {
    res.status(404).json({ error: 'Integration not found' });
    return;
  }

  if (integ.id === 'int-ai') {
    res.json({ success: true, message: 'Rule-based assistant available (no external AI provider).', integ });
    return;
  }

  if (integ.id === 'int-payment') {
    integ.lastVerified = `Verified active at ${new Date().toLocaleTimeString()} (Cash on Delivery Engine Ready)`;
    res.json({
      success: true,
      message: 'Cash on Delivery checkout pipeline verified. Online card gateway remains guarded until API keys are set.',
      integ
    });
    return;
  }

  res.json({
    success: false,
    message: `${integ.name} is currently not configured with live production credentials.`
  });
});

// Notifications
app.get('/api/notifications', (_req, res) => {
  res.json({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
});

app.post('/api/notifications/read', (_req, res) => {
  notifications.forEach((n) => (n.read = true));
  res.json({ success: true });
});

// Future Rank Studio Agency Inquiry
app.post('/api/agency/inquiry', (req, res) => {
  const { name, email, businessType, service, budgetRange, description } = req.body;

  if (!name || !email || !description) {
    res.status(400).json({ error: 'Name, email, and project description are required.' });
    return;
  }

  const inquiry: AgencyInquiry = {
    id: `agency-inq-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    businessType: businessType || 'Fashion Boutique / Retailer',
    service: service || 'Full-Stack Web Development',
    budgetRange: budgetRange || 'Standard',
    description: description.trim(),
    createdAt: new Date().toISOString()
  };

  agencyInquiries.unshift(inquiry);

  notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Store Build Inquiry (Future Rank Studio)',
    message: `${inquiry.name} (${inquiry.email}) inquired for: ${inquiry.service}`,
    type: 'system',
    timestamp: new Date().toISOString(),
    read: false,
    link: 'inquiries'
  });

  res.status(201).json({
    success: true,
    message: 'Your inquiry has been sent to Future Rank Studio. Our team will contact you promptly!',
    inquiry
  });
});

// AI Shopping Assistant Chat ("Find Your Perfect Look")
app.post('/api/assistant/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  // Transparent Rule-Based Assistant Fallback
  const q = message.toLowerCase();
  let matchedProducts = products.filter(
    (p) =>
      q.includes(p.name.toLowerCase()) ||
      p.tags.some((t) => q.includes(t)) ||
      q.includes(p.category.toLowerCase())
  );

  let replyText = '';
  if (q.includes('policy') || q.includes('return') || q.includes('exchange')) {
    replyText =
      'Our policy offers a 7-day exchange window on unworn garments with original security tags intact. We also gladly support Cash on Delivery across Pakistan with 24-48 hour delivery via TCS Express.';
  } else if (q.includes('delivery') || q.includes('shipping') || q.includes('cod') || q.includes('cash')) {
    replyText =
      'We deliver nationwide across Pakistan within 24–48 hours. Shipping is free on orders above PKR 25,000, and PKR 350 for standard orders. Cash on Delivery is gladly available.';
  } else if (q.includes('formal') || q.includes('wedding') || q.includes('peshwas')) {
    const formalItem = products.find((p) => p.category === 'Seasonal Edit' || p.category === 'Contemporary Formal');
    replyText = formalItem
      ? `For celebratory and formal occasions, I recommend our ${formalItem.name} priced at PKR ${formalItem.price.toLocaleString()}. It features exquisite artisanal craftsmanship and is available in sizes ${formalItem.availableSizes.join(', ')}.`
      : 'Explore our Contemporary Formal and Seasonal Edit collections.';
  } else if (matchedProducts.length > 0) {
    const p = matchedProducts[0];
    replyText = `Based on your style preference, I recommend the ${p.name} (PKR ${p.price.toLocaleString()}). Fabric: ${p.fabricDetails}. Available sizes: ${p.availableSizes.join(', ')}.`;
  } else {
    replyText =
      'Welcome to NovaCart AI. I can assist you with sizing recommendations, fabric specifications, matching accessories, and store policies. Which occasion are you dressing for today?';
  }

  res.json({
    reply: replyText,
    isAiLive: false,
    modeNotice: 'Assistant Preview Mode (Rule-based catalogue matcher)',
    recommendedProductIds: matchedProducts.slice(0, 2).map((p) => p.id)
  });
});

// Export for Vercel serverless routing. State is demonstration-only and not persistent.
export default app;
