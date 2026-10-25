import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#1C1C1F] text-[#FAF8F5] text-xs py-2 px-4 text-center font-medium tracking-wide border-b border-[#2D2D32]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline-block text-[#B89758] tracking-widest uppercase text-[11px]">
          Future Rank Studio · Architecture Demo
        </span>
        <p className="mx-auto">
          Discover the Autumn/Winter Pret Collection <span className="opacity-40 mx-2">·</span> Nationwide Express Dispatch via TCS <span className="opacity-40 mx-2">·</span> Cash on Delivery
        </p>
        <span className="hidden md:inline-block text-neutral-400 text-[11px]">
          Demo Storefront
        </span>
      </div>
    </div>
  );
};
