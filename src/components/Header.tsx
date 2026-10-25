import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ShoppingBag, Search, Heart, Sparkles, Menu, X, LayoutDashboard } from 'lucide-react';
import { CurrencyCode } from '../types/index.ts';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartCount,
    setIsCartOpen,
    setIsAssistantOpen,
    wishlist,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    setSelectedCategory
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'storefront' as const },
    { label: 'Shop', view: 'shop' as const },
    { label: 'New Arrivals', action: () => { setSelectedCategory('All'); setActiveView('shop'); } },
    { label: 'Collections', action: () => { setSelectedCategory('Elegant Pret'); setActiveView('shop'); } },
    { label: 'About', view: 'about' as const },
    { label: 'Contact', view: 'contact' as const }
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.action) {
      link.action();
    } else if (link.view) {
      setActiveView(link.view);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2DA] transition-all">
      {/* Search Bar Dropdown */}
      {showSearchInput && (
        <div className="bg-[#F4F0E8] border-b border-[#E7E2DA] px-6 py-3 transition-all animate-fadeIn">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Search className="w-4 h-4 text-[#7A7875] shrink-0" />
            <input
              type="text"
              placeholder="Search silk pret, linen suits, evening peshwas, accessories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'shop') setActiveView('shop');
              }}
              autoFocus
              className="w-full bg-transparent border-none text-sm text-[#1C1C1F] focus:outline-none placeholder-[#9B9790]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#7A7875] hover:text-[#1C1C1F]"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowSearchInput(false)}
              className="text-[#7A7875] hover:text-[#1C1C1F] p-1"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Bar Contract (3 Zones) */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => { setActiveView('storefront'); setIsMobileMenuOpen(false); }}
            className="group text-left"
          >
            <span className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-[#1C1C1F] group-hover:text-[#B89758] transition-colors whitespace-nowrap">
              NovaCart<span className="text-[#B89758] font-normal italic ml-1">AI</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, quiet hover underline) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A4845]">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`hover:text-[#1C1C1F] py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                item.view && activeView === item.view
                  ? 'border-[#1C1C1F] text-[#1C1C1F]'
                  : 'border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Functional Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Currency Switcher */}
          <select
            value={currency}
            aria-label="Select Currency"
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="text-xs font-semibold bg-transparent border border-[#DDD7CE] text-[#4A4845] rounded-md px-2 py-1.5 focus:outline-none cursor-pointer hover:border-[#1C1C1F]"
          >
            <option value="PKR">PKR (Rs.)</option>
            <option value="USD">USD ($)</option>
            <option value="AED">AED</option>
            <option value="GBP">GBP (£)</option>
          </select>

          {/* Search Toggle */}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="p-2 text-[#4A4845] hover:text-[#1C1C1F] transition-colors rounded-full hover:bg-[#F3EFEA]"
            title="Search Products"
            aria-label="Search Catalog"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* AI Fashion Assistant Trigger */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1C1F] bg-[#FAF8F5] border border-[#B89758] hover:bg-[#B89758]/10 transition-colors rounded-full whitespace-nowrap"
            title="AI Styling Concierge"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B89758]" />
            <span className="hidden sm:inline">Ask Stylist</span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => { setSelectedCategory('All'); setActiveView('shop'); }}
            className="relative p-2 text-[#4A4845] hover:text-[#1C1C1F] transition-colors rounded-full hover:bg-[#F3EFEA]"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#B89758] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-[#1C1C1F] text-[#FAF8F5] text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors whitespace-nowrap shrink-0"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#B89758] text-[#1C1C1F] px-1.5 py-0.2 rounded text-[11px] font-bold tabular-nums">
              {cartCount}
            </span>
          </button>

          {/* Admin Switcher */}
          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'storefront' : 'admin')}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeView === 'admin'
                ? 'bg-[#B89758] text-white border-[#B89758]'
                : 'bg-white text-[#4A4845] border-[#DDD7CE] hover:text-[#1C1C1F] hover:border-[#1C1C1F]'
            }`}
            title="Toggle Admin Workspace"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden xl:inline">{activeView === 'admin' ? 'Storefront' : 'Store Admin'}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#4A4845] hover:text-[#1C1C1F]"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#E7E2DA] px-6 py-6 transition-all animate-fadeIn">
          <nav className="flex flex-col gap-4 text-base font-medium text-[#1C1C1F]">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="text-left py-2 border-b border-[#EFEBE4] hover:text-[#B89758] transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { setActiveView('admin'); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 py-2 text-sm text-[#B89758] font-semibold"
              >
                <LayoutDashboard className="w-4 h-4" />
                Store Owner Dashboard
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
