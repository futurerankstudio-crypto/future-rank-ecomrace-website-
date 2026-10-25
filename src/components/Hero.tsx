import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveView, setSelectedCategory, setIsAssistantOpen } = useStore();

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          {/* Left Column: Editorial Typography & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[#8A7D6B] font-medium">
              <span>Autumn / Winter Edit</span>
              <span aria-hidden="true">·</span>
              <span>Pure Raw Silk & Linen</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1C1C1F] leading-[1.08] text-balance">
              Your Style. <br />
              <span className="italic font-normal text-[#8A7D6B]">Your Story.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#555350] leading-relaxed max-w-lg">
              Explore thoughtfully curated fashion for every moment. Hand-embroidered Pakistani luxury pret, contemporary tailored suiting, and timeless artisanal heirlooms.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setActiveView('shop');
                }}
                className="px-6 py-3.5 bg-[#1C1C1F] text-[#FAF8F5] text-sm font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <span>Shop Collection</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('Elegant Pret');
                  setActiveView('shop');
                }}
                className="px-6 py-3.5 bg-white text-[#1C1C1F] border border-[#D5CEC2] text-sm font-medium rounded-lg hover:border-[#1C1C1F] hover:bg-[#F7F4EE] transition-colors whitespace-nowrap"
              >
                Explore New Arrivals
              </button>
            </div>

            {/* AI Assistant Callout */}
            <div className="pt-4 border-t border-[#E8E3DA] flex items-center justify-between text-xs text-[#6B6864]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B89758]" />
                <span>Need sizing or styling advice?</span>
              </div>
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="font-medium text-[#1C1C1F] underline underline-offset-4 hover:text-[#B89758] transition-colors"
              >
                Ask Smart Stylist
              </button>
            </div>
          </div>

          {/* Right Column: Campaign Focal Photography */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden bg-[#F1ECE3] shadow-md aspect-[16/10] lg:aspect-auto lg:h-[540px]">
              <img
                src="/src/assets/images/hero_fashion_editorial_1792821526246.jpg"
                alt="NovaCart AI Luxury Campaign"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Campaign Inset Label */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#DFCBB5] font-medium">Atelier Series</p>
                  <p className="font-serif text-xl sm:text-2xl font-light">The Zari & Silk Capsule</p>
                </div>
                <span className="text-xs font-mono tabular-nums text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded border border-white/20">
                  Ready to Wear
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
