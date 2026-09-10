import { useState } from "react";
import {
  HelpCircle,
  Phone,
  Mail,
  ChevronDown,
  Send,
  MessageCircleQuestion,
} from "lucide-react";

const faqs = [
  {
    question: "How do I report a civic problem on PooKar?",
    answer:
      "Click 'Report a Problem' on the homepage, add your location and a description, attach optional photos, and submit. Your case gets a reference ID like #PK-2026-1043 for tracking.",
  },
  {
    question: "How is my problem routed to the right department?",
    answer:
      "An AI classifier reads your report and assigns it to the correct domain (Infrastructure, Healthcare, Environment, etc.) and district, then forwards it to the concerned department and matched teams.",
  },
  {
    question: "How do I track the status of my case?",
    answer:
      "Open 'Live Problems', find your case by its reference ID, or use the Track Status option. Each case shows a public timeline: Reported → Under Analysis → Matching Teams → Solution Planned → In Progress → Resolved.",
  },
  {
    question: "Who can form a team and solve problems?",
    answer:
      "Students, faculty, and departments from partner universities and institutions can form teams via 'Create / Form Team'. The platform matches them to problems based on domain and proximity.",
  },
  {
    question: "Is PooKar available in Hindi too?",
    answer:
      "Yes. The portal follows a bilingual (Hindi + English) policy like other Government of Jharkhand services. Translation support for reports is planned.",
  },
  {
    question: "Where do I file a grievance if my problem isn't resolved?",
    answer:
      "Call the Chief Minister's Helpline (1070) or file a grievance using the contact form below. Official RTI and grievance portals are linked in the footer.",
  },
];

const helplines = [
  { label: "Chief Minister's Helpline", value: "1070", note: "Toll-free" },
  { label: "National Emergency Helpline", value: "112", note: "All emergencies" },
  { label: "Women Helpline", value: "181", note: "Toll-free" },
  { label: "Grievance / Feedback", value: "1800-345-6009", note: "Toll-free" },
];

function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    // wire this up to your API call later
    console.log(form);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 2500);
  };

  return (
    <div className="px-6 py-6 sm:px-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-teal-600 text-white">
          <HelpCircle size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-navy-900">Help And Support</h1>
          <p className="text-sm text-slate-500">
            Frequently asked questions & assistance · सहायता
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* FAQ */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <MessageCircleQuestion size={18} className="text-teal-600" />
              Frequently Asked Questions
            </h2>

            <div className="mt-4 divide-y divide-slate-100">
              {faqs.map((faq, index) => {
                const open = openIndex === index;

                return (
                  <div key={faq.question} className="py-2">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="flex w-full items-center justify-between gap-4 py-3 text-left"
                    >
                      <span className="text-sm font-semibold text-navy-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-slate-400 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {open && (
                      <p className="pb-4 pr-8 text-sm leading-6 text-slate-600">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grievance form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <Send size={18} className="text-teal-600" />
              File a Grievance
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400 sm:col-span-1"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400 sm:col-span-1"
              />
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your grievance or query..."
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-teal-400 sm:col-span-2"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!form.name.trim() || !form.message.trim()}
              className="mt-4 flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={15} />
              {sent ? "Submitted! · भेज दिया गया" : "Submit Grievance"}
            </button>
          </div>
        </div>

        {/* Helplines */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <Phone size={18} className="text-teal-600" />
              Helplines
            </h2>

            <div className="mt-4 space-y-3">
              {helplines.map((line) => (
                <a
                  key={line.label}
                  href={`tel:${line.value}`}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <div>
                    <p className="text-sm font-medium text-navy-900">
                      {line.label}
                    </p>
                    <p className="text-xs text-slate-500">{line.note}</p>
                  </div>
                  <span className="text-lg font-bold text-teal-600">
                    {line.value}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-navy-900">
              <Mail size={18} className="text-navy-600" />
              Contact
            </h2>

            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <Mail size={15} className="shrink-0 text-teal-600" />
              support@poakar.jharkhand.gov.in
            </p>

            <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
              <HelpCircle size={15} className="mt-0.5 shrink-0 text-teal-600" />
              Helpdesk hours: Mon–Sat, 9 AM – 6 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;