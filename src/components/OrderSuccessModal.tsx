import React from 'react';
import { Order } from '../types/index.ts';
import { useStore } from '../context/StoreContext.tsx';
import { CheckCircle2, ArrowRight, LayoutDashboard, Truck, Calendar } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { formatPrice, setActiveView } = useStore();

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E7E2DA] overflow-hidden p-6 sm:p-8">
        {/* Header Icon */}
        <div className="text-center space-y-3 pb-6 border-b border-[#E7E2DA]">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B89758] font-semibold">
              Order Confirmed & Stored
            </span>
            <h2 className="font-serif text-3xl font-medium text-[#1C1C1F] mt-1">
              Thank You, {order.customerName}
            </h2>
            <p className="text-xs text-[#7A7875] mt-1 font-mono tabular-nums">
              Order Reference: <strong className="text-[#1C1C1F]">{order.id}</strong>
            </p>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="py-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-[#E7E2DA]">
            <div>
              <p className="text-[#8A857D] font-medium uppercase text-[10px] tracking-wider">Shipping Address</p>
              <p className="font-medium text-[#1C1C1F] mt-1">{order.customerName}</p>
              <p className="text-[#555350]">{order.shippingAddress}, {order.city}</p>
              <p className="text-[#555350]">Phone: {order.customerPhone}</p>
            </div>
            <div>
              <p className="text-[#8A857D] font-medium uppercase text-[10px] tracking-wider">Payment & Logistics</p>
              <p className="font-medium text-[#1C1C1F] mt-1">Cash on Delivery (Pakistan)</p>
              <p className="text-[#555350]">Dispatch: 24–48 Hours (TCS Express)</p>
              <p className="text-[#555350] font-mono">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="border border-[#E7E2DA] rounded-xl overflow-hidden bg-white">
            <div className="px-4 py-2.5 bg-[#F4F1EA] text-xs font-medium text-[#4A4845] border-b border-[#E7E2DA]">
              Items In This Order ({order.items.length})
            </div>
            <div className="p-4 divide-y divide-[#F2EEE9] max-h-48 overflow-y-auto">
              {order.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-10 h-12 object-cover rounded bg-[#F4F1EA]"
                    />
                    <div>
                      <p className="font-medium text-[#1C1C1F]">{item.productName}</p>
                      <p className="text-[#7A7875] text-[11px]">
                        Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-[#1C1C1F]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#E7E2DA] flex items-center justify-between text-xs">
              <span className="font-medium text-[#6B6864]">Total Amount to Pay</span>
              <span className="font-mono text-sm font-bold tabular-nums text-[#1C1C1F]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Workflow Status Confirmation */}
          <div className="p-3 bg-[#F4F0E8] rounded-xl border border-[#E7E2DA] text-xs text-[#555350] space-y-1">
            <div className="flex items-center gap-2 font-medium text-[#1C1C1F]">
              <Truck className="w-4 h-4 text-[#B89758]" />
              <span>Automation Centre Notification Triggered</span>
            </div>
            <p className="text-[11px] text-[#7A7875]">
              Workflow A has validated this order, decremented live inventory, and logged an execution record on the merchant administration console.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              setActiveView('shop');
            }}
            className="flex-1 py-3 px-4 bg-white border border-[#DDD7CE] text-xs font-medium text-[#1C1C1F] rounded-lg hover:border-[#1C1C1F] hover:bg-[#F3EFEA] transition-colors"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => {
              onClose();
              setActiveView('admin');
            }}
            className="flex-1 py-3 px-4 bg-[#1C1C1F] text-[#FAF8F5] text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Inspect Order in Admin Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
