import { Phone, Mail, MapPin, HandHelping } from "lucide-react";
import Emblem from "./Emblem";

const quickLinks = [
  { label: "Report a Problem", path: "/gov" },
  { label: "Explore Problems", path: "/gov/live-problems" },
  { label: "Track Status", path: "/gov/live-problems" },
  { label: "How it Works", path: "/gov/help" },
  { label: "Help & Support", path: "/gov/help" },
];

const helpLines = [
  { label: "Chief Minister's Helpline", value: "1070" },
  { label: "National Helpline / Emergency", value: "112" },
  { label: "Grievance Toll-free", value: "1800-345-6009" },
  { label: "Women Helpline", value: "181" },
];

function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Emblem size={20} className="text-teal-400" />

              <div>
                <p className="text-lg font-bold text-white">
                  Poo<span className="text-teal-400">Kar</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  People. Ideas. Solutions. | लोग · विचार · समाधान
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              An initiative of the Government of Jharkhand to crowdsource civic
              problems and connect citizens, universities, and industry to
              solve them together.
            </p>

            <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-500">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              Government of Jharkhand, Ranchi, Jharkhand 834001
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Quick Links <span className="text-slate-500">| त्वरित लिंक</span>
            </h3>

            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.path} className="transition-colors hover:text-teal-400">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Helplines <span className="text-slate-500">| हेल्पलाइन</span>
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              {helpLines.map((line) => (
                <li key={line.label} className="flex items-center justify-between gap-2">
                  <span className="text-slate-400">{line.label}</span>
                  <span className="font-semibold text-teal-400">{line.value}</span>
                </li>
              ))}
            </ul>

            <a
              href="mailto:support@poakar.jharkhand.gov.in"
              className="mt-5 flex items-center gap-1.5 text-sm text-slate-400 hover:text-teal-400"
            >
              <Mail size={15} />
              support@poakar.jharkhand.gov.in
            </a>
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Grievance Redressal <span className="text-slate-500">| शिकायत निवारण</span>
            </h3>

            <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-400">
              <HandHelping size={17} className="mt-0.5 shrink-0 text-teal-400" />
              Every reported problem is routed to the concerned department and
              district administration for timely resolution.
            </p>

            <a
              href="tel:1070"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-400"
            >
              <Phone size={15} />
              Report & Track: 1070
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
            <p>
              © 2026 Government of Jharkhand. All rights reserved.
              <span className="hidden sm:inline"> · सर्वाधिकार सुरक्षित</span>
            </p>

            <div className="flex items-center gap-4">
              <span className="cursor-pointer transition-colors hover:text-slate-300">
                Privacy Policy
              </span>
              <span className="cursor-pointer transition-colors hover:text-slate-300">
                Terms of Use
              </span>
              <span className="cursor-pointer transition-colors hover:text-slate-300">
                Accessibility
              </span>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-600">
            Disclaimer: This is a prototype platform for demonstration purposes
            and is not an official Government of Jharkhand website. Content and
            data shown are representative only. | अस्वीकरण: यह एक प्रोटोटाइप प्लेटफॉर्म है
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;