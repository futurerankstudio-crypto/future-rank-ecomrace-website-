export type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'GBP';

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fabricDetails?: string;
  category: 'Everyday Essentials' | 'Elegant Pret' | 'Contemporary Formal' | 'Seasonal Edit' | 'Accessories';
  price: number; // In PKR
  salePrice?: number;
  currency: string;
  images: string[];
  availableSizes: string[];
  availableColours: { name: string; hex: string }[];
  stock: number;
  sku: string;
  status: 'published' | 'draft' | 'archived';
  isFeatured: boolean;
  tags: string[];
  lowStockThreshold: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
  actor: 'customer' | 'system' | 'merchant';
}

export interface Order {
  id: string; // e.g. NC-2026-1042
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  paymentMethod: 'cash_on_delivery' | 'card_unconfigured';
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  internalNotes?: string[];
  isDemo: boolean;
}

export type InquiryTopic = 'sizing' | 'delivery' | 'returns' | 'fabric' | 'custom_order' | 'general';
export type InquiryPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  topic: InquiryTopic;
  priority: InquiryPriority;
  message: string;
  status: 'open' | 'triaged' | 'resolved';
  aiSuggestedResponse?: string;
  merchantReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  triggeredAt: string;
  status: 'success' | 'warning' | 'failed';
  triggerEvent: string;
  details: string;
  outputPayload?: Record<string, unknown>;
  error?: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  code: 'WORKFLOW_A' | 'WORKFLOW_B' | 'WORKFLOW_C' | 'WORKFLOW_D' | 'WORKFLOW_E';
  description: string;
  trigger: string;
  steps: string[];
  isEnabled: boolean;
  lastRun?: string;
  successRate: number; // percentage
  totalRuns: number;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  category: 'ai' | 'automation' | 'ecommerce' | 'messaging' | 'payments' | 'logistics';
  description: string;
  status: 'connected' | 'not_configured' | 'mock_mode' | 'error';
  lastVerified?: string;
  details: string;
  setupInstructions: string;
  credentialsConfigured: boolean;
  canTest: boolean;
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'support' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AgencyInquiry {
  id: string;
  name: string;
  email: string;
  businessType: string;
  service: string;
  budgetRange: string;
  description: string;
  createdAt: string;
}
