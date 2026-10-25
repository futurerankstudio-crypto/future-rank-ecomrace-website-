import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { Order, OrderStatus } from '../../types/index.ts';
import { Search, Filter, Eye, Clock, CheckCircle2, XCircle, FileText, Send } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { formatPrice, refreshNotifications } = useStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        if (selectedOrder) {
          const updated = data.orders.find((o: Order) => o.id === selectedOrder.id);
          if (updated) setSelectedOrder(updated);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: `Merchant updated order state to ${newStatus.toUpperCase()}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        setSelectedOrder(data.order);
        await refreshNotifications();
      }
    } catch {
      // ignore
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (orderId: string) => {
    if (!newNote.trim()) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedOrder?.status,
          note: `Internal Note: ${newNote.trim()}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        setNewNote('');
      }
    } catch {
      // ignore
    }
  };

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-amber-100 text-amber-900 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-900 border-blue-200',
    processing: 'bg-purple-100 text-purple-900 border-purple-200',
    dispatched: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    delivered: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    cancelled: 'bg-red-100 text-red-900 border-red-200'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7E2DA] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#1C1C1F]">Order Management</h2>
          <p className="text-xs text-[#7A7875]">
            Review customer orders, verify dispatch, log internal fulfillment notes, and update statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A7875] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, name, city, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs pl-9 pr-3.5 py-2 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F] w-48 sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#7A7875]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-2 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E7E2DA] text-[#7A7875]">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Date & Time</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Items</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE9]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#7A7875]">
                    Loading orders from store database...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#7A7875]">
                    No orders matching search or status filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#1C1C1F] tabular-nums">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-[#7A7875]">
                      {new Date(order.createdAt).toLocaleDateString()} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#1C1C1F]">{order.customerName}</p>
                      <p className="text-[10px] text-[#7A7875]">{order.customerPhone}</p>
                    </td>
                    <td className="py-3 px-4 text-[#555350]">
                      {order.city}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-[#555350]">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#1C1C1F] tabular-nums">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-semibold text-[#6B5A40] bg-[#F4F1EA] px-2 py-0.5 rounded border border-[#E7E2DA]">
                        Cash on Delivery
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 text-xs font-medium text-[#1C1C1F] bg-[#FAF8F5] border border-[#DDD7CE] rounded hover:border-[#1C1C1F] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal with Timeline & Internal Notes */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E7E2DA] max-w-3xl w-full p-6 sm:p-8 overflow-hidden my-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E2DA]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8A7D6B] font-semibold">
                  Order Details
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1C1C1F] mt-0.5">
                  Order Ref: {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-[#7A7875] hover:text-[#1C1C1F]"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-[#7A7875]">Current Fulfillment State:</span>
                <span className={`ml-2 px-2.5 py-1 rounded font-semibold capitalize border ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#7A7875]">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="px-2.5 py-1 rounded border border-[#DDD7CE] bg-[#FAF8F5] font-medium text-xs focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered (Triggers Care Workflow)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-[#E7E2DA]">
              <div className="space-y-1">
                <p className="text-[#8A7D6B] font-semibold uppercase text-[10px]">Customer Contact</p>
                <p className="font-medium text-[#1C1C1F]">{selectedOrder.customerName}</p>
                <p className="text-[#555350]">{selectedOrder.customerEmail}</p>
                <p className="text-[#555350]">Phone: {selectedOrder.customerPhone}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[#8A7D6B] font-semibold uppercase text-[10px]">Delivery Logistics</p>
                <p className="text-[#555350]">{selectedOrder.shippingAddress}</p>
                <p className="text-[#555350]">{selectedOrder.city}, Postal: {selectedOrder.postalCode}</p>
                <p className="font-medium text-[#1C1C1F]">Payment: Cash on Delivery</p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="bg-white rounded-xl border border-[#E7E2DA] overflow-hidden">
              <div className="px-4 py-2.5 bg-[#F4F1EA] text-xs font-semibold text-[#4A4845] border-b border-[#E7E2DA]">
                Purchased Garments ({selectedOrder.items.length})
              </div>
              <div className="divide-y divide-[#F2EEE9] p-4 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.productName} className="w-10 h-12 object-cover rounded bg-[#F4F1EA]" />
                      <div>
                        <p className="font-medium text-[#1C1C1F]">{it.productName}</p>
                        <p className="text-[11px] text-[#7A7875]">Size: {it.size} · Color: {it.color} · Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-semibold text-[#1C1C1F]">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#E7E2DA] flex items-center justify-between text-xs">
                <span>Shipping: {selectedOrder.shippingCost === 0 ? 'Complimentary' : formatPrice(selectedOrder.shippingCost)}</span>
                <span className="font-mono text-sm font-bold text-[#1C1C1F]">
                  Total: {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Order Timeline (Audit Trail) */}
            <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] space-y-3">
              <p className="text-xs font-semibold text-[#1C1C1F] uppercase tracking-wider">
                Order History & Status Timeline
              </p>
              <div className="space-y-2 text-xs">
                {selectedOrder.timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 pl-2 border-l-2 border-[#B89758]/50 py-1">
                    <Clock className="w-3.5 h-3.5 text-[#B89758] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[#1C1C1F] font-medium">{event.note}</p>
                      <p className="text-[10px] text-[#7A7875]">
                        Actor: {event.actor} · {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Staff Notes */}
            <div className="bg-white p-4 rounded-xl border border-[#E7E2DA] space-y-3">
              <p className="text-xs font-semibold text-[#1C1C1F] uppercase tracking-wider">
                Internal Merchant Notes
              </p>

              {selectedOrder.internalNotes && selectedOrder.internalNotes.length > 0 && (
                <div className="space-y-1 text-xs text-[#555350]">
                  {selectedOrder.internalNotes.map((note, idx) => (
                    <div key={idx} className="p-2 bg-[#FAF8F5] rounded border border-[#E7E2DA]">
                      {note}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Record an internal fulfillment note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F]"
                />
                <button
                  onClick={() => handleAddNote(selectedOrder.id)}
                  disabled={!newNote.trim()}
                  className="px-3.5 py-2 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] disabled:bg-neutral-300"
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-[#FAF8F5] border border-[#DDD7CE] text-xs font-medium text-[#1C1C1F] rounded-lg hover:border-[#1C1C1F]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
