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
  ArrowRight,
  Star,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import WaitlistForm from "../components/WaitlistForm";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

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

// Animation components
const FadeInUp = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const FadeInLeft = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const FadeInRight = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const ScaleIn = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const StaggerContainer = ({ children, staggerDelay = 0.05 }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
  >
    {children}
  </motion.div>
);

const StaggerItem = ({ children, delay = 0 }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.3, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const [notification, setNotification] = useState(null);
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState("system");
  const [openIndex, setOpenIndex] = useState(null);

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

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
      <motion.header 
        className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex justify-between items-center gap-20'>
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              FraiJob
            </h1>
          </Link>
          <nav className='space-x-8 hidden md:flex text-sm'>
            {TEXT.header[lang].map((label, i) => {
              // O'zbekcha va inglizcha linklar uchun ID mapping
              const linkMapping = {
                'uz': {
                  'Qanday ishlaydi': '#how-it-works',
                  'Xususiyatlar': '#features', 
                  'Loyihalar': '#projects',
                  'Jamiyat': '#community',
                  'Ishlar': '#jobs',
                  'Narxlar': '#pricing',
                  'Fikrlar': '#testimonials'
                },
                'en': {
                  'How It Works': '#how-it-works',
                  'Features': '#features',
                  'Projects': '#projects', 
                  'Community': '#community',
                  'Jobs': '#jobs',
                  'Pricing': '#pricing',
                  'Testimonials': '#testimonials'
                }
              };
              
              const href = linkMapping[lang][label] || `#${label.toLowerCase().replace(/\s+/g, "-")}`;
              
              return (
                <Link
                  key={i}
                  href={href}
                  className='text-gray-600 hover:text-[#10B981] transition-colors duration-300 font-medium relative group'>
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10B981] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex bg-gray-100 rounded-full overflow-hidden text-xs font-semibold p-1">
              <button
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === "uz" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleLangChange("uz")}
              >UZ</button>
              <button
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === "en" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleLangChange("en")}
              >EN</button>
            </div>
            {/* Mode Switcher */}
            <div className="flex bg-gray-100 rounded-full overflow-hidden p-1">
              <button
                className={`p-2 rounded-full transition-all duration-300 ${mode === "light" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleModeChange("light")}
                title="Light mode"
              ><Sun size={16} /></button>
              <button
                className={`p-2 rounded-full transition-all duration-300 ${mode === "dark" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleModeChange("dark")}
                title="Dark mode"
              ><Moon size={16} /></button>
              <button
                className={`p-2 rounded-full transition-all duration-300 ${mode === "system" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleModeChange("system")}
                title="System mode"
              ><Monitor size={16} /></button>
            </div>
            <Link
              href='/signup'
                              className='group relative bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-2.5 rounded-full text-sm font-semibold overflow-hidden transition-all duration-300 flex items-center gap-2 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
              <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{lang === 'uz' ? 'Boshlash' : 'Get started'}</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </motion.header>
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
      <motion.section 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className='relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 py-32 px-4 text-center overflow-hidden'>
        {/* Enhanced background decorations */}
        <div className='absolute inset-0 z-0 pointer-events-none'>
          <div className='absolute top-[-150px] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float-slow' />
          <div className='absolute bottom-[-120px] right-[10%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse-slow' />
          <div className='absolute top-[20%] left-[5%] w-20 h-20 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 rounded-full blur-xl animate-float-slow' />
          <div className='absolute top-[60%] right-[5%] w-16 h-16 bg-gradient-to-br from-pink-300/30 to-red-300/30 rounded-full blur-xl animate-pulse-slow' />
          <div className='absolute bottom-[30%] left-[20%] w-12 h-12 bg-gradient-to-br from-indigo-300/30 to-blue-300/30 rounded-full blur-lg animate-float-slow' />
        </div>
        
        <div className='relative z-10 max-w-4xl mx-auto'>
          <FadeInUp delay={0.05}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50">
              <Star size={16} className="text-yellow-500" />
              <span>{lang === 'uz' ? 'AI yordamida ishga tayyor bo\'ling' : 'Get job-ready with AI assistance'}</span>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <h2 className='text-4xl md:text-[4rem] font-bold mb-6 leading-tight max-w-6xl mx-auto'>
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {TEXT.hero.title[lang]}
              </span>
            </h2>
          </FadeInUp>
          
          <FadeInUp delay={0.15}>
            <p className='text-xl md:text-2xl mb-10 text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              {TEXT.hero.desc[lang]}
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <div className='flex flex-col sm:flex-row justify-center gap-6 mb-12'>
              <button
                onClick={() =>
                  document
                    .getElementById("waitlist-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className='group relative bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-3 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-[0_10px_25px_rgba(16,185,129,0.2)]'>
                <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">{TEXT.hero.waitlist[lang]}</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
              <Link
                href='/signup'
                className='group relative bg-white/80 backdrop-blur-xl border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-[0_10px_25px_rgba(16,185,129,0.15)] hover:border-[#10B981] hover:text-[#10B981]'>
                <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/10 to-[#34D399]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">{TEXT.hero.start[lang]}</span>
                <Zap size={18} className="relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              </Link>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.25}>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>{lang === 'uz' ? '10,000+ foydalanuvchi' : '10,000+ users'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{lang === 'uz' ? 'AI yordamida' : 'AI-powered'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>{lang === 'uz' ? 'Bepul sinab ko\'ring' : 'Try for free'}</span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </motion.section>
      {/* Waitlist Form */}
      <section className='relative bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 py-24 px-6 overflow-hidden' id='waitlist-form'>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <ScaleIn>
          <div className='relative z-10 max-w-4xl mx-auto'>
            <div className='bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center shadow-lg border border-white/20 relative overflow-hidden'>
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-blue-100/50 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-2xl"></div>
              <FadeInUp delay={0.05}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50">
                  <Target size={16} className="text-emerald-600" />
                  <span>{lang === 'uz' ? 'Birinchi bo\'ling' : 'Be the first'}</span>
                </div>
              </FadeInUp>
              
              <FadeInUp delay={0.1}>
                <h3 className='text-3xl md:text-4xl font-bold leading-snug mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                  {TEXT.waitlist.title[lang]}
                </h3>
              </FadeInUp>
              
              <FadeInUp delay={0.15}>
                <WaitlistForm setNotification={setNotification} />
              </FadeInUp>
              
              <FadeInUp delay={0.2}>
                <p className='mt-8 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed'>
                  {TEXT.waitlist.desc[lang]}
                </p>
              </FadeInUp>
              
              <FadeInUp delay={0.25}>
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span>{lang === 'uz' ? 'Bepul' : 'Free'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-500" />
                    <span>{lang === 'uz' ? 'Xavfsiz' : 'Secure'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-yellow-500" />
                    <span>{lang === 'uz' ? 'Tezkor' : 'Instant'}</span>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </ScaleIn>
      </section>
      {/* How It Works */}
      <section className='relative bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 py-24 px-6 overflow-hidden' id='how-it-works'>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className='relative z-10 max-w-6xl mx-auto text-center'>
          <FadeInUp>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <Workflow size={16} className="text-emerald-600" />
              <span>{TEXT.howItWorksLabel[lang]}</span>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <h2 className='text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
              {TEXT.howItWorksTitle[lang]}
            </h2>
          </FadeInUp>
          
          <StaggerContainer staggerDelay={0.1}>
            <div className='grid md:grid-cols-3 gap-8'>
              {TEXT.howItWorks.map((item, i) => (
                <StaggerItem key={i}>
                  <div className='group bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-left border border-white/20 transition-all duration-300 relative overflow-hidden'>
                    {/* Step number */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      {i + 1}
                    </div>
                    
                    {/* Icon background */}
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {item.title[lang] === "Profil yarating" || item.title[lang] === "Create Your Smart Profile" ? (
                        <GraduationCap size={32} className='text-emerald-600' />
                      ) : item.title[lang] === "Amaliyot va isbot" || item.title[lang] === "Practice & Prove Your Skills" ? (
                        <Target size={32} className='text-emerald-600' />
                      ) : (
                        <Rocket size={32} className='text-emerald-600' />
                      )}
                    </div>
                    
                    <h3 className='text-xl font-bold mb-4 text-gray-900'>{item.title[lang]}</h3>
                    <p className='text-gray-600 leading-relaxed'>{item.desc[lang]}</p>
                    
                    {/* Arrow connector */}
                    {i < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ArrowRight size={24} className="text-emerald-300" />
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
      {/* Features */}
      <section className='relative bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30 py-24 px-6 overflow-hidden' id='features'>
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className='relative z-10 max-w-7xl mx-auto text-center'>
          <FadeInUp>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <Sparkles size={16} className="text-emerald-600" />
              <span>{TEXT.featuresLabel[lang]}</span>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <h2 className='text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
              {TEXT.featuresTitle[lang]}
            </h2>
          </FadeInUp>
          
          <StaggerContainer staggerDelay={0.05}>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {TEXT.features.map(({ title, desc, icon }, i) => (
                <StaggerItem key={i}>
                  <div className='group bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-left border border-white/20 transition-all duration-300 relative overflow-hidden'>
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Icon with enhanced styling */}
                    <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {icon}
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className='text-lg font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors'>{title[lang]}</h3>
                      <p className='text-gray-600 text-sm leading-relaxed'>{desc[lang]}</p>
                    </div>
                    
                    {/* Hover indicator */}
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
      {/* Project's  */}
      <section id='projects' className="relative z-10 py-24 px-6 bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/5 to-emerald-200/5 rounded-full blur-2xl"></div>
        </div>

        <div className='relative z-10 max-w-6xl mx-auto text-center'>
          <FadeInUp>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <Briefcase size={16} className="text-emerald-600" />
              <span>Projects</span>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <h2 className='text-4xl md:text-5xl font-bold mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
              {TEXT.projects.title[lang]}
            </h2>
          </FadeInUp>

          {/* Top 2 cards */}
          <StaggerContainer staggerDelay={0.1}>
            <div className='grid md:grid-cols-2 gap-8 mb-12'>
              {TEXT.projects.topCards.map((item, idx) => (
                <StaggerItem key={idx}>
                  <div className='group bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-left border border-white/20 transition-all duration-300 relative overflow-hidden h-72'>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className='relative z-10 flex justify-between items-center'>
                      <div className='flex-1'>
                        <h3 className='text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors'>
                          {item.title[lang]}
                        </h3>
                        <p className='text-gray-600 leading-relaxed'>{item.desc[lang]}</p>
                      </div>
                      <div className="ml-6 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl flex items-center justify-center p-4">
                        <img src={item.icon} alt={item.title[lang]} />
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Bottom 3 cards */}
          <StaggerContainer staggerDelay={0.08}>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {TEXT.projects.bottomCards.map((item, idx) => (
                <StaggerItem key={idx}>
                  <div className='group bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-left border border-white/20 transition-all duration-300 relative overflow-hidden h-96'>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className='relative z-10 flex flex-col justify-between h-full'>
                      <div className='flex-1'>
                        <h3 className='text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors'>
                          {item.title[lang]}
                        </h3>
                        <p className='text-gray-600 leading-relaxed'>{item.desc[lang]}</p>
                      </div>
                      <div className="mt-6 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl flex items-center justify-center p-3">
                        <img
                          src={item.icon}
                          alt={item.title[lang]}
                        />
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
      {/* community */}
      <section id="community" className="relative py-32 bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30 text-gray-800 overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/5 to-emerald-200/5 rounded-full blur-2xl animate-float-slow" />
          

        </div>
        
        {/* Main content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <ScaleIn>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg p-12 border border-white/20 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-blue-100/50 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-2xl"></div>
              <FadeInUp delay={0.2}>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50">
                  <Users size={16} className="text-emerald-600" />
                  <span>{TEXT.community.label[lang]}</span>
                </div>
              </FadeInUp>
              
              <FadeInUp delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {TEXT.community.title[lang]}
                </h2>
              </FadeInUp>
              
              <FadeInUp delay={0.15}>
                <p className="text-lg text-gray-600 mb-8 text-center leading-relaxed max-w-2xl mx-auto">
                  {TEXT.community.desc[lang]}
                </p>
              </FadeInUp>
              
              <FadeInUp delay={0.2}>
                <button className="group relative bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg overflow-hidden transition-all duration-300 flex items-center gap-3 mx-auto hover:shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{TEXT.community.button[lang]}</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </FadeInUp>
              
              {/* Social icons with enhanced styling */}
              <FadeInUp delay={0.25}>
                <div className="flex gap-8 mt-12 justify-center">
                  <a href="https://github.com/fraijob" target="_blank" rel="noopener noreferrer" 
                     className="group relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    <Github size={28} className="relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://twitter.com/fraijob" target="_blank" rel="noopener noreferrer" 
                     className="group relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    <Twitter size={28} className="relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="mailto:hello@fraijob.com" 
                     className="group relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    <Mail size={28} className="relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </FadeInUp>
            </div>
          </ScaleIn>
        </div>
      </section>
      {/* jobs */}
      <section id="jobs" className="relative w-full py-24 px-6 bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 text-gray-800 overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/5 to-emerald-200/5 rounded-full blur-2xl"></div>
          <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full blur-xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-br from-pink-300/20 to-red-300/20 rounded-full blur-lg animate-pulse-slow"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center mb-16">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50">
              <Briefcase size={16} className="text-emerald-600" />
              <span>{TEXT.jobs.title[lang]}</span>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              {lang === "uz" ? "Ishingizni ishonch bilan toping." : "Land your next job with confidence."}
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.15}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {lang === "uz"
                ? "Freelance, stajirovka va to‘liq stavkali ishlarni o‘rganing — barchasi sizning ko‘nikma va maqsadlaringizga mos."
                : "Explore freelance gigs, internships, and full-time roles from verified companies — all tailored to your skills and goals."}
            </p>
          </FadeInUp>
        </div>
        <StaggerContainer staggerDelay={0.05}>
          <div className="max-w-3xl mx-auto space-y-4">
            {jobsData.map((job, index) => {
              const Icon = job.icon;
              const isOpen = openIndex === index;
              return (
                <StaggerItem key={index}>
                  <div
                    className={`group rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                      isOpen ? "bg-white/90 backdrop-blur-xl border-[#10B981] shadow-md" : "bg-white/80 backdrop-blur-xl border-gray-200 hover:border-[#10B981]/50"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex justify-between items-center p-6 text-left focus:outline-none group-hover:bg-gradient-to-r group-hover:from-emerald-50/50 group-hover:to-blue-50/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isOpen ? "bg-gradient-to-br from-[#10B981] to-[#34D399] text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gradient-to-br group-hover:from-[#10B981]/20 group-hover:to-[#34D399]/20 group-hover:text-[#10B981]"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-semibold text-gray-900 group-hover:text-[#10B981] transition-colors">
                          {job.title[lang]}
                        </span>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen ? "bg-[#10B981] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-[#10B981] group-hover:text-white"
                      }`}>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-gray-700 leading-relaxed bg-gradient-to-br from-emerald-50/30 to-blue-50/30">
                        {job.description[lang]}
                      </div>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </section>

      {/* footer*/}
      <footer className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 border-t border-gray-200 mt-24 py-16 px-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#10B981] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#34D399] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#6EE7B7] opacity-10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">FraiJob</h3>
              </div>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                {lang === 'uz' 
                  ? "AI yordamida ishga tayyor bo'ling va haqiqiy ko'nikmalar orqali yangi imkoniyatlarni oching."
                  : "Get job-ready with AI assistance and unlock new opportunities through real skills."
                }
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/fraijob"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-[#10B981] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group"
                >
                  <Github size={20} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://twitter.com/fraijob"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-[#10B981] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group"
                >
                  <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="mailto:hello@fraijob.com"
                  className="w-10 h-10 bg-gray-100 hover:bg-[#10B981] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 group"
                >
                  <Mail size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                {lang === 'uz' ? 'Tezkor havolalar' : 'Quick Links'}
              </h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.slice(0, 3).map((item, i) => (
                  <li key={i}>
                    <a
                      href={`#${item.id}`}
                      className="text-gray-600 hover:text-[#10B981] transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-[#10B981] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {item[lang]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                {lang === 'uz' ? 'Aloqa' : 'Contact'}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-[#10B981] bg-opacity-10 rounded-full flex items-center justify-center">
                    <Mail size={16} className="text-[#10B981]" />
                  </div>
                  <span className="text-sm">hello@fraijob.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-[#10B981] bg-opacity-10 rounded-full flex items-center justify-center">
                    <MessageCircle size={16} className="text-[#10B981]" />
                  </div>
                  <span className="text-sm">
                    {lang === 'uz' ? '24/7 qo\'llab-quvvatlash' : '24/7 Support'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} FraiJob. {lang === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'All rights reserved.'}
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-500 hover:text-[#10B981] transition-colors">
                  {lang === 'uz' ? 'Maxfiylik siyosati' : 'Privacy Policy'}
                </a>
                <a href="#" className="text-gray-500 hover:text-[#10B981] transition-colors">
                  {lang === 'uz' ? 'Foydalanish shartlari' : 'Terms of Service'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
