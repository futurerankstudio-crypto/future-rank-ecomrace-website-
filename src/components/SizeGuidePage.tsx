import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ArrowLeft, Ruler } from 'lucide-react';

const rows=[['XS','32–33 in','25–26 in','35–36 in'],['S','34–35 in','27–28 in','37–38 in'],['M','36–38 in','29–31 in','39–41 in'],['L','39–41 in','32–34 in','42–44 in'],['XL','42–44 in','35–37 in','45–47 in']];
export const SizeGuidePage: React.FC = () => {
 const {setActiveView}=useStore();
 return <main className="min-h-screen bg-[#FAF8F5] py-12 md:py-20"><div className="max-w-5xl mx-auto px-6">
  <button onClick={()=>setActiveView('storefront')} className="inline-flex items-center gap-2 text-xs text-[#77736C] mb-10"><ArrowLeft className="w-4 h-4"/> Back to home</button>
  <p className="text-xs uppercase tracking-[.22em] text-[#9A8057]">Fit & measurements</p><h1 className="font-serif text-4xl md:text-6xl mt-3">Find your perfect fit.</h1>
  <p className="text-sm leading-7 text-[#706D68] mt-4 max-w-2xl">Use a soft measuring tape and keep it comfortably close to the body. These are general sample measurements in inches, not verified specifications for every design.</p>
  <div className="mt-9 overflow-x-auto rounded-2xl border border-[#E7E2DA] bg-white"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-[#F2EEE7] text-[#514B42]"><tr>{['Size','Bust','Waist','Hip'].map(x=><th key={x} className="p-4 font-semibold">{x}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row[0]} className="border-t border-[#EEEAE3]">{row.map((cell,i)=><td key={i} className="p-4 text-[#625E57]">{cell}</td>)}</tr>)}</tbody></table></div>
  <div className="grid md:grid-cols-3 gap-4 mt-8">{[['Bust','Measure around the fullest part of your bust.'],['Waist','Measure around your natural waistline.'],['Hip','Measure around the fullest part of your hips.']].map(([title,body])=><div key={title} className="p-6 rounded-xl bg-[#F1ECE3]"><Ruler className="w-5 h-5 text-[#A88750]"/><h2 className="font-serif text-xl mt-3">{title}</h2><p className="text-xs leading-6 text-[#706D68] mt-2">{body}</p></div>)}</div>
  <p className="text-xs text-[#8A7D6B] mt-8">Between sizes? For a relaxed fit, consider the larger size. Always check the individual product measurements and ask the store before ordering.</p>
  <button onClick={()=>setActiveView('contact')} className="mt-7 px-5 py-3 bg-[#1C1C1F] text-white rounded-lg text-xs">Ask for sizing help</button>
 </div></main>;
};