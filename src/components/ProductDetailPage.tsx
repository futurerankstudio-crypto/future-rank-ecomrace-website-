import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types/index.ts';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    setActiveView,
    formatPrice,
    addToCart,
    wishlist,
    toggleWishlist,
    setIsAssistantOpen
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImage, setActiveImage] = useState(0);
  const galleryImages = [product.images[0], 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=78', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=78'];
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.availableColours[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'sizing' | 'shipping'>('details');
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes[0] || 'M');
      setSelectedColor(product.availableColours[0]?.name || 'Standard');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const unitPrice = product.salePrice || product.price;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      setFeedback('Successfully added to your shopping bag.');
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback(res.message);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-6 sm:py-8 md:py-14 border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#7A7875] mb-8">
          <button
            onClick={() => setActiveView('storefront')}
            className="hover:text-[#1C1C1F] transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button
            onClick={() => setActiveView('shop')}
            className="hover:text-[#1C1C1F] transition-colors"
          >
            Catalogue
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1C1C1F] font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Back Link */}
        <button
          onClick={() => setActiveView('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A7875] hover:text-[#1C1C1F] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalogue</span>
        </button>

        {/* PDP Layout: Sticky Gallery (Left) & Contiguous Purchase Module (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-12 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-[#F3EFEA] border border-[#E7E2DA] aspect-[4/5] shadow-sm">
              <img
                src={galleryImages[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                loading="eager" decoding="async"
                referrerPolicy="no-referrer"
              />
              {product.salePrice && (
                <span className="absolute top-4 left-4 bg-[#B89758] text-white text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
                  Seasonal Sale
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {galleryImages.map((src, index) => <button key={src} type="button" onClick={() => setActiveImage(index)} aria-label={`Show product image ${index+1}`} className={`rounded-lg overflow-hidden border-2 aspect-square bg-[#F3EFEA] ${activeImage===index?'border-[#1C1C1F]':'border-[#E7E2DA]'}`}><img src={src} alt={`${product.name} gallery view ${index+1}`} loading="lazy" decoding="async" className="w-full h-full object-cover"/></button>)}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] shadow-sm space-y-6 lg:sticky lg:top-28">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-widest text-[#8A7D6B] font-medium">
                  {product.category}
                </span>
                <span className="font-mono text-[11px] text-[#9A9690] tabular-nums">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl font-medium text-[#1C1C1F] mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3 font-mono tabular-nums">
                <span className="text-2xl font-semibold text-[#1C1C1F]">
                  {formatPrice(unitPrice)}
                </span>
                {product.salePrice && (
                  <span className="text-base line-through text-[#9A9690]">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              <div className="mt-2 text-xs">
                {isOutOfStock ? (
                  <span className="text-[#B71C1C] font-medium">Sold Out · Reordering</span>
                ) : isLowStock ? (
                  <span className="text-[#9C4221] font-medium">Low Stock: Only {product.stock} pieces remaining</span>
                ) : (
                  <span className="text-[#2E7D32] font-medium">In Stock · Ready for Immediate Dispatch</span>
                )}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#1C1C1F] mb-2">
                <span>Selected Shade: <span className="font-normal text-[#6B6864]">{selectedColor}</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.availableColours.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full border transition-all ${
                      selectedColor === c.name
                        ? 'ring-2 ring-offset-2 ring-[#1C1C1F] scale-110'
                        : 'border-[#DDD7CE] hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={`Select ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#1C1C1F] mb-2">
                <span>Select Size</span>
                <button
                  onClick={() => setActiveTab('sizing')}
                  className="text-[#B89758] underline underline-offset-2 hover:text-[#8F7239]"
                >
                  Size Guide & Measurements
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all ${
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
            <div>
              <span className="text-xs font-medium text-[#1C1C1F] block mb-2">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#DDD7CE] rounded-lg bg-[#FAF8F5]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-1.5 text-sm text-[#4A4845] hover:bg-[#EAE4D9]"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-mono font-medium tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3.5 py-1.5 text-sm text-[#4A4845] hover:bg-[#EAE4D9]"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#7A7875] font-mono tabular-nums">
                  Total: {formatPrice(unitPrice * quantity)}
                </span>
              </div>
            </div>

            {/* Feedback message */}
            {feedback && (
              <div className="text-xs font-medium text-center py-2 px-3 bg-[#E8F5E9] text-[#2E7D32] rounded-lg animate-fadeIn">
                {feedback}
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isOutOfStock
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-[#1C1C1F] text-[#FAF8F5] hover:bg-[#2D2D32]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3.5 border border-[#DDD7CE] rounded-lg hover:border-[#1C1C1F] text-[#4A4845] hover:text-[#B89758] transition-colors"
                title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#B89758] text-[#B89758]' : ''}`} />
              </button>
            </div>

            {/* AI Stylist Recommendation Hook */}
            <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E7E2DA] flex items-center justify-between text-xs text-[#555350]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B89758] shrink-0" />
                <span>Wondering how to pair this piece?</span>
              </div>
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="font-medium text-[#1C1C1F] underline underline-offset-4 hover:text-[#B89758] shrink-0"
              >
                Ask Stylist
              </button>
            </div>

            {/* Assurance & Policies Strip */}
            <div className="border-t border-[#F2EEE9] pt-4 space-y-2.5 text-xs text-[#6B6864]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#B89758] shrink-0" />
                <span><strong>Nationwide Express:</strong> 24–48 hours delivery via TCS</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B89758] shrink-0" />
                <span><strong>Payment:</strong> Cash on Delivery (COD) gladly accepted</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-[#B89758] shrink-0" />
                <span><strong>Exchange:</strong> 7-day hassle-free size and product exchange</span>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="border-t border-[#E7E2DA] pt-4">
              <div className="flex items-center gap-4 border-b border-[#F2EEE9] pb-2 text-xs font-medium text-[#7A7875]">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-1 ${activeTab === 'details' ? 'border-b-2 border-[#1C1C1F] text-[#1C1C1F]' : 'hover:text-[#1C1C1F]'}`}
                >
                  Fabric & Craft
                </button>
                <button
                  onClick={() => setActiveTab('sizing')}
                  className={`pb-1 ${activeTab === 'sizing' ? 'border-b-2 border-[#1C1C1F] text-[#1C1C1F]' : 'hover:text-[#1C1C1F]'}`}
                >
                  Size Matrix
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-1 ${activeTab === 'shipping' ? 'border-b-2 border-[#1C1C1F] text-[#1C1C1F]' : 'hover:text-[#1C1C1F]'}`}
                >
                  Policies
                </button>
              </div>

              <div className="pt-3 text-xs text-[#555350] leading-relaxed">
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p>{product.description}</p>
                    <p><strong>Composition:</strong> {product.fabricDetails}</p>
                    <p><strong>Care:</strong> Dry clean only to preserve fine zari threadwork and pure natural silk weave.</p>
                  </div>
                )}
                {activeTab === 'sizing' && (
                  <div className="space-y-2">
                    <p>All measurements are in inches. Standard Pakistani pret fits:</p>
                    <div className="grid grid-cols-4 gap-2 p-2 bg-[#F9F7F2] rounded text-[11px] font-mono tabular-nums">
                      <div><strong>Size</strong><br/>XS<br/>S<br/>M<br/>L</div>
                      <div><strong>Chest</strong><br/>36&quot;<br/>38&quot;<br/>40&quot;<br/>43&quot;</div>
                      <div><strong>Waist</strong><br/>32&quot;<br/>34&quot;<br/>36&quot;<br/>39&quot;</div>
                      <div><strong>Length</strong><br/>40&quot;<br/>41&quot;<br/>42&quot;<br/>43&quot;</div>
                    </div>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p><strong>Standard Dispatch:</strong> 24-48 hours within major Pakistani cities (Karachi, Lahore, Islamabad, Faisalabad).</p>
                    <p><strong>Shipping Rate:</strong> Free on orders over PKR 25,000; PKR 350 for standard orders.</p>
                    <p><strong>Returns:</strong> Items must be in original condition with security tags attached.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#E7E2DA]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8A7D6B] font-medium">Complete The Look</span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1C1C1F] font-medium mt-1">
                  Related Designs
                </h2>
              </div>
              <button
                onClick={() => setActiveView('shop')}
                className="text-xs font-medium text-[#1C1C1F] underline underline-offset-4 hover:text-[#B89758]"
              >
                View Collection
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
