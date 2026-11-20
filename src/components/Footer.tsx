import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  return (
    <footer className="bg-[#18181A] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A2A2D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[#2C2C30]">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => setActiveView('storefront')}
              className="text-left font-serif text-2xl font-medium tracking-tight text-[#FAF8F5] hover:text-[#B89758] transition-colors"
            >
              NovaCart<span className="text-[#B89758] italic font-normal ml-1">AI</span>
            </button>
            <p className="text-xs text-[#9B9994] leading-relaxed max-w-sm">
              A luxury-inspired smart fashion e-commerce architecture. Demonstrates intelligent shopping assistance, resilient Cash on Delivery checkout, and end-to-end business automation.
            </p>
            <div className="pt-2 text-xs text-[#B89758]">
              Architected & Built by Future Rank Studio
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#FAF8F5] font-semibold">Storefront</h4>
            <ul className="space-y-2 text-xs text-[#9B9994]">
              <li>
                <button
                  onClick={() => { setSelectedCategory('All'); setActiveView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('Elegant Pret'); setActiveView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Elegant Pret
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('Contemporary Formal'); setActiveView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Contemporary Formal
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedCategory('Accessories'); setActiveView('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Artisan Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-[#B89758] hover:underline transition-all"
                >
                  Merchant Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#FAF8F5] font-semibold">Store Policies</h4>
            <ul className="space-y-2 text-xs text-[#9B9994]">
              <li>Cash on Delivery across Pakistan</li>
              <li>Express TCS Dispatch (24–48 Hours)</li>
              <li>7-Day Hassle-Free Exchange Policy</li>
              <li>Custom Atelier Sizing Consultation</li>
              <li>100% Verified Fabric Specifications</li>
              <li><button onClick={() => setActiveView('size_guide')} className='hover:text-white'>Size Guide</button></li>
              <li><button onClick={() => setActiveView('faq')} className='hover:text-white'>Frequently Asked Questions</button></li>
            </ul>
          </div>

          {/* Future Rank Studio Contact Card */}
          <div className="lg:col-span-3 space-y-3 bg-[#202023] p-5 rounded-xl border border-[#2D2D32]">
            <h4 className="text-xs uppercase tracking-wider text-[#B89758] font-semibold">Future Rank Studio</h4>
            <p className="text-[11px] text-[#8F8D88] leading-relaxed">
              Full-Stack Web Development | AI Apps & Chatbots | AI Automation | UI/UX Design | Landing Pages
            </p>
            <div className="pt-2 space-y-2 text-xs">
              <a
                href="mailto:futurerankstudio@gmail.com"
                className="flex items-center gap-2 text-[#DDD7CE] hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#B89758]" />
                <span className="truncate">futurerankstudio@gmail.com</span>
              </a>
              <a
                href="https://wa.me/923217507345"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#DDD7CE] hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>+92 321 7507345</span>
                <ArrowUpRight className="w-3 h-3 ml-auto opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#706E69]">
          <p>© {new Date().getFullYear()} NovaCart AI. Demonstrative Fashion Commerce Platform.</p>
          <p>
            Powered by <strong className="text-[#DDD7CE]">Future Rank Studio</strong> · Engineered for Scalable Brands
          </p>
        </div>
      </div>
    </footer>
  );
};
