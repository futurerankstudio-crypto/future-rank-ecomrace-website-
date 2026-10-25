import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ArrowLeft, Mail, MessageCircle, Send, CheckCircle2, MapPin, Clock, Phone, Loader2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { setActiveView } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please provide your name, email, and inquiry details.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          message
        })
      });

      if (!res.ok) throw new Error('Failed to transmit message.');

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 md:py-20 border-b border-[#E7E2DA]">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <button
          onClick={() => setActiveView('storefront')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7A7875] hover:text-[#1C1C1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <div className="max-w-2xl space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8A7D6B] font-medium">
            Customer Care & Atelier Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-[#1C1C1F]">
            We are Here to Assist You.
          </h1>
          <p className="text-sm text-[#555350]">
            Whether you have sizing inquiries, order tracking questions, or wish to consult on custom pieces, our team responds promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-medium text-[#1C1C1F]">
                Customer Assistance
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1C1C1F] block">Service Hours</span>
                    <span className="text-[#6B6864]">Monday to Saturday: 10:00 AM – 8:00 PM PKT</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1C1C1F] block">Order Verification Desk</span>
                    <span className="text-[#6B6864] font-mono">+92 321 7507345</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1C1C1F] block">Store Email</span>
                    <span className="text-[#6B6864] font-mono">futurerankstudio@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1C1C1F] block">Atelier Logistics Dispatch</span>
                    <span className="text-[#6B6864]">Islamabad & Lahore Hubs, Pakistan</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/923217507345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-lg text-xs font-semibold hover:bg-[#20BE5A] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+92 321 7507345)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Submission Form (Triggers Workflow C) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2DA] shadow-sm">
            <h3 className="font-serif text-2xl font-medium text-[#1C1C1F] mb-1">
              Send an Inquiry
            </h3>
            <p className="text-xs text-[#7A7875] mb-6">
              Messages are routed through our smart support triage system and reviewed by our care team.
            </p>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-[#F9FBF8] rounded-xl border border-[#C8E6C9] animate-fadeIn">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-medium text-[#1C1C1F]">
                  Message Dispatched
                </h4>
                <p className="text-xs text-[#555350] max-w-sm mx-auto">
                  Your inquiry has been stored and assigned an automated priority ticket. Our customer care desk will reply via email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maham Tariq"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#4A4845] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="maham@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#4A4845] mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 0000000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#4A4845] mb-1">Inquiry / Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry regarding size fitting, delivery timeline, or exchange policy."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F]"
                  />
                </div>

                {error && (
                  <p className="text-red-700 bg-red-50 p-2.5 rounded border border-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:bg-neutral-300"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending & Running Triage...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Customer Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
