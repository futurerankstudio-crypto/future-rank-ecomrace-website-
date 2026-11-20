import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { Hero } from './Hero.tsx';
import { FeaturedCollections } from './FeaturedCollections.tsx';
import { ProductCard } from './ProductCard.tsx';
import { BrandStory } from './BrandStory.tsx';
import { AgencyInquirySection } from './AgencyInquirySection.tsx';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const StorefrontHome: React.FC = () => {
  const { products, setActiveView, setSelectedCategory, setIsAssistantOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'new_arrivals'>('bestsellers');

  const bestsellers = products.filter((p) => p.isFeatured || p.stock < 15).slice(0, 8);
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const displayedProducts = activeTab === 'bestsellers' ? bestsellers : newArrivals;

  return (
    <div className="space-y-0">
      {/* Hero Campaign */}
      <Hero />

      {/* Editorial image story */}
      <section className="py-10 sm:py-16 md:py-20 bg-white border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
            <div><span className="text-xs uppercase tracking-[0.22em] text-[#8A7D6B]">The art of dressing</span><h2 className="font-serif text-3xl md:text-4xl mt-2">Made to be remembered.</h2></div>
            <p className="text-sm text-[#706D68] max-w-md">A closer look at refined silhouettes, thoughtful details and timeless textures.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-5">
            <div className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#F3EFEA]"><img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=78" alt="Fashion editorial portrait" loading="lazy" decoding="async" className="w-full h-full object-cover"/><span className="absolute bottom-5 left-5 text-white text-xs uppercase tracking-[0.2em]">The editorial edit</span></div>
            <div className="relative overflow-hidden rounded-2xl aspect-square bg-[#F3EFEA]"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=75" alt="Contemporary fashion styling" loading="lazy" decoding="async" className="w-full h-full object-cover"/></div>
            <div className="relative overflow-hidden rounded-2xl aspect-square bg-[#F3EFEA]"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=75" alt="Curated wardrobe details" loading="lazy" decoding="async" className="w-full h-full object-cover"/></div>
            <div className="col-span-2 relative overflow-hidden rounded-2xl aspect-[2/1] bg-[#F3EFEA]"><img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=75" alt="Luxury fashion collection" loading="lazy" decoding="async" className="w-full h-full object-cover"/></div>
            <div className="relative overflow-hidden rounded-2xl aspect-square bg-[#F3EFEA]"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=650&q=68" alt="Modern womenswear fashion look" loading="lazy" decoding="async" className="w-full h-full object-cover"/></div>
            <div className="relative overflow-hidden rounded-2xl aspect-square bg-[#F3EFEA]"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=650&q=68" alt="Fashion portrait and styling inspiration" loading="lazy" decoding="async" className="w-full h-full object-cover"/></div>
          </div>
        </div>
      </section>

      {/* Featured Collections Showcase */}
      <FeaturedCollections />

      {/* Bestsellers and New Arrivals Showcase */}
      <section className="py-12 sm:py-20 bg-white border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8A7D6B] font-medium">
                Atelier Selections
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1F] font-medium mt-1">
                Bestsellers & New Arrivals
              </h2>
            </div>

            {/* Segmented Filter Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] border border-[#DDD7CE] rounded-lg self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'bestsellers'
                    ? 'bg-[#1C1C1F] text-white shadow-sm'
                    : 'text-[#6B6864] hover:text-[#1C1C1F]'
                }`}
              >
                Bestsellers
              </button>
              <button
                onClick={() => setActiveTab('new_arrivals')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'new_arrivals'
                    ? 'bg-[#1C1C1F] text-white shadow-sm'
                    : 'text-[#6B6864] hover:text-[#1C1C1F]'
                }`}
              >
                New Arrivals
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setActiveView('shop');
              }}
              className="px-6 py-3 bg-[#FAF8F5] border border-[#DDD7CE] text-xs font-semibold text-[#1C1C1F] rounded-lg hover:border-[#1C1C1F] hover:bg-[#F2ECE1] transition-colors inline-flex items-center gap-2"
            >
              <span>Explore All 27 Designs in Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* "Find Your Perfect Look" Interactive Concierge Banner */}
      <section className="py-10 sm:py-16 bg-[#F8F5EE] border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl bg-white border border-[#E7E2DA] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#B89758] font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>AI-Assisted Shopping Support</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1C1F] leading-tight">
                Find Your Perfect Look with Our Stylist Concierge
              </h3>
              <p className="text-sm text-[#555350] leading-relaxed max-w-2xl">
                Unsure about bust and waist sizing for raw silk pret? Looking for color coordinates for an upcoming evening soiree? Our smart assistant is grounded in our real catalogue and store policies.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="px-6 py-3.5 bg-[#1C1C1F] text-white text-xs font-semibold rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#B89758]" />
                <span>Launch Shopping Assistant</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('Elegant Pret');
                  setActiveView('shop');
                }}
                className="px-6 py-3.5 bg-[#FAF8F5] border border-[#DDD7CE] text-xs font-medium text-[#1C1C1F] rounded-lg hover:border-[#1C1C1F] transition-colors text-center"
              >
                Browse Pret Directly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Store Trust / Guarantees Strip */}
      <section className="py-9 sm:py-12 bg-white border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#B89758] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#1C1C1F]">Express Delivery Across Pakistan</h4>
                <p className="text-xs text-[#7A7875] mt-1 leading-relaxed">
                  24–48 hours nationwide transit with TCS Express. Free delivery on orders over Rs. 25,000.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#B89758] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#1C1C1F]">Cash on Delivery</h4>
                <p className="text-xs text-[#7A7875] mt-1 leading-relaxed">
                  Inspect your parcel and pay upon delivery. Safe and trusted domestic fulfillment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] flex items-center justify-center text-[#B89758] shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#1C1C1F]">7-Day Hassle-Free Exchange</h4>
                <p className="text-xs text-[#7A7875] mt-1 leading-relaxed">
                  Effortless size swaps and product exchanges for unworn garments with original tags intact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <BrandStory />

      {/* Future Rank Studio "Build Your E-commerce Store" Consultation Section */}
      <AgencyInquirySection />
    </div>
  );
};
