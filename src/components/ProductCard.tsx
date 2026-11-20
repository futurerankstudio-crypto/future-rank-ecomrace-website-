import React, { useState } from 'react';
import { Product } from '../types/index.ts';
import { useStore } from '../context/StoreContext.tsx';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    openProductDetail,
    setQuickViewProduct,
    addToCart,
    wishlist,
    toggleWishlist
  } = useStore();

  const [selectedColor, setSelectedColor] = useState(
    product.availableColours[0]?.name || 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState(
    product.availableSizes[0] || 'Standard'
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(product, selectedSize, selectedColor, 1);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCardClick = () => {
    openProductDetail(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative cursor-pointer flex flex-col rounded-xl overflow-hidden bg-white border border-[#E7E2DA] hover:border-[#C4B8A5] hover:shadow-md transition-all duration-300"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F4F1EA]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />

        {/* Top Badges / Metadata */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.salePrice ? (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-[#B89758] text-white rounded">
              Seasonal Sale
            </span>
          ) : isLowStock ? (
            <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 bg-[#FAF8F5]/90 text-[#9C4221] backdrop-blur-sm rounded border border-[#9C4221]/20">
              Only {product.stock} left
            </span>
          ) : isOutOfStock ? (
            <span className="text-[11px] font-medium tracking-wide px-2 py-0.5 bg-neutral-900/80 text-neutral-300 backdrop-blur-sm rounded">
              Out of stock
            </span>
          ) : (
            <span className="text-[11px] font-medium tracking-wide text-neutral-600 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded">
              In Stock
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="pointer-events-auto p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#4A4845] hover:text-[#B89758] hover:bg-white transition-colors shadow-sm"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'fill-[#B89758] text-[#B89758]' : ''
              }`}
            />
          </button>
        </div>

        {/* Hover Quick Actions Drawer */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-sm text-xs font-medium text-[#1C1C1F] rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#7A7875]" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors ${
              isOutOfStock
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-[#1C1C1F] text-[#FAF8F5] hover:bg-[#2D2D32]'
            }`}
            title="Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="sr-only">Add to bag</span>
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-grow bg-white">
        <div>
          {/* Category & SKU in quiet unboxed text */}
          <div className="flex items-center justify-between text-xs text-[#7A7875]">
            <span className="uppercase tracking-wider text-[11px] font-medium">{product.category}</span>
            <span className="font-mono text-[10px] tabular-nums text-[#9A9690]">{product.sku}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-base sm:text-lg font-medium text-[#1C1C1F] group-hover:text-[#B89758] transition-colors mt-1 line-clamp-2 min-h-[2.8rem] sm:min-h-0">
            {product.name}
          </h3>

          {/* Price with tabular numerals */}
          <div className="mt-2 flex items-baseline gap-2 font-mono text-sm tabular-nums">
            {product.salePrice ? (
              <>
                <span className="font-semibold text-[#1C1C1F]">{formatPrice(product.salePrice)}</span>
                <span className="text-xs line-through text-[#9A9690]">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="font-semibold text-[#1C1C1F]">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        {/* Variant Controls: Colors & Sizes */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#F2EEE9] flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Color Dots */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.availableColours.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor === color.name
                    ? 'ring-1 ring-offset-1 ring-[#1C1C1F] scale-110'
                    : 'border-[#DDD7CE]'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>

          {/* Size Selectors */}
          <div className="flex items-center gap-1 text-[11px] text-[#6B6864]" onClick={(e) => e.stopPropagation()}>
            {product.availableSizes.slice(0, 3).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  selectedSize === size
                    ? 'bg-[#1C1C1F] text-white font-medium'
                    : 'hover:bg-[#F2EEE9] text-[#4A4845]'
                }`}
              >
                {size}
              </button>
            ))}
            {product.availableSizes.length > 3 && (
              <span className="text-[10px] text-[#9A9690]">+{product.availableSizes.length - 3}</span>
            )}
          </div>
        </div>

        {/* Temporary Added Notification */}
        {addedNotice && (
          <div className="mt-2 text-center text-[11px] text-[#2E7D32] bg-[#E8F5E9] py-1 rounded font-medium animate-fadeIn">
            Added to bag
          </div>
        )}
      </div>
    </div>
  );
};
