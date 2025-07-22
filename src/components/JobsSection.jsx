"use client";

import { useState } from "react";
import {
  Briefcase,
  BarChart2,
  ShieldCheck,
  Clock,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const jobsData = [
  {
    title: "Remote & On-Site Offers",
    icon: Briefcase,
    description:
      "Work from anywhere or join teams in the office. Pick flexible remote or in-person jobs that match your lifestyle.",
  },
  {
    title: "Skill-Based Matching",
    icon: BarChart2,
    description:
      "No more random offers — see only jobs that fit your skills and experience.",
  },
  {
    title: "Verified Employers",
    icon: ShieldCheck,
    description:
      "All companies are checked for legitimacy. Work with reliable employers who value your time and talent.",
  },
  {
    title: "Flexible Time Options",
    icon: Clock,
    description:
      "Find full-time, part-time, or freelance work. Choose what works best for your schedule.",
  },
  {
    title: "Track Your Application Status",
    icon: ClipboardCheck,
    description:
      "Stay updated on every application. Get real-time notifications — never be left waiting.",
  },
];

export default function JobsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="jobs"
      className="w-full py-24 px-6 bg-white text-gray-800 relative"
    >
      <div className="max-w-5xl mx-auto text-center mb-16">
        <div className="inline-block bg-[#DCFCE7] text-[#10B981] px-4 py-1 rounded-full text-sm font-medium mb-4">
          Jobs
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Land your next job with confidence.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore freelance gigs, internships, and full-time roles from verified companies — all tailored to your skills and goals.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {jobsData.map((job, index) => {
          const Icon = job.icon;
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
                isOpen
                  ? "bg-white border-[#10B981]"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <Icon
                    className={`w-6 h-6 flex-shrink-0 transition ${
                      isOpen ? "text-[#10B981]" : "text-gray-500"
                    }`}
                  />
                  <span className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#10B981]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm text-gray-700 leading-relaxed">
                  {job.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
