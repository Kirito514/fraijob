"use client";

import Link from "next/link";
import {
  GraduationCap,
  BrainCircuit,
  BarChart2,
  Briefcase,
  Rocket,
  UserCheck,
  Users,
  BadgeCheck,
  UserCircle,
  Workflow,
  ClipboardCheck,
  Sparkles,
  ShieldCheck,
  Lightbulb,
  FileSearch,
  BookOpenCheck,
  Code2
} from "lucide-react";
import WaitlistForm from "../components/WaitlistForm";

const features = [
  {
    title: "Smart Resume Builder",
    icon: <GraduationCap size={36} className="text-[#10B981] mb-4" />,
    desc: "Create a professional resume with AI, tailored to your skills and real project experience."
  },
  {
    title: "AI Interview Simulator",
    icon: <BrainCircuit size={36} className="text-[#10B981] mb-4" />,
    desc: "Practice real interview questions with AI, get instant feedback and improve weak areas."
  },
  {
    title: "Skill-Based Roadmap",
    icon: <BarChart2 size={36} className="text-[#10B981] mb-4" />,
    desc: "Get a personalized learning and growth plan based on your current skills and career goals."
  },
  {
    title: "Real Project Hub",
    icon: <Briefcase size={36} className="text-[#10B981] mb-4" />,
    desc: "Join or launch real-world projects, build your portfolio, and gain hands-on experience."
  },
  {
    title: "Instant Apply System",
    icon: <Rocket size={36} className="text-[#10B981] mb-4" />,
    desc: "Apply for jobs with one click — AI recommends the best opportunities for your profile."
  },
  {
    title: "AI Candidate Matching",
    icon: <UserCheck size={36} className="text-[#10B981] mb-4" />,
    desc: "Employers get top candidate shortlists with AI-based ranking, portfolios, and activity analysis."
  },
  {
    title: "Community Forum",
    icon: <Users size={36} className="text-[#10B981] mb-4" />,
    desc: "Connect, share knowledge, ask questions, and learn from peers and industry mentors."
  },
  {
    title: "Internship Funnel",
    icon: <BadgeCheck size={36} className="text-[#10B981] mb-4" />,
    desc: "Eligible users get invited to internships as they progress on their roadmap — gain real work experience."
  },
  {
    title: "AI Career Coach",
    icon: <Sparkles size={36} className="text-[#10B981] mb-4" />,
    desc: "Personalized tips and mentorship recommendations to boost your career journey."
  },
  {
    title: "Verified Skills",
    icon: <ShieldCheck size={36} className="text-[#10B981] mb-4" />,
    desc: "All your achievements and skills are tracked and verified in real-time."
  },
  {
    title: "Job Market Insights",
    icon: <FileSearch size={36} className="text-[#10B981] mb-4" />,
    desc: "Discover trending skills and the most in-demand job categories in your field."
  },
  {
    title: "AI Learning Assistant",
    icon: <Lightbulb size={36} className="text-[#10B981] mb-4" />,
    desc: "Ask questions, get explanations, and never get stuck while learning."
  }
];

const howItWorks = [
  {
    title: "Create Your Smart Profile",
    desc: "Build your AI-powered resume. Get personalized skill assessments and a roadmap for your growth.",
    icon: <UserCircle size={44} className="text-[#10B981] mb-4 animate-float-slow" />
  },
  {
    title: "Practice & Prove Your Skills",
    desc: "Join real projects, collaborate with teams, and use the AI Interview Simulator to get job-ready faster.",
    icon: <Workflow size={44} className="text-[#10B981] mb-4 animate-pulse-slow" />
  },
  {
    title: "Apply & Get Hired Instantly",
    desc: "One-click apply for freelance or full-time roles. Stand out with verified skills, real experience, and AI-ranked profile.",
    icon: <ClipboardCheck size={44} className="text-[#10B981] mb-4 animate-float-slow" />
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 scroll-smooth">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-gray-200 flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 hover:text-[#10B981] transition cursor-pointer">
          FraiJob
        </h1>
        <nav className="space-x-6 hidden md:flex text-sm text-gray-700">
          {["How It Works", "Features", "Projects", "Community", "Jobs", "Pricing", "Testimonials"].map((label, i) => (
            <Link key={i} href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} className="transition hover:text-[#10B981]">
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/signup" className="bg-[#10B981] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0ea672]">
          Get started
        </Link>
      </header>

      <section className="relative bg-gradient-to-tr from-[#ecfdf5] via-white to-[#f0fdfa] py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-120px] left-[20%] w-[400px] h-[400px] bg-[#34D399] opacity-30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-[-100px] right-[15%] w-[500px] h-[500px] bg-[#10B981] opacity-20 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute top-[25%] left-[10%] text-[#6EE7B7] text-7xl animate-float-slow">✨</div>
          <div className="absolute top-[60%] right-[10%] text-[#A7F3D0] text-6xl animate-pulse-slow">🤖</div>
          <div className="absolute top-[15%] right-[15%] text-[#bbf7d0] text-6xl animate-float-slow">💼</div>
          <div className="absolute bottom-[10%] left-[15%] text-[#99f6e4] text-6xl animate-pulse-slow">🛠️</div>
        </div>

        <div className="relative z-10 backdrop-blur-md bg-white/60 rounded-3xl p-10 max-w-3xl mx-auto shadow-lg">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Your AI Partner — FraiJob: <br /> Become a Job-Ready Talent
          </h2>
          <p className="text-lg mb-8 text-gray-700">
            Practice, prove, and unlock your next opportunity with FraiJob
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#10B981] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#0ea672]"
            >
              Join FraiJob Waitlist
            </button>
            <Link
              href="/signup"
              className="border border-[#10B981] text-[#10B981] px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#e6f9f3]"
            >
              Start your journey
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#F9FAFB] text-gray-800 py-16 px-6" id="waitlist-form">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 text-center shadow-lg hover:shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold leading-snug mb-6">
            Be the first to try FraiJob’s smart career tools.
          </h3>
          <WaitlistForm />
          <p className="mt-6 text-sm md:text-base text-gray-600">
            Spots are filling up fast — be among the first to shape FraiJob and unlock exclusive early-access benefits.
          </p>
        </div>
      </section>

      <section className="bg-white text-gray-800 py-16 px-6" id="how-it-works">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-[#DCFCE7] text-[#10B981] px-4 py-1 rounded-full text-sm font-medium mb-4">
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            See how FraiJob helps you build real skills and get hired - in 3 simple steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map(({ title, desc, icon }, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl text-left">
                {icon}
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F9FAFB] text-gray-800 py-20 px-6" id="features">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-[#DCFCE7] text-[#10B981] px-4 py-1 rounded-full text-sm font-medium mb-4">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Unlock your potential with these smart features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map(({ title, desc, icon }, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow hover:shadow-xl focus-within:ring-2 focus-within:ring-[#10B981] text-left"
              >
                {icon}
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
