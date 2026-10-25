import React, { useState, useEffect } from 'react';
import { SupportInquiry, InquiryPriority } from '../../types/index.ts';
import { Inbox, CheckCircle2, Clock, Send, Sparkles, Plus, AlertCircle, Loader2 } from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<SupportInquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [updating, setUpdating] = useState(false);

  // New simulated customer inquiry form
  const [showNewInquiryModal, setShowNewInquiryModal] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custMessage, setCustMessage] = useState('');
  const [simulatingTriage, setSimulatingTriage] = useState(false);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries);
        if (selectedInquiry) {
          const updated = data.inquiries.find((i: SupportInquiry) => i.id === selectedInquiry.id);
          if (updated) setSelectedInquiry(updated);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSelectInquiry = (inq: SupportInquiry) => {
    setSelectedInquiry(inq);
    setReplyText(inq.merchantReply || inq.aiSuggestedResponse || '');
  };

  const handleSendReply = async (inqId: string, markResolved = false) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/inquiries/${inqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantReply: replyText,
          status: markResolved ? 'resolved' : 'triaged'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedInquiry(data.inquiry);
        await fetchInquiries();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateCustomerInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim() || !custMessage.trim()) return;

    setSimulatingTriage(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: custName,
          customerEmail: custEmail,
          message: custMessage
        })
      });

      if (res.ok) {
        await fetchInquiries();
        setShowNewInquiryModal(false);
        setCustName('');
        setCustEmail('');
        setCustMessage('');
      }
    } catch {
      // ignore
    } finally {
      setSimulatingTriage(false);
    }
  };

  const priorityStyles: Record<InquiryPriority, string> = {
    low: 'bg-neutral-100 text-neutral-800',
    medium: 'bg-blue-50 text-blue-800',
    high: 'bg-amber-50 text-amber-800',
    urgent: 'bg-red-50 text-red-800 font-bold'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E7E2DA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#1C1C1F]">Customer Support Triage</h2>
          <p className="text-xs text-[#7A7875]">
            Inquiries categorized via Rule-Based (Workflow C) with policy-grounded suggested responses.
          </p>
        </div>

        <button
          onClick={() => setShowNewInquiryModal(true)}
          className="px-4 py-2 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32] transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Customer Ticket</span>
        </button>
      </div>

      {/* Main Grid: Tickets on Left, Detail & Reply on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E7E2DA] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#FAF8F5] border-b border-[#E7E2DA] flex items-center justify-between text-xs font-semibold text-[#1C1C1F]">
            <span>Active Tickets ({inquiries.length})</span>
            <span className="text-[11px] text-[#7A7875] font-normal">Select to inspect & reply</span>
          </div>

          <div className="divide-y divide-[#F2EEE9] max-h-[600px] overflow-y-auto">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#7A7875]">No inquiries found.</div>
            ) : (
              inquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelectInquiry(inq)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FAF8F5] border-l-4 border-l-[#1C1C1F]' : 'hover:bg-[#FFFDF9]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#1C1C1F]">{inq.customerName}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F4F1EA] text-[#6B5A40]">
                          {inq.topic}
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${priorityStyles[inq.priority]}`}>
                        {inq.priority} priority
                      </span>
                    </div>

                    <p className="text-xs text-[#555350] mt-2 line-clamp-2 leading-relaxed">
                      {inq.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#7A7875]">
                      <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      <span className={`font-medium capitalize ${inq.status === 'resolved' ? 'text-emerald-700' : 'text-blue-700'}`}>
                        {inq.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Ticket & AI Response Workspace */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E7E2DA] shadow-sm p-6 space-y-6">
          {selectedInquiry ? (
            <>
              {/* Ticket Meta */}
              <div className="border-b border-[#F2EEE9] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[#1C1C1F]">
                    Inquiry from {selectedInquiry.customerName}
                  </h3>
                  <p className="text-xs text-[#7A7875]">Email: {selectedInquiry.customerEmail}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded font-semibold capitalize ${
                  selectedInquiry.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  Status: {selectedInquiry.status}
                </span>
              </div>

              {/* Customer Inquiry Text */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#8A7D6B] font-semibold">Customer Message:</span>
                <p className="text-xs text-[#1C1C1F] leading-relaxed italic">
                  &ldquo;{selectedInquiry.message}&rdquo;
                </p>
              </div>

              {/* AI Suggested Response Box */}
              {selectedInquiry.aiSuggestedResponse && (
                <div className="p-4 bg-[#F5F8FF] rounded-xl border border-[#D0E2FF] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#1E40AF] font-semibold">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <span>AI Policy-Grounded Draft (Rule-Based Assistant):</span>
                  </div>
                  <p className="text-xs text-[#1E3A8A] leading-relaxed">
                    {selectedInquiry.aiSuggestedResponse}
                  </p>
                  <button
                    onClick={() => setReplyText(selectedInquiry.aiSuggestedResponse || '')}
                    className="text-[11px] text-[#2563EB] font-medium underline"
                  >
                    Use as merchant reply
                  </button>
                </div>
              )}

              {/* Merchant Reply Area */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#1C1C1F]">
                  Merchant Response:
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Review or customize response before dispatching..."
                  className="w-full text-xs p-3 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleSendReply(selectedInquiry.id, false)}
                  disabled={updating || !replyText.trim()}
                  className="px-4 py-2 border border-[#DDD7CE] rounded-lg text-xs font-medium text-[#1C1C1F] hover:bg-[#F3EFEA] disabled:opacity-50"
                >
                  Save Draft Reply
                </button>

                <button
                  onClick={() => handleSendReply(selectedInquiry.id, true)}
                  disabled={updating || !replyText.trim()}
                  className="px-4 py-2 bg-[#1C1C1F] text-white rounded-lg text-xs font-medium hover:bg-[#2D2D32] flex items-center gap-1.5 disabled:bg-neutral-300"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send & Mark Resolved</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-24 text-center space-y-3">
              <Inbox className="w-10 h-10 text-[#DDD7CE] mx-auto" />
              <p className="text-xs text-[#7A7875]">Select an inquiry from the left to view details and triage.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Customer Inquiry to test Workflow C */}
      {showNewInquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-2xl shadow-xl border border-[#E7E2DA] max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1C1C1F]">Simulate Inbound Inquiry</h3>
            <p className="text-xs text-[#7A7875]">
              Tests Workflow C: Gemini classifies category & priority, and suggests an immediate response.
            </p>

            <form onSubmit={handleCreateCustomerInquiry} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#4A4845] font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Sana Mir"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CE] bg-white"
                />
              </div>

              <div>
                <label className="block text-[#4A4845] font-medium mb-1">Customer Email *</label>
                <input
                  type="email"
                  required
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="sana@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CE] bg-white"
                />
              </div>

              <div>
                <label className="block text-[#4A4845] font-medium mb-1">Inquiry Question *</label>
                <textarea
                  rows={3}
                  required
                  value={custMessage}
                  onChange={(e) => setCustMessage(e.target.value)}
                  placeholder="e.g. Can I exchange my size if it doesn't fit? How long does delivery to Faisalabad take?"
                  className="w-full px-3 py-2 rounded-lg border border-[#DDD7CE] bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewInquiryModal(false)}
                  className="px-3 py-1.5 border border-[#DDD7CE] rounded-lg text-[#4A4845]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={simulatingTriage}
                  className="px-4 py-1.5 bg-[#1C1C1F] text-white font-medium rounded-lg hover:bg-[#2D2D32] flex items-center gap-2 disabled:bg-neutral-400"
                >
                  {simulatingTriage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Triaging with AI...</span>
                    </>
                  ) : (
                    <span>Submit & Run Triage</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
