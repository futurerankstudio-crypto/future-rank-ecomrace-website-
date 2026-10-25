import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ArrowRight } from 'lucide-react';

interface CollectionItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'Everyday Essentials' | 'Elegant Pret' | 'Contemporary Formal' | 'Seasonal Edit' | 'Accessories';
  image: string;
  count: number;
}

export const FeaturedCollections: React.FC = () => {
  const { setSelectedCategory, setActiveView, products } = useStore();

  const collections: CollectionItem[] = [
    {
      id: 'col-1',
      name: 'Elegant Pret',
      subtitle: 'Pure 80g raw silk & zari threadwork',
      category: 'Elegant Pret',
      image: '/images/product_embroidered_pret_1792821527541.jpg',
      count: products.filter((p) => p.category === 'Elegant Pret').length
    },
    {
      id: 'col-2',
      name: 'Contemporary Formal',
      subtitle: 'Architectural linen & tailored separates',
      category: 'Contemporary Formal',
      image: '/images/product_contemporary_suit_1792821527800.jpg',
      count: products.filter((p) => p.category === 'Contemporary Formal').length
    },
    {
      id: 'col-3',
      name: 'Seasonal Edit',
      subtitle: 'Dusk rose organza & festive peshwas',
      category: 'Seasonal Edit',
      image: '/images/product_formal_chiffon_1792821528510.jpg',
      count: products.filter((p) => p.category === 'Seasonal Edit').length
    },
    {
      id: 'col-4',
      name: 'Everyday Essentials',
      subtitle: 'Lightweight supima lawn & breathable tunics',
      category: 'Everyday Essentials',
      image: '/images/hero_fashion_editorial_1792821526246.jpg',
      count: products.filter((p) => p.category === 'Everyday Essentials').length
    },
    {
      id: 'col-5',
      name: 'Accessories',
      subtitle: '24k filigree & embroidered silk clutches',
      category: 'Accessories',
      image: '/images/product_artisan_accessories_1792821529328.jpg',
      count: products.filter((p) => p.category === 'Accessories').length
    }
  ];

  const handleSelectCollection = (cat: CollectionItem['category']) => {
    setSelectedCategory(cat);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5] border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8A7D6B] font-medium">Curated Wardrobes</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1C1C1F] font-medium mt-1">
              Featured Collections
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveView('shop');
            }}
            className="group flex items-center gap-2 text-sm font-medium text-[#1C1C1F] hover:text-[#B89758] transition-colors self-start md:self-auto"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.slice(0, 3).map((col) => (
            <div
              key={col.id}
              onClick={() => handleSelectCollection(col.category)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-[#F3EFEA] border border-[#E7E2DA] hover:border-[#C4B8A5] transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EAE4D9]">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute top-4 right-4 text-xs font-mono tabular-nums text-white/90 bg-black/40 px-2.5 py-1 rounded backdrop-blur-sm">
                  {col.count} {col.count === 1 ? 'Design' : 'Designs'}
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow bg-[#FAF8F5]">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#1C1C1F] group-hover:text-[#B89758] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#706D68] mt-1 line-clamp-1">{col.subtitle}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#EFEBE4] flex items-center justify-between text-xs font-medium text-[#1C1C1F]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Row (2-column split for remaining collections) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {collections.slice(3).map((col) => (
            <div
              key={col.id}
              onClick={() => handleSelectCollection(col.category)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-[#F3EFEA] border border-[#E7E2DA] hover:border-[#C4B8A5] transition-all flex flex-col sm:flex-row items-stretch"
            >
              <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#EAE4D9]">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:w-3/5 flex flex-col justify-between bg-[#FAF8F5]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8A7D6B] font-medium">
                    <span>{col.count} Pieces</span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#1C1C1F] group-hover:text-[#B89758] transition-colors mt-1">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#706D68] mt-1">{col.subtitle}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#EFEBE4] flex items-center justify-between text-xs font-medium text-[#1C1C1F]">
                  <span>View Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
