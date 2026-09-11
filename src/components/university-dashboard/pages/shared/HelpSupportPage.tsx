import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2, Phone, Mail, FileQuestion, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSent, setTicketSent] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const faqs = [
    {
      q: "How does a student team get formally recognized for a civic problem?",
      a: "First accept the live problem under 'Live Problems'. Then navigate to 'Form a Team' and submit a team application specifying your student roster, skillsets, and chosen faculty mentor. Once endorsed by faculty and cleared by admin, the problem is assigned to your team.",
    },
    {
      q: "What is the timeline for DPR and BoM clearance?",
      a: "After team application approval, students submit their Technical Solution Plan & BoM. The assigned Faculty Guide reviews technical feasibility within 3-5 days. Upon faculty endorsement, the University R&D Admin approves grant funds within 48 hours.",
    },
    {
      q: "Are hardware prototype grants disbursed directly to student bank accounts?",
      a: "Prototype grants are credited to the institutional lab procurement fund under the joint supervision of the Faculty Guide and Student Team Lead in compliance with Jharkhand State Innovation rules.",
    },
    {
      q: "How does the AI Analysis tool assist faculty and admin evaluations?",
      a: "The AI Analysis workspace runs deterministic Bill of Materials (BoM) compliance audits (flagging unauthorized parts), checks novelty against state patent databases, and calculates civic impact metrics.",
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setTicketSent(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setTicketSent(false), 4500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
            <HelpCircle size={18} />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#10245e]">
            Academic Support & Nodal Help Desk
          </h1>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Get direct assistance on team formation, DPR drafting, AI feasibility checks, and state innovation grants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2 mb-2">
            <FileQuestion size={16} className="text-indigo-600" />
            <span>Frequently Answered Inquiries</span>
          </h2>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-700"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="shrink-0" /> : <ChevronDown size={16} className="shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <Phone size={14} className="text-indigo-600" />
                <span>R&D Nodal Coordinator</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">Dr. Priya Murmu</p>
              <p className="text-[11px] text-slate-500">Dean (Research & Strategic Partnerships)</p>
              <p className="text-[11px] text-indigo-700 font-mono pt-1">rnd.director@bitmesra.ac.in</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <Mail size={14} className="text-emerald-600" />
                <span>State Innovation Cell Helpline</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">Dept of Higher & Tech Education</p>
              <p className="text-[11px] text-slate-500">Govt of Jharkhand, Nepal House, Ranchi</p>
              <p className="text-[11px] text-emerald-700 font-mono pt-1">innovation.cell@jharkhand.gov.in</p>
            </div>
          </div>
        </div>

        {/* Ticket Submission Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#10245e] flex items-center gap-2">
            <Send size={15} className="text-indigo-600" />
            <span>Submit Academic Inquiry</span>
          </h2>

          {ticketSent && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>Ticket dispatched to R&D Nodal Desk. Token: #TKT-2026-881</span>
            </div>
          )}

          <form onSubmit={handleTicketSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Subject / Category</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="e.g. BoM sensor vendor query"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Detailed Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Provide problem ticket ID and describe issue..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Dispatch Inquiry to Nodal Desk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
