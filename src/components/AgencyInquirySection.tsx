import React, { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

export const AgencyInquirySection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('Fashion Boutique');
  const [service, setService] = useState('Full-Stack Web Development');
  const [budgetRange, setBudgetRange] = useState('$1,500 – $3,500 / PKR 400k – 950k');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !description.trim()) {
      setError('Please provide your name, business email, and project overview.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/agency/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          businessType,
          service,
          budgetRange,
          description
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit inquiry.');

      setSuccess(true);
      setName('');
      setEmail('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Unable to submit your inquiry at this moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="build-store-inquiry" className="py-20 bg-white border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Agency Introduction & Direct Connect */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8A7D6B] font-medium">
              <span>Future Rank Studio</span>
              <span>·</span>
              <span>Architecture & Engineering</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1C1F] leading-tight">
              Build Your Custom AI E-Commerce Store
            </h2>

            <p className="text-sm text-[#555350] leading-relaxed">
              Future Rank Studio designs and builds bespoke e-commerce platforms, AI shopping concierges, workflow automations, and modern web applications for ambitious fashion labels and digital retailers.
            </p>

            {/* Core Capability Tags (clean, unboxed text per anti-slop rules) */}
            <div className="py-3 border-y border-[#F0EBE1] text-xs text-[#6B6864] space-y-2">
              <p className="font-semibold text-[#1C1C1F]">Core Services Provided:</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <span>Full-Stack Web Development</span>
                <span className="text-[#DDD7CE]">/</span>
                <span>AI Apps & Chatbots</span>
                <span className="text-[#DDD7CE]">/</span>
                <span>AI Automation</span>
                <span className="text-[#DDD7CE]">/</span>
                <span>UI/UX Design</span>
                <span className="text-[#DDD7CE]">/</span>
                <span>Landing Pages</span>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="space-y-3 pt-2">
              <a
                href="https://wa.me/923217507345"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#1C1C1F] transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold block">Chat directly on WhatsApp</span>
                  <span className="text-xs text-[#4A4845] font-mono">+92 321 7507345</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#25D366] group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="mailto:futurerankstudio@gmail.com"
                className="flex items-center gap-3 p-3.5 rounded-xl border border-[#DDD7CE] bg-[#FAF8F5] hover:border-[#1C1C1F] text-[#1C1C1F] transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-[#1C1C1F] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold block">Email Future Rank Studio</span>
                  <span className="text-xs text-[#4A4845] font-mono">futurerankstudio@gmail.com</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7A7875] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Consultation Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] shadow-sm">
            <h3 className="font-serif text-2xl font-medium text-[#1C1C1F] mb-1">
              Start Your Project Consultation
            </h3>
            <p className="text-xs text-[#7A7875] mb-6">
              Share your business requirements and we will reply within 24 hours with architecture scoping.
            </p>

            {success ? (
              <div className="p-8 text-center space-y-3 bg-white rounded-xl border border-[#C8E6C9] animate-fadeIn">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-medium text-[#1C1C1F]">
                  Inquiry Received
                </h4>
                <p className="text-xs text-[#555350] max-w-sm mx-auto">
                  Thank you! Your project details have been recorded into our database. The Future Rank Studio engineering team will review and get in touch with you promptly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-4 py-2 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32]"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4845] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Bilal Ahmed"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4845] mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. founder@brand.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4845] mb-1">
                      Business Type
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                    >
                      <option value="Fashion Boutique">Fashion Boutique</option>
                      <option value="Clothing Brand / Designer">Clothing Brand / Designer</option>
                      <option value="Multi-Brand Retailer">Multi-Brand Retailer</option>
                      <option value="E-Commerce Startup">E-Commerce Startup</option>
                      <option value="Enterprise Apparel">Enterprise Apparel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4845] mb-1">
                      Required Service
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                    >
                      <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                      <option value="AI Apps & Chatbots">AI Apps & Chatbots</option>
                      <option value="AI Automation (n8n / Workflows)">AI Automation (n8n / Workflows)</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Landing Pages & Conversions">Landing Pages & Conversions</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A4845] mb-1">
                    Estimated Budget Range
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                  >
                    <option value="$1,000 – $2,500 / PKR 280k – 700k">$1,000 – $2,500 / PKR 280k – 700k</option>
                    <option value="$2,500 – $5,000 / PKR 700k – 1.4M">$2,500 – $5,000 / PKR 700k – 1.4M</option>
                    <option value="$5,000+ / PKR 1.4M+">$5,000+ / PKR 1.4M+ (Comprehensive Architecture)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A4845] mb-1">
                    Project Vision & Goals *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your brand, product categories, timeline, and whether you require custom AI styling concierges or ERP integrations."
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-white focus:outline-none focus:border-[#1C1C1F]"
                  />
                </div>

                {error && (
                  <p className="text-xs text-[#B71C1C] bg-[#FFEBEE] p-2.5 rounded border border-[#FFCDD2]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:bg-neutral-400"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry to Future Rank Studio</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
