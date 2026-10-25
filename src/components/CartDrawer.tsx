import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { X, ShoppingBag, ArrowRight, Trash2, Truck } from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    formatPrice,
    clearCart
  } = useStore();

  if (!isCartOpen) return null;

  // Shipping logic (PKR 350, free over 25,000 PKR)
  const isFreeShipping = cartSubtotal >= 25000;
  const shippingEstimate = cart.length === 0 ? 0 : isFreeShipping ? 0 : 350;
  const estimatedTotal = cartSubtotal + shippingEstimate;

  const handleCheckout = () => {
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl border-l border-[#E7E2DA] flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#E7E2DA] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1C1C1F]" />
              <h2 className="font-serif text-xl font-medium text-[#1C1C1F]">Shopping Bag</h2>
              <span className="text-xs font-mono text-[#7A7875] tabular-nums">({cart.length})</span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#7A7875] hover:text-[#1C1C1F] rounded-full hover:bg-[#F3EFEA] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#F3EFEA] flex items-center justify-center text-[#7A7875]">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#1C1C1F]">Your Bag is Empty</h3>
                <p className="text-xs text-[#7A7875] max-w-xs mx-auto">
                  Discover our new season pret, contemporary suits, and handcrafted accessories.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Tracker */}
                <div className="p-3 bg-[#F4F1EA] rounded-xl border border-[#E7E2DA] text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-medium text-[#1C1C1F]">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#B89758]" />
                      {isFreeShipping ? 'Complimentary Express Delivery Unlocked' : 'Express Delivery across Pakistan'}
                    </span>
                    {!isFreeShipping && (
                      <span className="font-mono text-[11px] text-[#7A7875]">
                        Add {formatPrice(25000 - cartSubtotal)} for Free Shipping
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-[#E3DCD1] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#B89758] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (cartSubtotal / 25000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#EFEBE4]">
                  {cart.map((item, idx) => (
                    <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="py-4 flex gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded-lg bg-[#F3EFEA] border border-[#E7E2DA] shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium text-[#1C1C1F] line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                              className="text-[#9A9690] hover:text-[#B71C1C] p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-xs text-[#7A7875] mt-1 space-x-2">
                            <span>Size: <strong>{item.selectedSize}</strong></span>
                            <span>·</span>
                            <span>Colour: <strong>{item.selectedColor}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity stepper */}
                          <div className="flex items-center border border-[#DDD7CE] rounded-md bg-white">
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity - 1)}
                              className="px-2 py-0.5 text-xs text-[#4A4845] hover:bg-[#F3EFEA]"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-xs font-mono tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity + 1)}
                              className="px-2 py-0.5 text-xs text-[#4A4845] hover:bg-[#F3EFEA]"
                              disabled={item.quantity >= item.product.stock}
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <span className="font-mono text-xs font-semibold tabular-nums text-[#1C1C1F]">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-[#8A857D] hover:text-[#B71C1C] underline"
                  >
                    Empty Bag
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E7E2DA] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B6864]">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-[#1C1C1F] tabular-nums">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B6864]">
                  <span>Estimated Shipping (Pakistan)</span>
                  <span className="font-mono font-medium text-[#1C1C1F] tabular-nums">
                    {shippingEstimate === 0 ? 'Complimentary' : formatPrice(shippingEstimate)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#F2EEE9] flex justify-between text-sm font-semibold text-[#1C1C1F]">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums">{formatPrice(estimatedTotal)}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#7A7875] bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E7E2DA] flex items-center justify-between">
                <span>Payment Method</span>
                <span className="font-medium text-[#1C1C1F]">Cash on Delivery (Pakistan)</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-[#1C1C1F] text-[#FAF8F5] text-sm font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs text-[#7A7875] hover:text-[#1C1C1F] transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
