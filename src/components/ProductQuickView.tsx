import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { X, ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const ProductQuickView: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    formatPrice,
    addToCart,
    openProductDetail
  } = useStore();

  const [selectedSize, setSelectedSize] = useState(
    quickViewProduct?.availableSizes[0] || 'M'
  );
  const [selectedColor, setSelectedColor] = useState(
    quickViewProduct?.availableColours[0]?.name || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!quickViewProduct) return null;

  const isOutOfStock = quickViewProduct.stock <= 0;
  const unitPrice = quickViewProduct.salePrice || quickViewProduct.price;

  const handleAdd = () => {
    if (isOutOfStock) return;
    const res = addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    if (res.success) {
      setFeedback('Added to your shopping bag.');
      setTimeout(() => {
        setFeedback(null);
        setQuickViewProduct(null);
      }, 1200);
    } else {
      setFeedback(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden border border-[#E7E2DA] max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-[#4A4845] hover:text-[#1C1C1F] hover:bg-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-[#F3EFEA] relative aspect-square md:aspect-auto">
          <img
            src={quickViewProduct.images[0]}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {quickViewProduct.stock <= quickViewProduct.lowStockThreshold && quickViewProduct.stock > 0 && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#9C4221] text-xs font-medium px-2.5 py-1 rounded shadow-sm">
              Limited Availability: Only {quickViewProduct.stock} left
            </div>
          )}
        </div>

        {/* Right: Product Purchase Module */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8A7D6B] font-medium">
              {quickViewProduct.category}
            </div>

            <h2 className="font-serif text-2xl font-medium text-[#1C1C1F] mt-1">
              {quickViewProduct.name}
            </h2>

            {/* Price */}
            <div className="mt-2 flex items-baseline gap-3 font-mono tabular-nums">
              <span className="text-xl font-semibold text-[#1C1C1F]">
                {formatPrice(unitPrice)}
              </span>
              {quickViewProduct.salePrice && (
                <span className="text-sm line-through text-[#9A9690]">
                  {formatPrice(quickViewProduct.price)}
                </span>
              )}
            </div>

            <p className="text-xs text-[#6B6864] mt-3 leading-relaxed line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Color Selection */}
            <div className="mt-4">
              <label className="text-xs font-medium text-[#1C1C1F] flex items-center justify-between">
                <span>Colour: <strong className="font-normal text-[#7A7875]">{selectedColor}</strong></span>
              </label>
              <div className="mt-2 flex items-center gap-2">
                {quickViewProduct.availableColours.map((col) => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      selectedColor === col.name
                        ? 'ring-2 ring-offset-2 ring-[#1C1C1F] scale-105'
                        : 'border-[#DDD7CE]'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                    aria-label={`Choose ${col.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#1C1C1F]">Size:</span>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-[#B89758] underline underline-offset-2 hover:text-[#9B7B3C]"
                >
                  Size Guide
                </button>
              </div>

              {showSizeGuide && (
                <div className="mt-2 p-3 bg-[#F4F0E8] rounded-lg text-[11px] text-[#555350] space-y-1">
                  <p><strong>XS:</strong> Chest 36&quot; · Length 40&quot; · Shoulder 14&quot;</p>
                  <p><strong>S:</strong> Chest 38&quot; · Length 41&quot; · Shoulder 14.5&quot;</p>
                  <p><strong>M:</strong> Chest 40&quot; · Length 42&quot; · Shoulder 15&quot;</p>
                  <p><strong>L:</strong> Chest 43&quot; · Length 43&quot; · Shoulder 15.5&quot;</p>
                </div>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {quickViewProduct.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'bg-[#1C1C1F] text-white border-[#1C1C1F]'
                        : 'bg-white text-[#4A4845] border-[#DDD7CE] hover:border-[#1C1C1F]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs font-medium text-[#1C1C1F]">Quantity:</span>
              <div className="flex items-center border border-[#DDD7CE] rounded-lg bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-sm text-[#4A4845] hover:bg-[#F3EFEA]"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-mono tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(quickViewProduct.stock, q + 1))}
                  className="px-3 py-1 text-sm text-[#4A4845] hover:bg-[#F3EFEA]"
                  disabled={quantity >= quickViewProduct.stock}
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-[#7A7875] font-mono tabular-nums">
                ({quickViewProduct.stock} in stock)
              </span>
            </div>
          </div>

          {/* Action Module */}
          <div className="mt-6 pt-4 border-t border-[#E7E2DA] space-y-3">
            {feedback && (
              <div className="text-xs text-center font-medium text-[#2E7D32] bg-[#E8F5E9] py-1.5 rounded">
                {feedback}
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                isOutOfStock
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-[#1C1C1F] text-[#FAF8F5] hover:bg-[#2D2D32]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Sold Out' : `Add to Bag · ${formatPrice(unitPrice * quantity)}`}</span>
            </button>

            <button
              onClick={() => {
                setQuickViewProduct(null);
                openProductDetail(quickViewProduct.id);
              }}
              className="w-full text-xs text-center text-[#6B6864] hover:text-[#1C1C1F] flex items-center justify-center gap-1 transition-colors"
            >
              <span>View full product details & craftsmanship specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Trust Markers */}
            <div className="pt-2 grid grid-cols-3 gap-2 text-[10px] text-[#7A7875] text-center border-t border-[#F2EEE9]">
              <div className="flex flex-col items-center">
                <Truck className="w-3.5 h-3.5 mb-0.5 text-[#B89758]" />
                <span>24-48h Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-3.5 h-3.5 mb-0.5 text-[#B89758]" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-3.5 h-3.5 mb-0.5 text-[#B89758]" />
                <span>7-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
