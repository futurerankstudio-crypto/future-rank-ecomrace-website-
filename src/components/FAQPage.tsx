import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const questions = [
  ['How do I place an order?', 'Browse the catalogue, open a product, choose your size and shade, then add it to your bag and complete the checkout form.'],
  ['Which payment methods are available?', 'Cash on Delivery is enabled in this demonstration for eligible Pakistan deliveries. Online card and wallet payments are not enabled until a verified payment provider is connected.'],
  ['How long does delivery take?', 'The demo store displays an estimated 24–48 hour dispatch window for major cities. Actual delivery times depend on the courier and destination.'],
  ['Can I exchange an item?', 'The sample store policy allows exchange requests for eligible unworn items with original tags. Please contact the store team before sending anything back.'],
  ['How do I choose the right size?', 'Use the Size Guide for general measurement instructions. For a specific garment, check its product description and contact the team if you need help.'],
  ['Are product images and stock live?', 'This is a demonstration storefront. Some products, stock counts, orders and policies are sample data and must be replaced with the merchant’s verified information before launch.'],
];
export const FAQPage: React.FC = () => {
 const { setActiveView } = useStore();
 return <main className="min-h-screen bg-[#FAF8F5] py-12 md:py-20"><div className="max-w-4xl mx-auto px-6">
  <button onClick={()=>setActiveView('storefront')} className="inline-flex items-center gap-2 text-xs text-[#77736C] mb-10"><ArrowLeft className="w-4 h-4"/> Back to home</button>
  <p className="text-xs uppercase tracking-[.22em] text-[#9A8057]">Help & support</p><h1 className="font-serif text-4xl md:text-6xl mt-3">Frequently asked questions.</h1>
  <p className="text-sm text-[#6B6864] mt-4 max-w-2xl">Helpful answers about shopping, sizing, delivery and this demonstration store.</p>
  <div className="mt-10 divide-y divide-[#E7E2DA] border-y border-[#E7E2DA]">{questions.map(([q,a])=><details key={q} className="group py-5"><summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-medium text-[#262522]"><span>{q}</span><ChevronDown className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"/></summary><p className="text-sm leading-7 text-[#706D68] mt-4 max-w-3xl">{a}</p></details>)}</div>
  <div className="mt-10 rounded-2xl bg-[#F0EADF] p-7 md:p-9"><h2 className="font-serif text-2xl">Still need a hand?</h2><p className="text-sm text-[#706D68] mt-2">Send your question to the customer care team.</p><button onClick={()=>setActiveView('contact')} className="mt-5 px-5 py-3 bg-[#1C1C1F] text-white rounded-lg text-xs">Contact the team</button></div>
 </div></main>;
};