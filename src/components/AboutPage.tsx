import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ArrowLeft, Sparkles, Compass, Shield, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 md:py-20 border-b border-[#E7E2DA]">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <button
          onClick={() => setActiveView('storefront')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A7875] hover:text-[#1C1C1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        {/* Hero Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8A7D6B] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#B89758]" />
            <span>The NovaCart AI Heritage</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#1C1C1F] leading-tight">
            Crafting Digital Elegance for the Modern Fashion Brand.
          </h1>

          <p className="text-base text-[#555350] leading-relaxed">
            NovaCart AI is a demonstrative high-fashion commerce platform designed and engineered by <strong>Future Rank Studio</strong>. It embodies our philosophy that a digital fashion house should be as thoughtful in its software architecture as it is in its pattern-making.
          </p>
        </div>

        {/* Featured Editorial Photo */}
        <div className="rounded-2xl overflow-hidden bg-[#F3EFEA] border border-[#E7E2DA] aspect-[16/9] shadow-sm">
          <img
            src="/src/assets/images/hero_fashion_editorial_1792821526246.jpg"
            alt="NovaCart AI Editorial Collection"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E7E2DA] space-y-3">
            <h3 className="font-serif text-xl font-medium text-[#1C1C1F] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#B89758]" />
              <span>Sartorial Standards</span>
            </h3>
            <p className="text-xs text-[#555350] leading-relaxed">
              We specialize in pure 80g raw silk pret, breathable Egyptian supima lawn, handcrafted tissue organza peshwas, and structured linen tailored suits. Each garment is designed with true-to-size modesty and timeless silhouettes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E7E2DA] space-y-3">
            <h3 className="font-serif text-xl font-medium text-[#1C1C1F] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#B89758]" />
              <span>Engineered by Future Rank Studio</span>
            </h3>
            <p className="text-xs text-[#555350] leading-relaxed">
              Future Rank Studio provides full-stack web development, AI chatbots, automation engineering, and UI/UX design. We empower fashion brands and boutiques with platforms that scale seamlessly across local and international markets.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="p-8 bg-[#F4F0E8] rounded-2xl border border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#1C1C1F]">
              Ready to explore our curated wardrobe?
            </h3>
            <p className="text-xs text-[#6B6864] mt-1">
              Browse our live collections or speak directly with our AI styling assistant.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveView('shop');
            }}
            className="px-6 py-3 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors whitespace-nowrap shrink-0"
          >
            Explore Catalogue
          </button>
        </div>
      </div>
    </div>
  );
};
