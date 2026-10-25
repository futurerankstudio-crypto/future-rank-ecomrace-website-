import React from 'react';
import { Sparkles, Shield, Compass } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-20 bg-[#F4F0E8] border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#8A7D6B] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#B89758]" />
              <span>Atelier Philosophy & Concept</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1C1F] leading-[1.15] text-balance">
              Where Generational Craft Meets Modern Commerce.
            </h2>

            <p className="text-sm md:text-base text-[#555350] leading-relaxed">
              NovaCart AI was envisioned as an architectural showcase for modern luxury fashion retailers. Rooted in the rich sartorial traditions of South Asian hand-embroidery, pure silk weaves, and clean contemporary silhouettes, every element reflects intentional restraint.
            </p>

            <p className="text-sm md:text-base text-[#555350] leading-relaxed">
              Behind the editorial storefront lies an intelligent commerce engine engineered by <strong>Future Rank Studio</strong>. It demonstrates how boutique fashion brands can combine live inventory consistency, transparent Cash on Delivery logistics, and AI-grounded customer assistance.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#DDD7CE]">
              <div>
                <h4 className="font-serif text-lg font-medium text-[#1C1C1F] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#B89758]" />
                  <span>Curated Pret</span>
                </h4>
                <p className="text-xs text-[#706D68] mt-1 leading-relaxed">
                  Pure 80g raw silk, breathable Belgian linens, and authentic hand-tilla marori craft.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-lg font-medium text-[#1C1C1F] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#B89758]" />
                  <span>Commerce Integrity</span>
                </h4>
                <p className="text-xs text-[#706D68] mt-1 leading-relaxed">
                  Server-validated totals, real inventory decrements, and genuine automated workflows.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Stage */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#EAE4D9] shadow-lg border border-[#DDD7CE] aspect-[4/3]">
              <img
                src="/src/assets/images/product_artisan_accessories_1792821529328.jpg"
                alt="NovaCart AI Artisanal Craftsmanship"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] uppercase tracking-widest text-[#DFCBB5] font-medium">
                  Future Rank Studio Demonstration
                </span>
                <p className="font-serif text-xl sm:text-2xl mt-1 font-light">
                  Crafted for boutiques, apparel designers, and digital fashion brands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
