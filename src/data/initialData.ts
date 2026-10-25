import {
  Product,
  AutomationWorkflow,
  AutomationExecution,
  Order,
  SupportInquiry,
  IntegrationConfig,
  StoreNotification
} from '../types/index.ts';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Zari Embroidered Raw Silk Pret',
    description: 'Masterfully crafted two-piece ensemble made from pure 80g raw silk. Adorned with delicate champagne zari embroidery along the neckline, sleeve cuffs, and daman, paired with tailored cigarette trousers and a tonal pure organza dupatta with scalloped borders.',
    fabricDetails: 'Pure 80g Raw Silk Kurta & Pants with Lightweight Semi-Sheer Organza Dupatta',
    category: 'Elegant Pret',
    price: 24500,
    salePrice: 22500,
    currency: 'PKR',
    images: ['/images/product_embroidered_pret_1792821527541.jpg'],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColours: [
      { name: 'Ivory Cream', hex: '#F9F6F0' },
      { name: 'Champagne Gold', hex: '#DFCBB5' },
      { name: 'Onyx Noir', hex: '#1C1C1F' }
    ],
    stock: 12,
    sku: 'NC-EPR-001',
    status: 'published',
    isFeatured: true,
    tags: ['raw silk', 'embroidered', 'pret', 'festive', 'luxury', 'dupatta'],
    lowStockThreshold: 5,
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'prod-002',
    name: 'Contemporary Oat Linen Tailored Suit',
    description: 'An architectural two-piece power silhouette constructed from premium breathable linen blend. Features a double-breasted relaxed blazer with structured shoulders, horn buttons, and wide-leg pleated trousers designed for effortless poise.',
    fabricDetails: '70% French Linen, 30% Mulberry Viscose; Fully Bemberg lined',
    category: 'Contemporary Formal',
    price: 18900,
    currency: 'PKR',
    images: ['/images/product_contemporary_suit_1792821527800.jpg'],
    availableSizes: ['S', 'M', 'L'],
    availableColours: [
      { name: 'Oat Beige', hex: '#DDD2C3' },
      { name: 'Chalk White', hex: '#F4F1EA' },
      { name: 'Slate Gray', hex: '#4A4D53' }
    ],
    stock: 4, // Below low stock threshold to demonstrate Workflow B!
    sku: 'NC-CTF-002',
    status: 'published',
    isFeatured: true,
    tags: ['linen', 'suit', 'contemporary', 'tailored', 'blazer', 'formal'],
    lowStockThreshold: 5,
    createdAt: '2026-10-16T11:30:00Z',
  },
  {
    id: 'prod-003',
    name: 'Dusk Rose Organza Peshwas Ensemble',
    description: 'An ethereal floor-length peshwas rendered on sheer crushed organza with hand-rendered marori, sequin, and seed-pearl embellishments. Paired with a heavily worked borders dupatta and raw silk churidar.',
    fabricDetails: 'Pure Kora Organza Peshwas with Raw Silk Lining and Silk Churidar',
    category: 'Seasonal Edit',
    price: 34000,
    currency: 'PKR',
    images: ['/images/product_formal_chiffon_1792821528510.jpg'],
    availableSizes: ['XS', 'S', 'M', 'L'],
    availableColours: [
      { name: 'Dusk Rose', hex: '#C79A9C' },
      { name: 'Soft Lilac', hex: '#D2C4D9' }
    ],
    stock: 8,
    sku: 'NC-SED-003',
    status: 'published',
    isFeatured: true,
    tags: ['peshwas', 'formal', 'wedding', 'organza', 'handcrafted', 'dusk rose'],
    lowStockThreshold: 3,
    createdAt: '2026-10-18T14:15:00Z',
  },
  {
    id: 'prod-004',
    name: 'Artisan Filigree Jewelry & Embroidered Clutch',
    description: 'Handcrafted by generational master artisans. The set includes a 24k gold-dipped filigree choker necklace, delicate drop earrings, hinged cuff, and a coordinating hand-embroidered champagne silk envelope clutch.',
    fabricDetails: '24k Micron Gold Vermeil over Brass; Clutch: Raw Silk with Zardozi Work',
    category: 'Accessories',
    price: 14500,
    currency: 'PKR',
    images: ['/images/product_artisan_accessories_1792821529328.jpg'],
    availableSizes: ['One Size'],
    availableColours: [
      { name: 'Vintage Gold', hex: '#D4AF37' },
      { name: 'Silver Filigree', hex: '#C0C0C0' }
    ],
    stock: 15,
    sku: 'NC-ACC-004',
    status: 'published',
    isFeatured: true,
    tags: ['jewelry', 'clutch', 'accessories', 'handcrafted', 'filigree', 'gold'],
    lowStockThreshold: 4,
    createdAt: '2026-10-19T09:40:00Z',
  },
  {
    id: 'prod-005',
    name: 'Monochrome Minimalist Lawn Kurta',
    description: 'High-thread-count Egyptian supima cotton lawn kurta featuring geometric shadow-work embroidery along the collar, hidden placket, and side slits. Designed for day-to-night versatility in warmer climates.',
    fabricDetails: '100% Egyptian Supima Lawn Cotton, Pre-shrunk',
    category: 'Everyday Essentials',
    price: 8500,
    currency: 'PKR',
    images: ['/images/hero_fashion_editorial_1792821526246.jpg'],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColours: [
      { name: 'Ivory White', hex: '#FAF9F6' },
      { name: 'Charcoal Black', hex: '#222225' }
    ],
    stock: 22,
    sku: 'NC-EVE-005',
    status: 'published',
    isFeatured: false,
    tags: ['lawn', 'kurta', 'everyday', 'cotton', 'summer', 'breathable'],
    lowStockThreshold: 6,
    createdAt: '2026-10-20T16:00:00Z',
  },
  {
    id: 'prod-006',
    name: 'Scalloped Silk Organza Dupatta Scarf',
    description: 'Statement accessory woven with gold micro-tilla threads and finished with intricate laser-cut and hand-tacked scalloped embroidery. Elevates any basic or formal outfit.',
    fabricDetails: 'Pure Woven Tissue Organza with Zari Thread Border',
    category: 'Accessories',
    price: 6200,
    currency: 'PKR',
    images: ['/images/product_embroidered_pret_1792821527541.jpg'],
    availableSizes: ['2.75 Meters Standard'],
    availableColours: [
      { name: 'Champagne Shimmer', hex: '#F0E6D2' },
      { name: 'Powder Rose', hex: '#EEDAD8' }
    ],
    stock: 18,
    sku: 'NC-ACC-006',
    status: 'published',
    isFeatured: false,
    tags: ['dupatta', 'scarf', 'organza', 'scalloped', 'accessories'],
    lowStockThreshold: 5,
    createdAt: '2026-10-21T12:00:00Z',
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'NC-2026-1042',
    createdAt: '2026-10-22T14:20:00Z',
    customerName: 'Ayesha Khan',
    customerEmail: 'ayesha.k@example.com',
    customerPhone: '+92 300 1234567',
    shippingAddress: 'House 42, Street 11, Sector F-7/2',
    city: 'Islamabad',
    postalCode: '44000',
    items: [
      {
        productId: 'prod-001',
        productName: 'Zari Embroidered Raw Silk Pret',
        size: 'M',
        color: 'Ivory Cream',
        quantity: 1,
        price: 22500,
        image: '/images/product_embroidered_pret_1792821527541.jpg'
      }
    ],
    subtotal: 22500,
    shippingCost: 350,
    total: 22850,
    currency: 'PKR',
    paymentMethod: 'cash_on_delivery',
    status: 'processing',
    timeline: [
      { status: 'pending', timestamp: '2026-10-22T14:20:00Z', note: 'Order placed via Cash on Delivery (Demo)', actor: 'customer' },
      { status: 'confirmed', timestamp: '2026-10-22T14:25:00Z', note: 'Customer phone confirmed by dispatch desk', actor: 'merchant' },
      { status: 'processing', timestamp: '2026-10-22T15:00:00Z', note: 'Item picked from Islamabad Atelier warehouse', actor: 'system' }
    ],
    internalNotes: ['Customer requested delicate packaging for bridal gift.'],
    isDemo: true
  },
  {
    id: 'NC-2026-1041',
    createdAt: '2026-10-21T09:15:00Z',
    customerName: 'Zainab Tariq',
    customerEmail: 'zainab.tariq@example.com',
    customerPhone: '+92 321 9876543',
    shippingAddress: 'Apartment 5B, Clifton Block 4',
    city: 'Karachi',
    postalCode: '75600',
    items: [
      {
        productId: 'prod-004',
        productName: 'Artisan Filigree Jewelry & Embroidered Clutch',
        size: 'One Size',
        color: 'Vintage Gold',
        quantity: 1,
        price: 14500,
        image: '/images/product_artisan_accessories_1792821529328.jpg'
      }
    ],
    subtotal: 14500,
    shippingCost: 350,
    total: 14850,
    currency: 'PKR',
    paymentMethod: 'cash_on_delivery',
    status: 'dispatched',
    timeline: [
      { status: 'pending', timestamp: '2026-10-21T09:15:00Z', note: 'Order placed via Cash on Delivery', actor: 'customer' },
      { status: 'confirmed', timestamp: '2026-10-21T09:30:00Z', note: 'Automated order verification validated', actor: 'system' },
      { status: 'processing', timestamp: '2026-10-21T11:00:00Z', note: 'Quality check completed', actor: 'merchant' },
      { status: 'dispatched', timestamp: '2026-10-21T16:45:00Z', note: 'Handed to courier (Consignment #772910)', actor: 'system' }
    ],
    internalNotes: ['VIP recurring client.'],
    isDemo: true
  }
];

export const INITIAL_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Workflow A: New Order Alert & Validation',
    code: 'WORKFLOW_A',
    description: 'Triggered when a new order is placed. Validates payload, verifies item inventory, records audit event, posts dashboard notification, and logs execution status.',
    trigger: 'Event: order.created',
    steps: [
      '1. Validate customer checkout attributes & phone format',
      '2. Verify inventory availability and decrement stock reliably',
      '3. Record immutable order timeline event',
      '4. Dispatch real-time dashboard notification to store staff',
      '5. Dispatch email receipt (Only when SMTP/Resend integration is connected)',
      '6. Log workflow execution record with payload & timestamp'
    ],
    isEnabled: true,
    lastRun: '2026-10-22T14:20:02Z',
    successRate: 100,
    totalRuns: 14
  },
  {
    id: 'wf-2',
    name: 'Workflow B: Low Stock Guard & Reorder Alert',
    code: 'WORKFLOW_B',
    description: 'Monitors inventory after each order or manual adjustment. Flags items below configured threshold and produces restocking alerts without duplicate noise.',
    trigger: 'Event: inventory.level_below_threshold',
    steps: [
      '1. Detect item stock <= configured threshold (e.g. 5 units)',
      '2. Check deduplication cache to prevent alert flooding',
      '3. Create high-visibility inventory badge in Admin Inventory',
      '4. Generate store owner notification alert',
      '5. Log execution telemetry'
    ],
    isEnabled: true,
    lastRun: '2026-10-22T14:20:03Z',
    successRate: 100,
    totalRuns: 8
  },
  {
    id: 'wf-3',
    name: 'Workflow C: Customer Support Triage & Policy Grounding',
    code: 'WORKFLOW_C',
    description: 'Automatically receives customer inquiries, categorizes the topic (sizing, fabric, delivery), assigns urgency priority using transparent rules, and prepares grounded suggested responses.',
    trigger: 'Event: customer.inquiry_received',
    steps: [
      '1. Ingest customer inquiry text into persistent database',
      '2. Categorize inquiry (sizing, shipping, fabric, return policy)',
      '3. Calculate priority score based on purchase state or delivery timeframe',
      '4. Generate suggested merchant response using store policy context',
      '5. Route sensitive or uncertain tickets directly to human merchant desk'
    ],
    isEnabled: true,
    lastRun: '2026-10-23T18:10:00Z',
    successRate: 100,
    totalRuns: 11
  },
  {
    id: 'wf-4',
    name: 'Workflow D: Abandoned Cart Follow-up (Prepared Architecture)',
    code: 'WORKFLOW_D',
    description: 'Tracks sessions where items were added to cart but checkout was uncompleted after 2 hours. Requires customer marketing consent and active SMS/WhatsApp provider.',
    trigger: 'Event: cart.abandoned (dwell > 120min)',
    steps: [
      '1. Evaluate cart idle state against 2-hour threshold',
      '2. Verify explicit customer opt-in consent for promotional messaging',
      '3. Check connected WhatsApp / Email gateway credentials',
      '4. Construct personalized cart recovery link with item preview',
      '5. Dispatch message only if external gateway is verified (currently guarded)'
    ],
    isEnabled: false, // Disabled until WhatsApp / Email credentials connected
    lastRun: 'Never (Integration Required)',
    successRate: 0,
    totalRuns: 0
  },
  {
    id: 'wf-5',
    name: 'Workflow E: Post-Purchase Care & Fitting Guidance',
    code: 'WORKFLOW_E',
    description: 'Dispatches care instructions and fabric preservation guidelines after an order status is marked as Delivered.',
    trigger: 'Event: order.status_changed (to "delivered")',
    steps: [
      '1. Confirm order transition to delivered status',
      '2. Generate garment-specific care manual (Dry clean raw silk, cold wash linen)',
      '3. Queue follow-up task on merchant support dashboard',
      '4. Transmit customer message if authorized delivery provider confirms handover'
    ],
    isEnabled: true,
    lastRun: '2026-10-20T17:30:00Z',
    successRate: 100,
    totalRuns: 5
  }
];

export const INITIAL_EXECUTIONS: AutomationExecution[] = [
  {
    id: 'exec-101',
    workflowId: 'wf-1',
    workflowName: 'Workflow A: New Order Alert & Validation',
    triggeredAt: '2026-10-22T14:20:02Z',
    status: 'success',
    triggerEvent: 'order.created (NC-2026-1042)',
    details: 'Order NC-2026-1042 validated. Stock decremented for prod-001 (12 -> 11). Staff notification created.',
    outputPayload: { orderId: 'NC-2026-1042', amount: 22850, customer: 'Ayesha Khan' }
  },
  {
    id: 'exec-102',
    workflowId: 'wf-2',
    workflowName: 'Workflow B: Low Stock Guard & Reorder Alert',
    triggeredAt: '2026-10-22T14:20:03Z',
    status: 'warning',
    triggerEvent: 'inventory.level_below_threshold',
    details: 'Product "Contemporary Oat Linen Tailored Suit" has 4 units remaining (Threshold: 5). Low stock alert published.',
    outputPayload: { productId: 'prod-002', stock: 4, threshold: 5 }
  },
  {
    id: 'exec-103',
    workflowId: 'wf-3',
    workflowName: 'Workflow C: Customer Support Triage & Policy Grounding',
    triggeredAt: '2026-10-23T18:10:00Z',
    status: 'success',
    triggerEvent: 'customer.inquiry_received (inq-201)',
    details: 'Inquiry classified as [topic: sizing, priority: medium]. AI draft response generated using size chart.',
    outputPayload: { inquiryId: 'inq-201', priority: 'medium', category: 'sizing' }
  }
];

export const INITIAL_INQUIRIES: SupportInquiry[] = [
  {
    id: 'inq-201',
    customerName: 'Maham Raza',
    customerEmail: 'maham.r@example.com',
    customerPhone: '+92 333 4455667',
    topic: 'sizing',
    priority: 'medium',
    message: 'Hello! I am usually between a Small and Medium for standard pret kurtas. What is the chest and hip measurement for the Zari Embroidered Raw Silk Pret in Medium?',
    status: 'triaged',
    aiSuggestedResponse: 'Dear Maham, thank you for reaching out to NovaCart AI. For our Zari Embroidered Raw Silk Pret in size Medium (M), the chest circumference is 40 inches (20 inches flat) and the hip measurement is 44 inches with a 42-inch kurta length. Because raw silk has no synthetic stretch, if you prefer a modest, fluid drape, we recommend selecting Medium. Please let us know if you would like custom adjustments.',
    createdAt: '2026-10-23T18:09:00Z',
    updatedAt: '2026-10-23T18:10:00Z'
  },
  {
    id: 'inq-202',
    customerName: 'Sara Ali',
    customerEmail: 'sara.ali@example.com',
    topic: 'delivery',
    priority: 'high',
    message: 'Can I get expedited delivery in Lahore for an upcoming family dinner this Saturday?',
    status: 'open',
    aiSuggestedResponse: 'Dear Sara, our standard express delivery within Lahore takes 24 to 48 hours via TCS Express. If you place your order before 2:00 PM today, our warehouse will dispatch it immediately for next-day arrival. Cash on Delivery is gladly accepted.',
    createdAt: '2026-10-23T20:15:00Z',
    updatedAt: '2026-10-23T20:15:00Z'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'int-ai',
    name: 'Rule-Based Engine (@google/genai)',
    category: 'ai',
    description: 'Powers the NovaCart AI Fashion Assistant ("Find Your Perfect Look"), natural language catalog search, and customer inquiry triage.',
    status: 'connected',
    lastVerified: 'No external AI service required',
    details: 'Running securely server-side via Node Express proxy. Uses Rule-Based Assistant with catalogue grounding and policy invariants.',
    setupInstructions: 'Automatically injected via  environment secret.',
    credentialsConfigured: true,
    canTest: true
  },
  {
    id: 'int-n8n',
    name: 'n8n Workflow Automation',
    category: 'automation',
    description: 'Visual workflow orchestrator for event-driven ERP sync, WhatsApp order updates, and Google Sheets reconciliation.',
    status: 'not_configured',
    details: 'Webhook listener endpoints prepared at /api/webhooks/n8n. Ready for connection with self-hosted or cloud n8n instances.',
    setupInstructions: 'Set N8N_WEBHOOK_URL and N8N_API_KEY in your deployment environment.',
    credentialsConfigured: false,
    canTest: false
  },
  {
    id: 'int-shopify',
    name: 'Shopify Store Bridge',
    category: 'ecommerce',
    description: 'Bi-directional synchronization for product catalogs, variant inventories, and order fulfillment across Shopify and NovaCart AI.',
    status: 'not_configured',
    details: 'Admin API GraphQL client schema ready. Requires private Shopify custom app access token.',
    setupInstructions: 'Configure SHOPIFY_SHOP_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN.',
    credentialsConfigured: false,
    canTest: false
  },
  {
    id: 'int-woocommerce',
    name: 'WooCommerce REST API',
    category: 'ecommerce',
    description: 'Syncs WordPress/WooCommerce inventories, tax rules, and local shipping zones.',
    status: 'not_configured',
    details: 'WooCommerce v3 REST API wrapper implemented. Awaiting Consumer Key & Secret.',
    setupInstructions: 'Configure WOOCOMMERCE_URL, WC_CONSUMER_KEY, and WC_CONSUMER_SECRET.',
    credentialsConfigured: false,
    canTest: false
  },
  {
    id: 'int-payment',
    name: 'Payment Gateway (Cash on Delivery & Online)',
    category: 'payments',
    description: 'Cash on Delivery (COD) is natively enabled and verified for Pakistan. Online Card payments (Stripe / JazzCash / EasyPaisa) remain guarded until real keys are provided.',
    status: 'connected', // COD is fully operational
    lastVerified: 'Cash on Delivery Active & Tested',
    details: 'COD orders process through full validation, stock decrement, and invoice generation. Online payment toggle is disabled until gateway verification.',
    setupInstructions: 'Configure STRIPE_SECRET_KEY or JAZZCASH_MERCHANT_ID to enable online digital payments.',
    credentialsConfigured: false,
    canTest: true
  },
  {
    id: 'int-shipping',
    name: 'Courier & Shipping Logistics (TCS / Leopards / DHL)',
    category: 'logistics',
    description: 'Pre-configured shipping calculator and consignment tracker architecture for domestic Pakistan and international logistics.',
    status: 'mock_mode',
    details: 'Simulated tracking and rate calculation (PKR 350 standard shipping, free on orders over PKR 25,000). Direct courier API not connected.',
    setupInstructions: 'Add TCS_API_KEY or LEOPARDS_API_TOKEN to generate real air waybills.',
    credentialsConfigured: false,
    canTest: false
  },
  {
    id: 'int-email',
    name: 'Transactional Email (Resend / SMTP)',
    category: 'messaging',
    description: 'Dispatches automated order confirmation receipts and shipping updates to customers.',
    status: 'not_configured',
    details: 'Email templates prepared with branded Future Rank Studio typography. Dispatches recorded as internal notification until live SMTP is configured.',
    setupInstructions: 'Set RESEND_API_KEY or SMTP_HOST to begin sending external customer emails.',
    credentialsConfigured: false,
    canTest: false
  }
];

export const INITIAL_NOTIFICATIONS: StoreNotification[] = [
  {
    id: 'notif-1',
    title: 'New Cash on Delivery Order',
    message: 'Order NC-2026-1042 for PKR 22,850 received from Ayesha Khan (Islamabad).',
    type: 'order',
    timestamp: '2026-10-22T14:20:00Z',
    read: false,
    link: 'orders'
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert: Contemporary Suit',
    message: 'Only 4 units left of Contemporary Oat Linen Tailored Suit (Threshold: 5).',
    type: 'inventory',
    timestamp: '2026-10-22T14:20:03Z',
    read: false,
    link: 'inventory'
  },
  {
    id: 'notif-3',
    title: 'Customer Inquiry Triaged',
    message: 'Inquiry inq-201 from Maham Raza categorized as Sizing (Priority: Medium).',
    type: 'support',
    timestamp: '2026-10-23T18:10:00Z',
    read: true,
    link: 'support'
  }
];
