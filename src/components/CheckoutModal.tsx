import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { Order } from '../types/index.ts';
import { X, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { cart, cartSubtotal, formatPrice, clearCart, refreshProducts, refreshNotifications } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [postalCode, setPostalCode] = useState('54000');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'card_unconfigured'>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isFreeShipping = cartSubtotal >= 25000;
  const shippingCost = cart.length === 0 ? 0 : isFreeShipping ? 0 : 350;
  const totalAmount = cartSubtotal + shippingCost;

  const citiesList = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala'
  ];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !shippingAddress.trim() || !city.trim()) {
      setErrorMessage('Please complete all required shipping fields.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (paymentMethod === 'card_unconfigured') {
      setErrorMessage('Credit/Debit Card payments are currently disabled in demo mode. Please select Cash on Delivery.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          quantity: item.quantity
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      clearCart();
      await refreshProducts();
      await refreshNotifications();
      onOrderSuccess(data.order);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during order submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E7E2DA] overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E7E2DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 text-[#7A7875] hover:text-[#1C1C1F] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#1C1C1F]">Checkout & Verification</h2>
              <p className="text-xs text-[#7A7875]">Demo Storefront · Secure Cash on Delivery Flow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#7A7875] hover:text-[#1C1C1F] rounded-full hover:bg-[#F3EFEA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Environment Notice */}
        <div className="bg-[#F2ECE1] border-b border-[#E4DCcf] px-6 py-2.5 text-xs text-[#6B5A40] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B89758]" />
            <strong>Demo Environment:</strong> Orders update inventory & trigger real automation workflows. No real credit cards are charged.
          </span>
          <span className="font-mono text-[11px] text-[#8A7860]">NovaCart AI v1.0</span>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Shipping & Contact Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#1C1C1F] uppercase tracking-wider mb-4">
                1. Customer & Delivery Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A4845] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4845] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. ayesha@example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4845] mb-1">
                      Contact Phone (Pakistan) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A4845] mb-1">
                    Street Address / Apartment *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="House number, Street, Block, Phase"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4845] mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                    >
                      {citiesList.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4845] mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="54000"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="text-sm font-semibold text-[#1C1C1F] uppercase tracking-wider mb-3">
                2. Payment Method
              </h3>

              <div className="space-y-2.5">
                {/* Cash on Delivery (Active) */}
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#1C1C1F] bg-white shadow-sm'
                    : 'border-[#DDD7CE] bg-[#F4F1EA]'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="mt-1 text-[#1C1C1F]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1C1C1F]">Cash on Delivery (Pakistan)</span>
                      <span className="text-[11px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded font-medium">
                        Active & Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6864] mt-1">
                      Pay cash upon delivery to the courier partner (TCS Express).
                    </p>
                  </div>
                </label>

                {/* Credit Card / Digital Payments (Disabled) */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-dashed border-[#DDD7CE] bg-[#FAF8F5] opacity-60 cursor-not-allowed">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_unconfigured"
                    disabled
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#7A7875]">Online Card Payment (Visa / Mastercard)</span>
                      <span className="text-[10px] text-[#8A7D6B] border border-[#DDD7CE] px-2 py-0.5 rounded font-mono">
                        Requires Gateway Key
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9A9690] mt-1">
                      Guarded in demo mode until live Stripe/JazzCash credentials are authenticated.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-[#FFEBEE] border border-[#FFCDD2] rounded-lg text-xs text-[#B71C1C] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E7E2DA] flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[#1C1C1F] uppercase tracking-wider mb-4">
                Order Summary
              </h3>

              <div className="divide-y divide-[#F2EEE9] max-h-56 overflow-y-auto space-y-2 pr-1">
                {cart.map((item, i) => (
                  <div key={i} className="pt-2 pb-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-12 object-cover rounded bg-[#F4F1EA]"
                      />
                      <div>
                        <p className="font-medium text-[#1C1C1F] line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-[#7A7875]">
                          Size: {item.selectedSize} · Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono tabular-nums font-medium text-[#1C1C1F]">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-4 border-t border-[#E7E2DA] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B6864]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B6864]">
                  <span>Shipping Cost</span>
                  <span className="font-mono tabular-nums">
                    {shippingCost === 0 ? 'Free Delivery' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#F2EEE9] flex justify-between text-base font-semibold text-[#1C1C1F]">
                  <span>Total Payable (PKR)</span>
                  <span className="font-mono tabular-nums">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 px-4 bg-[#1C1C1F] text-[#FAF8F5] text-sm font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing & Recording Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#B89758]" />
                    <span>Confirm Order (Cash on Delivery)</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#8A857D]">
                By submitting, order verification will run and update inventory.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
