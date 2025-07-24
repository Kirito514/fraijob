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
  Github,
  Twitter,
  MessageCircle,
  Slack,
  Moon,
  Sun,
  Monitor,
  Clock,
  ChevronUp,
  ChevronDown,
  Mail,
} from "lucide-react";
import WaitlistForm from "../components/WaitlistForm";
import { useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

// Matnlarni i18n uchun massivlarda saqlash
const TEXT = {
  header: {
    uz: [
      "Qanday ishlaydi", "Xususiyatlar", "Loyihalar", "Jamiyat", "Ishlar", "Narxlar", "Fikrlar"
    ],
    en: [
      "How It Works", "Features", "Projects", "Community", "Jobs", "Pricing", "Testimonials"
    ]
  },
  hero: {
    title: {
      uz: "AI yordamchi — FraiJob: Ishga tayyor bo‘ling",
      en: "Your AI Partner — FraiJob: Become a Job-Ready Talent"
    },
    desc: {
      uz: "Amaliyot, isbot va yangi imkoniyatlarni FraiJob bilan oching",
      en: "Practice, prove, and unlock your next opportunity with FraiJob"
    },
    waitlist: {
      uz: "FraiJob kutuviga qo‘shiling",
      en: "Join FraiJob Waitlist"
    },
    start: {
      uz: "Boshlash",
      en: "Start your journey"
    }
  },
  waitlist: {
    title: {
      uz: "FraiJob aqlli ish vositalarini birinchi bo‘lib sinab ko‘ring.",
      en: "Be the first to try FraiJob’s smart career tools."
    },
    desc: {
      uz: "Joylar tez to‘lib bormoqda — FraiJob’ni shakllantirishda birinchi bo‘ling va eksklyuziv imkoniyatlarga ega bo‘ling.",
      en: "Spots are filling up fast — be among the first to shape FraiJob and unlock exclusive early-access benefits."
    }
  },
  howItWorks: [
  {
      title: { uz: "Profil yarating", en: "Create Your Smart Profile" },
      desc: {
        uz: "AI yordamida rezyume tuzing. Shaxsiy baholash va o‘sish yo‘nalishini oling.",
        en: "Build your AI-powered resume. Get personalized skill assessments and a roadmap for your growth."
      }
    },
    {
      title: { uz: "Amaliyot va isbot", en: "Practice & Prove Your Skills" },
      desc: {
        uz: "Haqiqiy loyihalarda qatnashing, jamoa bilan ishlang va AI intervyu simulyatoridan foydalaning.",
        en: "Join real projects, collaborate with teams, and use the AI Interview Simulator to get job-ready faster."
      }
    },
    {
      title: { uz: "Bir klikda ishga joylashish", en: "Apply & Get Hired Instantly" },
      desc: {
        uz: "Bir klikda ishga murojaat qiling. Tasdiqlangan ko‘nikmalar va tajriba bilan ajralib turing.",
        en: "One-click apply for freelance or full-time roles. Stand out with verified skills, real experience, and AI-ranked profile."
      }
    }
  ],
  howItWorksLabel: { uz: "Qanday ishlaydi", en: "How It Works" },
  howItWorksTitle: {
    uz: "FraiJob yordamida 3 qadamda haqiqiy ko‘nikmalar va ish oling",
    en: "See how FraiJob helps you build real skills and get hired - in 3 simple steps"
  },
  featuresLabel: { uz: "Xususiyatlar", en: "Features" },
  featuresTitle: {
    uz: "Mana shu aqlli xususiyatlar bilan imkoniyatingizni oching",
    en: "Unlock your potential with these smart features"
  },
  features: [
  {
      title: { uz: "AI rezyume yaratuvchi", en: "Smart Resume Builder" },
      desc: {
        uz: "AI yordamida professional rezyume tuzing, ko‘nikmalaringiz va tajribangizga mos.",
        en: "Create a professional resume with AI, tailored to your skills and real project experience."
      },
      icon: <GraduationCap size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "AI intervyu simulyatori", en: "AI Interview Simulator" },
      desc: {
        uz: "AI yordamida haqiqiy intervyu savollarini mashq qiling va zaif joylaringizni yaxshilang.",
        en: "Practice real interview questions with AI, get instant feedback and improve weak areas."
  },
      icon: <BrainCircuit size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "Skill-Based Roadmap", en: "Skill-Based Roadmap" },
      desc: {
        uz: "Shaxsiy baholash va kasb maqsadingizga mos o‘sish va o‘zlashtirish yo‘nalishini oling.",
        en: "Get a personalized learning and growth plan based on your current skills and career goals."
  },
      icon: <BarChart2 size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "Real Project Hub", en: "Real Project Hub" },
      desc: {
        uz: "Haqiqiy loyihalarda qatnashing, portfolio yarating va tajribangizni oling.",
        en: "Join or launch real-world projects, build your portfolio, and gain hands-on experience."
  },
      icon: <Briefcase size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "Instant Apply System", en: "Instant Apply System" },
      desc: {
        uz: "AI yordamida bir klikda ishga murojaat qiling. Sizning profilingizga mos keladigan eng yaxshi imkoniyatlarni AI taklif qiladi.",
        en: "Apply for jobs with one click — AI recommends the best opportunities for your profile."
  },
      icon: <Rocket size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "AI Candidate Matching", en: "AI Candidate Matching" },
      desc: {
        uz: "Ish beruvchilar AI asosida eng yaxshi kandidatlar ro‘yxatini olishadi, portfoliyalar va faoliyat tahlili bilan.",
        en: "Employers get top candidate shortlists with AI-based ranking, portfolios, and activity analysis."
  },
      icon: <UserCheck size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "Community Forum", en: "Community Forum" },
      desc: {
        uz: "Bilish, bilish va o‘z bilimingizni rivojlantiring. Jamoada va sirtqi ilmiy mentorlar bilan bog‘laning.",
        en: "Connect, share knowledge, ask questions, and learn from peers and industry mentors."
  },
      icon: <Users size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "Internship Funnel", en: "Internship Funnel" },
      desc: {
        uz: "Yolg‘on foydalanuvchilar uchun kutuvlar asosida ishlar olib borish imkoniyati. Yolg‘on foydalanuvchilar uchun ish tajribasi olish.",
        en: "Eligible users get invited to internships as they progress on their roadmap — gain real work experience."
  },
      icon: <BadgeCheck size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "AI Career Coach", en: "AI Career Coach" },
      desc: {
        uz: "Shaxsiy takliflar va mentorlik takliflarini oling. Sizning kasb yo‘nalishingizni yaxshilang.",
        en: "Personalized tips and mentorship recommendations to boost your career journey."
  },
      icon: <Sparkles size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "Verified Skills", en: "Verified Skills" },
      desc: {
        uz: "Barcha sizning afzalliklar va ko‘nikmalaringiz haqida ma'lumotlar va tasdiqlanadi. Haqiqiy vaqtda.",
        en: "All your achievements and skills are tracked and verified in real-time."
  },
      icon: <ShieldCheck size={36} className='text-[#10B981] mb-4' />
    },
    {
      title: { uz: "Job Market Insights", en: "Job Market Insights" },
      desc: {
        uz: "Sizning sohasidagi trend ko‘nikmalar va eng talab qilinadigan ish kategoriyalarini aniqlang.",
        en: "Discover trending skills and the most in-demand job categories in your field."
      },
      icon: <FileSearch size={36} className='text-[#10B981] mb-4' />
  },
  {
      title: { uz: "AI Learning Assistant", en: "AI Learning Assistant" },
      desc: {
        uz: "Savollar berish, tushuntirishlar olish va o‘rganishda qolib qolmasangiz, AI yordamchisi sizni yordam beradi.",
        en: "Ask questions, get explanations, and never get stuck while learning."
      },
      icon: <Lightbulb size={36} className='text-[#10B981] mb-4' />
    },
  ],
  projects: {
    title: {
      uz: "Haqiqiy loyihalar. Haqiqiy tajriba.",
      en: "Real projects. Real experience."
    },
    topCards: [
      {
        title: { uz: "Loyiha boshlash", en: "Start a Project" },
        desc: {
          uz: "O‘zingizning loyihingizni boshlang, to‘g‘ri maqsadlar o‘rnatish va jamoangizni taklif qiling.",
          en: "Launch your own project, set clear goals, and invite your team."
        },
        icon: "/images/start-project.svg"
      },
      {
        title: { uz: "Vazifalar va vazifalarini boshqarish", en: "Manage & Track Tasks" },
        desc: {
          uz: "Katta maqsadlarni vazifalarga ajrating, muddatlar o‘rnatish va vazifalaringizni osonlik bilan boshqarish.",
          en: "Break big goals into tasks, set deadlines, and track your progress easily."
        },
        icon: "/images/task-tracking.svg"
      }
    ],
    bottomCards: [
      {
        title: { uz: "Jam olish", en: "Team Collaboration" },
        desc: {
          uz: "Boshqalar bilan qo‘shiling, vazifalarni bajarish va haqiqiy vaqtda jamoaningiz bilan ishlash.",
          en: "Invite others to join, assign roles, and build together in real-time."
        },
        icon: "/images/team-collab.svg"
      },
      {
        title: { uz: "AI yordamchisi", en: "AI Assistance" },
        desc: {
          uz: "AI yordamida fikrlar yaratish, yaxshiroq tavsiflar yozish va ishingizni yuqori darajaga ko‘tarish.",
          en: "Use AI to generate ideas, write better descriptions, and level up your work."
        },
        icon: "/images/ai-help.svg"
      },
      {
        title: { uz: "Ko‘rsatish va rezyume birlashishi", en: "Showcase & Resume Integration" },
        desc: {
          uz: "Agar loyihingiz bajarilsa, u avtomatik ravishda rezyumeingizga va umumiy portfoliyingizga qo‘shiladi.",
          en: "When your project is done, it’s automatically added to your resume and public portfolio."
        },
        icon: "/images/showcase.svg"
      }
    ]
  },
  community: {
    label: { uz: "Jamiyat", en: "Community" },
    title: {
      uz: "Texnologiyalar bilan bog‘lanish joyi.",
      en: "The place where tech minds connect."
    },
    desc: {
      uz: "Bilish, ulash va o‘zimizni rivojlantiring. Sizning jamoangiz bilan ishlash, jamoangiz bilan ishlash va yordam olish.",
      en: "Connect, share, and grow with your community. Join discussions, find teammates, and get help."
    },
    button: {
      uz: "Jamoa bilan bog‘lanish",
      en: "Join the community"
    }
  },
  jobs: {
    title: {
      uz: "Ishlar",
      en: "Jobs"
    }
  }
};

const howItWorks = [
  {
    title: <GraduationCap size={44} className='text-[#10B981] mb-4 animate-float-slow' />,
    desc: "Build your AI-powered resume. Get personalized skill assessments and a roadmap for your growth.",
  },
  {
    title: <Workflow size={44} className='text-[#10B981] mb-4 animate-pulse-slow' />,
    desc: "Join real projects, collaborate with teams, and use the AI Interview Simulator to get job-ready faster.",
  },
  {
    title: <ClipboardCheck size={44} className='text-[#10B981] mb-4 animate-float-slow' />,
    desc: "One-click apply for freelance or full-time roles. Stand out with verified skills, real experience, and AI-ranked profile.",
  },
];

// JobsSection kodini landing page ichiga joylayman va i18n matnlari bilan moslashtiraman
const jobsData = [
  {
    title: {
      uz: "Masofaviy va ofis ishlar",
      en: "Remote & On-Site Offers"
    },
    description: {
      uz: "Istalgan joydan ishlang yoki ofis jamoasiga qo‘shiling. Hayotingizga mos masofaviy yoki ofis ishlarini tanlang.",
      en: "Work from anywhere or join teams in the office. Pick flexible remote or in-person jobs that match your lifestyle."
    },
    icon: Briefcase
  },
  {
    title: {
      uz: "Ko‘nikmaga asoslangan moslik",
      en: "Skill-Based Matching"
    },
    description: {
      uz: "Endi tasodifiy takliflar yo‘q — faqat sizning ko‘nikma va tajribangizga mos ishlarni ko‘rasiz.",
      en: "No more random offers — see only jobs that fit your skills and experience."
    },
    icon: BarChart2
  },
  {
    title: {
      uz: "Tasdiqlangan ish beruvchilar",
      en: "Verified Employers"
    },
    description: {
      uz: "Barcha kompaniyalar ishonchliligi tekshirilgan. Vaqtingiz va iste’dodingizni qadrlaydigan ish beruvchilar bilan ishlang.",
      en: "All companies are checked for legitimacy. Work with reliable employers who value your time and talent."
    },
    icon: ShieldCheck
  },
  {
    title: {
      uz: "Moslashuvchan vaqt imkoniyatlari",
      en: "Flexible Time Options"
    },
    description: {
      uz: "To‘liq, yarim stavka yoki freelancerlik ishlarni toping. Jadvalingizga mosini tanlang.",
      en: "Find full-time, part-time, or freelance work. Choose what works best for your schedule."
    },
    icon: Clock
  },
  {
    title: {
      uz: "Ariza holatini kuzatish",
      en: "Track Your Application Status"
    },
    description: {
      uz: "Har bir arizangiz bo‘yicha yangiliklardan xabardor bo‘ling. Real vaqt bildirishnomalari — kutib qolmaysiz.",
      en: "Stay updated on every application. Get real-time notifications — never be left waiting."
    },
    icon: ClipboardCheck
  }
];

// Footer uchun i18n matnlar
const FOOTER_LINKS = [
  { uz: "Xususiyatlar", en: "Features", id: "features" },
  { uz: "Loyihalar", en: "Projects", id: "projects" },
  { uz: "Jamiyat", en: "Community", id: "community" },
  { uz: "Ishlar", en: "Jobs", id: "jobs" },
  { uz: "Narxlar", en: "Pricing", id: "pricing" },
];

export default function LandingPage() {
  const [notification, setNotification] = useState(null);
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState("system");
  const [openIndex, setOpenIndex] = useState(null);

  // Mode switcher
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else if (newMode === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("light");
    }
  };

  // Language switcher
  const handleLangChange = (newLang) => {
    setLang(newLang);
    // Bu yerda i18n yoki boshqa tilni almashtirish logikasini qo'shish mumkin
  };

  return (
    <main className='min-h-screen bg-white text-gray-800 scroll-smooth'>
      {/* Header */}
      <header className='sticky top-0 z-50 w-full bg-white/60 backdrop-blur-lg px-6 py-6 dark:bg-white/30'>
        <div className='max-w-7xl mx-auto flex justify-between items-center gap-20'>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">FraiJob</h1>
        <nav className='space-x-6 hidden md:flex text-sm text-gray-700'>
            {TEXT.header[lang].map((label, i) => (
            <Link
              key={i}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className='transition hover:text-[#10B981]'>
              {label}
            </Link>
          ))}
        </nav>
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex border border-gray-200 rounded-full overflow-hidden text-xs font-semibold">
              <button
                className={`px-3 py-1 transition ${lang === "uz" ? "bg-[#10B981] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                onClick={() => handleLangChange("uz")}
              >UZ</button>
              <button
                className={`px-3 py-1 transition ${lang === "en" ? "bg-[#10B981] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                onClick={() => handleLangChange("en")}
              >EN</button>
            </div>
            {/* Mode Switcher */}
            <div className="flex border border-gray-200 rounded-full overflow-hidden ml-2">
              <button
                className={`px-2 py-1 transition ${mode === "light" ? "bg-[#10B981] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                onClick={() => handleModeChange("light")}
                title="Light mode"
              ><Sun size={16} /></button>
              <button
                className={`px-2 py-1 transition ${mode === "dark" ? "bg-[#10B981] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                onClick={() => handleModeChange("dark")}
                title="Dark mode"
              ><Moon size={16} /></button>
              <button
                className={`px-2 py-1 transition ${mode === "system" ? "bg-[#10B981] text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                onClick={() => handleModeChange("system")}
                title="System mode"
              ><Monitor size={16} /></button>
            </div>
        <Link
          href='/signup'
              className='bg-[#10B981] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#0ea672] shadow-md ml-2'>
          Get started
        </Link>
          </div>
        </div>
      </header>
      {/* Toast */}
      {notification && (
        <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-fit max-w-sm px-6 py-4 flex items-start gap-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md bg-white/70'>
          <div
            className={`p-2 rounded-full ${
              notification.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}>
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
          </div>
          <p className='text-sm text-gray-800 font-medium max-w-xs'>
            {notification.message}
          </p>
          <button
            onClick={() => setNotification(null)}
            className='text-gray-400 hover:text-gray-600 transition'>
            <X size={18} />
          </button>
        </div>
      )}
      {/* Hero Section */}
      <section className='relative bg-gradient-to-tr from-[#e0e7ff] via-white to-[#f0fdfa] py-24 px-4 text-center overflow-hidden'>
        <div className='absolute inset-0 z-0 pointer-events-none'>
          <div className='absolute top-[-120px] left-[20%] w-[400px] h-[400px] bg-white/40 rounded-full blur-3xl' />
          <div className='absolute bottom-[-100px] right-[15%] w-[500px] h-[500px] bg-[#10B981] opacity-20 rounded-full blur-2xl animate-float-slow' />
          <div className='absolute top-[25%] left-[10%] text-[#6EE7B7] text-7xl animate-float-slow'>
            ✨
          </div>
          <div className='absolute top-[60%] right-[10%] text-[#A7F3D0] text-6xl animate-pulse-slow'>
            🤖
          </div>
          <div className='absolute top-[15%] right-[15%] text-[#bbf7d0] text-6xl animate-float-slow'>
            💼
          </div>
          <div className='absolute bottom-[10%] left-[15%] text-[#99f6e4] text-6xl animate-pulse-slow'>
            🛠️
          </div>
        </div>
        <div className='relative z-10 max-w-3xl mx-auto bg-white/40 backdrop-blur-xl rounded-3xl p-10 shadow-lg'>
          {/* HERO TITLE: faqat bitta sarlavha chiqadi */}
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight'>
            {TEXT.hero.title[lang]}
          </h2>
          <p className='text-lg mb-8 text-gray-700'>
            {TEXT.hero.desc[lang]}
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <button
              onClick={() =>
                document
                  .getElementById("waitlist-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className='bg-[#10B981] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#0ea672] shadow-md'>
              {TEXT.hero.waitlist[lang]}
            </button>
            <Link
              href='/signup'
              className='bg-white/30 backdrop-blur-lg border border-white/20 text-[#10B981] px-6 py-3 rounded-full font-semibold shadow hover:bg-white/50 transition'>
              {TEXT.hero.start[lang]}
            </Link>
          </div>
        </div>
      </section>
      {/* Waitlist Form */}
      <section className='bg-white text-gray-800 py-16 px-6' id='waitlist-form'>
        <div className='max-w-3xl mx-auto bg-white rounded-2xl p-6 md:p-10 text-center shadow-lg hover:shadow-xl'>
          <h3 className='text-2xl md:text-3xl font-bold leading-snug mb-6'>
            {TEXT.waitlist.title[lang]}
          </h3>
          <WaitlistForm setNotification={setNotification} />
          <p className='mt-6 text-sm md:text-base text-gray-600'>
            {TEXT.waitlist.desc[lang]}
          </p>
        </div>
      </section>
      {/* How It Works */}
      <section className='bg-white text-gray-800 py-16 px-6' id='how-it-works'>
        <div className='max-w-6xl mx-auto text-center'>
          <div className='inline-block bg-[#DCFCE7] text-[#10B981] px-4 py-1 rounded-full text-sm font-medium mb-4'>
            {TEXT.howItWorksLabel[lang]}
          </div>
          <h2 className='text-3xl md:text-4xl font-bold mb-12'>
            {TEXT.howItWorksTitle[lang]}
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            {TEXT.howItWorks.map((item, i) => (
              <div
                key={i}
                className='bg-white rounded-xl shadow-md p-6 hover:shadow-xl text-left'>
                <h3 className='text-xl font-semibold mb-2'>{item.title[lang]}</h3>
                <p className='text-gray-600 text-sm'>{item.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features */}
      <section className='bg-white text-gray-800 py-20 px-6' id='features'>
        <div className='max-w-6xl mx-auto text-center'>
          <div className='inline-block bg-[#DCFCE7] text-[#10B981] px-4 py-1 rounded-full text-sm font-medium mb-4'>
            {TEXT.featuresLabel[lang]}
          </div>
          <h2 className='text-3xl md:text-4xl font-bold mb-12'>
            {TEXT.featuresTitle[lang]}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {TEXT.features.map(({ title, desc, icon }, i) => (
              <div
                key={i}
                className='bg-white rounded-xl p-6 shadow hover:shadow-xl focus-within:ring-2 focus-within:ring-[#10B981] text-left'>
                {icon}
                <h3 className='text-lg font-semibold mb-2'>{title[lang]}</h3>
                <p className='text-gray-600 text-sm'>{desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Project's  */}
      <section id='projects' className='relative z-10 py-24 px-6 bg-white overflow-hidden'>
        {/* Gradient spotlight background */}
        <div
          className='absolute inset-0 pointer-events-none z-0'
          style={{
            background:
              "radial-gradient(800px circle at center, rgba(34,197,94,0.06), transparent 80%)",
          }}
        />

        <div className='relative z-10 max-w-6xl mx-auto text-center'>
          <div className='inline-block bg-[#DCFCE7] text-[#10B981] px-4 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur'>
            Projects
          </div>
          <h2 className='text-4xl md:text-5xl font-bold mb-16 text-gray-900 leading-tight'>
            {TEXT.projects.title[lang]}
          </h2>

          {/* Top 2 cards */}
          <div className='grid md:grid-cols-2 gap-8 mb-12'>
            {TEXT.projects.topCards.map((item, idx) => (
              <div
                key={idx}
                className='relative z-10 backdrop-blur-md bg-white/60 rounded-3xl p-10 flex justify-between items-center text-left hover:shadow-xl transition'>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold mb-2 text-gray-900'>
                    {item.title[lang]}
                  </h3>
                  <p className='text-gray-700 text-sm'>{item.desc[lang]}</p>
                </div>
                <img src={item.icon} alt={item.title[lang]} className='ml-6' />
              </div>
            ))}
          </div>

          {/* Bottom 3 cards */}
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {TEXT.projects.bottomCards.map((item, idx) => (
              <div
                key={idx}
                className='relative z-10 backdrop-blur-md bg-white/60 rounded-3xl p-10 flex flex-col justify-between text-left hover:shadow-xl transition'>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold mb-2 text-gray-900'>
                    {item.title[lang]}
                  </h3>
                  <p className='text-gray-700 text-sm'>{item.desc[lang]}</p>
                </div>
                <img
                  src={item.icon}
                  alt={item.title[lang]}
                  className='mt-6   mx-auto'
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* community */}
      <section id="community" className="relative py-36 bg-white text-gray-800 overflow-hidden flex flex-col items-center">
        {/* Katta pastel doiralar va ustida ikonlar */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Doira 1 */}
          <div className="absolute top-10 left-1/4 w-[320px] h-[320px] bg-gradient-to-tr from-[#a7f3d0] to-[#f0fdfa] opacity-40 rounded-full blur-3xl" />
          <Github className="absolute top-24 left-[32%] w-12 h-12 text-[#374151] animate-float" />
          {/* Doira 2 */}
          <div className="absolute bottom-20 right-1/4 w-[220px] h-[220px] bg-gradient-to-tr from-[#fef9c3] to-[#e0e7ff] opacity-40 rounded-full blur-2xl" />
          <Twitter className="absolute bottom-32 right-[28%] w-10 h-10 text-[#1DA1F2] animate-float-slow" />
          {/* Doira 3 */}
          <div className="absolute top-1/2 left-1/2 w-[180px] h-[180px] bg-gradient-to-tr from-[#fca5a5] to-[#f0fdfa] opacity-30 rounded-full blur-2xl" />
          <Slack className="absolute top-[60%] left-[54%] w-10 h-10 text-[#0ea5e9] animate-bounce" />
          {/* Doira 4 */}
          <div className="absolute top-1/3 right-1/5 w-[120px] h-[120px] bg-gradient-to-tr from-[#c7d2fe] to-[#f0fdfa] opacity-30 rounded-full blur-2xl" />
          <Users className="absolute top-[38%] right-[22%] w-12 h-12 text-[#10B981] animate-float" />
        </div>
        {/* Kartochka blok */}
        <div className="relative z-10 max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 flex flex-col items-center gap-6 border border-[#bbf7d0]/40">
          <div className="inline-block bg-[#DCFCE7] text-[#10B981] px-4 py-1 rounded-full text-sm font-medium mb-2">
            {TEXT.community.label[lang]}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {TEXT.community.title[lang]}
          </h2>
          <p className="text-gray-600 text-base mb-2 text-center">
            {TEXT.community.desc[lang].split(".")[0]}
          </p>
          <p className="text-gray-600 text-base mb-2 text-center">
            {TEXT.community.desc[lang].split(".")[1]}
          </p>
          <p className="text-gray-600 text-base mb-6 text-center">
            {TEXT.community.desc[lang].split(".")[2]}
          </p>
          <button className="bg-[#10B981] text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-[#0ea672] transition">
            {TEXT.community.button[lang]}
          </button>
          {/* Ijtimoiy ikonlar */}
          <div className="flex gap-6 mt-4">
            <a href="https://github.com/fraijob" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#10B981] transition"><Github size={24} /></a>
            <a href="https://twitter.com/fraijob" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#10B981] transition"><Twitter size={24} /></a>
            <a href="mailto:hello@fraijob.com" className="text-gray-400 hover:text-[#10B981] transition"><Mail size={24} /></a>
          </div>
        </div>
      </section>
      {/* jobs */}
      <section id="jobs" className="w-full py-24 px-6 bg-white text-gray-800 relative">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-block bg-[#DCFCE7] text-[#10B981] px-4 py-1 rounded-full text-sm font-medium mb-4">
            {TEXT.jobs.title[lang]}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {lang === "uz" ? "Ishingizni ishonch bilan toping." : "Land your next job with confidence."}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {lang === "uz"
              ? "Freelance, stajirovka va to‘liq stavkali ishlarni o‘rganing — barchasi sizning ko‘nikma va maqsadlaringizga mos."
              : "Explore freelance gigs, internships, and full-time roles from verified companies — all tailored to your skills and goals."}
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
                  isOpen ? "bg-white border-[#10B981]" : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      className={`w-6 h-6 flex-shrink-0 transition ${
                        isOpen ? "text-[#10B981]" : "text-gray-500"
                      }`}
                    />
                    <span className="text-lg font-semibold text-gray-900">
                      {job.title[lang]}
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
                    {job.description[lang]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* footer*/}
      <footer className="bg-white/30 backdrop-blur-xl border-t border-white/20 mt-24 py-12 px-6 text-gray-700 shadow-lg max-w-6xl mx-auto rounded-3xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          {/* Left: Logo & Text */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">FraiJob</h2>
            <p className="text-gray-600">
              © {new Date().getFullYear()} FraiJob. {lang === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'All rights reserved.'}
            </p>
          </div>
          {/* Center: Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {FOOTER_LINKS.map((item, i) => (
              <a
                key={i}
                href={`#${item.id}`}
                className="hover:text-[#10B981] transition"
              >
                {item[lang]}
              </a>
            ))}
          </div>
          {/* Right: Social Icons */}
          <div className="flex gap-4 text-gray-500">
            <a
              href="https://github.com/fraijob"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#10B981] transition"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 21.13V25"/></svg>
            </a>
            <a
              href="https://twitter.com/fraijob"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#10B981] transition"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.5 2.24-4.5 5a4.5 4.5 0 0 0 .11 1A12.94 12.94 0 0 1 3 1.67a4.48 4.48 0 0 0-.61 2.27c0 1.57.8 2.96 2.02 3.77A4.52 4.52 0 0 1 2 6.13v.06c0 2.2 1.56 4.03 3.88 4.45a4.52 4.52 0 0 1-2.04.08c.57 1.8 2.23 3.11 4.2 3.15A9.05 9.05 0 0 1 1 19.54a12.8 12.8 0 0 0 6.29 1.84c7.55 0 11.68-6.29 11.68-11.76 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 23 3z"/></svg>
            </a>
            <a
              href="mailto:hello@fraijob.com"
              className="hover:text-[#10B981] transition"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
