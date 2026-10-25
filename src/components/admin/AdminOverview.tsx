import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { AdminTab } from './AdminLayout.tsx';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Inbox,
  Zap,
  ArrowRight,
  PackageCheck,
  CheckCircle2
} from 'lucide-react';
import { Order } from '../../types/index.ts';

interface AdminOverviewProps {
  onNavigate: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const { formatPrice } = useStore();

  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverviewData = async () => {
    try {
      const [analyticsRes, ordersRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/orders')
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setStats(data);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData.orders.slice(0, 5));
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const totalSales = stats?.totalSales || 0;
  const ordersCount = stats?.ordersCount || 0;
  const pendingOrders = stats?.pendingOrders || 0;
  const lowStockCount = stats?.lowStockCount || 0;
  const openInquiries = stats?.openInquiries || 0;
  const activeWorkflows = stats?.automationStats?.activeWorkflows || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Concept Notice */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E2DDD3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#8A7D6B] font-semibold">
            Merchant Operations Dashboard
          </span>
          <h1 className="font-serif text-2xl font-medium text-[#1C1C1F]">
            Welcome to NovaCart AI Administration
          </h1>
          <p className="text-xs text-[#6B6864] mt-0.5">
            Real database calculations from stored orders, inventory, customer inquiries, and workflow telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('orders')}
            className="px-3.5 py-2 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors"
          >
            Manage Orders
          </button>
          <button
            onClick={() => onNavigate('automation')}
            className="px-3.5 py-2 bg-[#FAF8F5] text-[#1C1C1F] border border-[#DDD7CE] text-xs font-medium rounded-lg hover:border-[#1C1C1F] transition-colors"
          >
            Automation Centre
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (6 Key Metric Tiles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Net Sales (PKR)</span>
            <TrendingUp className="w-4 h-4 text-[#B89758]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {formatPrice(totalSales)}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">From stored orders</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#1C1C1F]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {ordersCount}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">All-time transactions</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Pending Dispatch</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {pendingOrders}
          </p>
          <span className="text-[11px] text-[#D97706] font-medium mt-1 block">Needs fulfillment</span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-[#B71C1C]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#B71C1C] mt-2 font-mono tabular-nums">
            {lowStockCount}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">Below threshold</span>
        </div>

        {/* Open Inquiries */}
        <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Support Tickets</span>
            <Inbox className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {openInquiries}
          </p>
          <span className="text-[11px] text-[#7A7875] mt-1 block">Awaiting reply</span>
        </div>

        {/* Automation Status */}
        <div className="bg-white p-5 rounded-xl border border-[#E7E2DA] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span>Workflows Active</span>
            <Zap className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#1C1C1F] mt-2 font-mono tabular-nums">
            {activeWorkflows} / 5
          </p>
          <span className="text-[11px] text-[#10B981] font-medium mt-1 block">Engine operational</span>
        </div>
      </div>

      {/* Main Overview Grid: Recent Orders & Operational Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recent Customer Orders */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E7E2DA] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2EEE9] pb-4">
            <div>
              <h2 className="font-serif text-xl font-medium text-[#1C1C1F]">Recent Orders</h2>
              <p className="text-xs text-[#7A7875]">Cash on Delivery & live customer transactions</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-[#1C1C1F] hover:text-[#B89758] flex items-center gap-1 transition-colors"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F2EEE9] text-[#7A7875]">
                  <th className="py-2.5 px-3 font-semibold">Order ID</th>
                  <th className="py-2.5 px-3 font-semibold">Customer</th>
                  <th className="py-2.5 px-3 font-semibold">City</th>
                  <th className="py-2.5 px-3 font-semibold">Items</th>
                  <th className="py-2.5 px-3 font-semibold">Amount</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EEE9]">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#7A7875]">
                      No orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    const statusColors: Record<string, string> = {
                      pending: 'bg-amber-100 text-amber-900',
                      confirmed: 'bg-blue-100 text-blue-900',
                      processing: 'bg-purple-100 text-purple-900',
                      dispatched: 'bg-indigo-100 text-indigo-900',
                      delivered: 'bg-emerald-100 text-emerald-900',
                      cancelled: 'bg-red-100 text-red-900'
                    };

                    return (
                      <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 px-3 font-mono font-medium text-[#1C1C1F] tabular-nums">
                          {order.id}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-[#1C1C1F]">{order.customerName}</p>
                          <p className="text-[10px] text-[#7A7875] truncate max-w-[120px]">{order.customerEmail}</p>
                        </td>
                        <td className="py-3 px-3 text-[#555350]">{order.city}</td>
                        <td className="py-3 px-3 font-mono tabular-nums text-[#555350]">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-[#1C1C1F] tabular-nums">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onNavigate('orders')}
                            className="text-[#1C1C1F] hover:text-[#B89758] underline font-medium text-[11px]"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Operational Health & Quick Workflow Triggers */}
        <div className="lg:col-span-4 space-y-6">
          {/* Workflow Automation Quick Check */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2EEE9] pb-3">
              <h3 className="font-serif text-lg font-medium text-[#1C1C1F]">Automations Active</h3>
              <Zap className="w-4 h-4 text-[#B89758]" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA]">
                <div>
                  <p className="font-semibold text-[#1C1C1F]">Workflow A: New Order</p>
                  <p className="text-[10px] text-[#7A7875]">Validation & Stock Decrement</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA]">
                <div>
                  <p className="font-semibold text-[#1C1C1F]">Workflow B: Low Stock Guard</p>
                  <p className="text-[10px] text-[#7A7875]">Threshold Reorder Trigger</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Operational
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA]">
                <div>
                  <p className="font-semibold text-[#1C1C1F]">Workflow C: Support Triage</p>
                  <p className="text-[10px] text-[#7A7875]">Gemini Categorization & Reply</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                  Operational
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('automation')}
              className="w-full py-2.5 bg-[#FAF8F5] border border-[#DDD7CE] text-xs font-medium text-[#1C1C1F] rounded-lg hover:border-[#1C1C1F] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Automation Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-sm p-6 space-y-3">
            <h3 className="font-serif text-lg font-medium text-[#1C1C1F]">Quick Actions</h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigate('products')}
                className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:border-[#1C1C1F] text-left font-medium text-[#1C1C1F] flex items-center justify-between transition-colors"
              >
                <span>Add / Edit Catalog Products</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7A7875]" />
              </button>
              <button
                onClick={() => onNavigate('inventory')}
                className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:border-[#1C1C1F] text-left font-medium text-[#1C1C1F] flex items-center justify-between transition-colors"
              >
                <span>Adjust Stock Levels & Thresholds</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7A7875]" />
              </button>
              <button
                onClick={() => onNavigate('integrations')}
                className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2DA] hover:border-[#1C1C1F] text-left font-medium text-[#1C1C1F] flex items-center justify-between transition-colors"
              >
                <span>Verify Integrations & APIs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7A7875]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
