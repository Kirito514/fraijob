"use client";

import Link from "next/link";
import Image from "next/image";
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
  Clock,
  ChevronUp,
  ChevronDown,
  Mail,
  ArrowRight,
  Star,
  Zap,
  Target,
  TrendingUp,
  Eye,
  DollarSign,
  Check,
  Menu,
  X,
} from "lucide-react";
import WaitlistForm from "../components/WaitlistForm";
import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// Matnlarni i18n uchun massivlarda saqlash
const TEXT = {
  header: {
    uz: [
      "Qanday ishlaydi",
      "Xususiyatlar",
      "Loyihalar",
      "Jamiyat",
      "Narxlar",
      "Ishlar",
      "Fikrlar",
    ],
    en: [
      "How It Works",
      "Features",
      "Projects",
      "Community",
      "Pricing",
      "Jobs",
      "Testimonials",
    ],
  },
  hero: {
    title: {
      uz: "AI yordamchi — FraiJob: Ishga tayyor bo'ling",
      en: "Your AI Partner — FraiJob: Become a Job-Ready Talent",
    },
    desc: {
      uz: "Amaliyot, isbot va yangi imkoniyatlarni FraiJob bilan oching",
      en: "Practice, prove, and unlock your next opportunity with FraiJob",
    },
    waitlist: {
      uz: "FraiJob kutuviga qo'shiling",
      en: "Join FraiJob Waitlist",
    },
    start: {
      uz: "Boshlash",
      en: "Start your journey",
    },
  },
  waitlist: {
    title: {
      uz: "FraiJob aqlli ish vositalarini birinchi bo'lib sinab ko'ring.",
      en: "Be the first to try FraiJob's smart career tools.",
    },
    desc: {
      uz: "Joylar tez to'lib bormoqda — FraiJob'ni shakllantirishda birinchi bo'ling va eksklyuziv imkoniyatlarga ega bo'ling.",
      en: "Spots are filling up fast — be among the first to shape FraiJob and unlock exclusive early-access benefits.",
    },
  },
  howItWorks: [
    {
      title: { uz: "Profil yarating", en: "Create Your Smart Profile" },
      desc: {
        uz: "AI yordamida rezyume tuzing. Shaxsiy baholash va o'sish yo'nalishini oling.",
        en: "Build your AI-powered resume. Get personalized skill assessments and a roadmap for your growth.",
      },
    },
    {
      title: { uz: "Amaliyot va isbot", en: "Practice & Prove Your Skills" },
      desc: {
        uz: "Haqiqiy loyihalarda qatnashing, jamoa bilan ishlang va AI intervyu simulyatoridan foydalaning.",
        en: "Join real projects, collaborate with teams, and use the AI Interview Simulator to get job-ready faster.",
      },
    },
    {
      title: {
        uz: "Bir klikda ishga joylashish",
        en: "Apply & Get Hired Instantly",
      },
      desc: {
        uz: "Bir klikda ishga murojaat qiling. Tasdiqlangan ko'nikmalar va tajriba bilan ajralib turing.",
        en: "One-click apply for freelance or full-time roles. Stand out with verified skills, real experience, and AI-ranked profile.",
      },
    },
  ],
  howItWorksLabel: { uz: "Qanday ishlaydi", en: "How It Works" },
  howItWorksTitle: {
    uz: "FraiJob yordamida 3 qadamda haqiqiy ko'nikmalar va ish oling",
    en: "See how FraiJob helps you build real skills and get hired - in 3 simple steps",
  },
  featuresLabel: { uz: "Xususiyatlar", en: "Features" },
  featuresTitle: {
    uz: "Mana shu aqlli xususiyatlar bilan imkoniyatingizni oching",
    en: "Unlock your potential with these smart features",
  },
  features: [
    {
      title: { uz: "AI rezyume yaratuvchi", en: "Smart Resume Builder" },
      desc: {
        uz: "AI yordamida professional rezyume tuzing, ko'nikmalaringiz va tajribangizga mos.",
        en: "Create a professional resume with AI, tailored to your skills and real project experience.",
      },
      icon: <GraduationCap size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "AI intervyu simulyatori", en: "AI Interview Simulator" },
      desc: {
        uz: "AI yordamida haqiqiy intervyu savollarini mashq qiling va zaif joylaringizni yaxshilang.",
        en: "Practice real interview questions with AI, get instant feedback and improve weak areas.",
      },
      icon: <BrainCircuit size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "Skill-Based Roadmap", en: "Skill-Based Roadmap" },
      desc: {
        uz: "Shaxsiy baholash va kasb maqsadingizga mos o'sish va o'zlashtirish yo'nalishini oling.",
        en: "Get a personalized learning and growth plan based on your current skills and career goals.",
      },
      icon: <BarChart2 size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "Real Project Hub", en: "Real Project Hub" },
      desc: {
        uz: "Haqiqiy loyihalarda qatnashing, portfolio yarating va tajribangizni oling.",
        en: "Join or launch real-world projects, build your portfolio, and gain hands-on experience.",
      },
      icon: <Briefcase size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "Instant Apply System", en: "Instant Apply System" },
      desc: {
        uz: "AI yordamida bir klikda ishga murojaat qiling. Sizning profilingizga mos keladigan eng yaxshi imkoniyatlarni AI taklif qiladi.",
        en: "Apply for jobs with one click — AI recommends the best opportunities for your profile.",
      },
      icon: <Rocket size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "AI Candidate Matching", en: "AI Candidate Matching" },
      desc: {
        uz: "Ish beruvchilar AI asosida eng yaxshi kandidatlar ro'yxatini olishadi, portfoliyalar va faoliyat tahlili bilan.",
        en: "Employers get top candidate shortlists with AI-based ranking, portfolios, and activity analysis.",
      },
      icon: <UserCheck size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "Community Forum", en: "Community Forum" },
      desc: {
        uz: "Bilish, bilish va o'z bilimingizni rivojlantiring. Jamoada va sirtqi ilmiy mentorlar bilan bog'laning.",
        en: "Connect, share knowledge, ask questions, and learn from peers and industry mentors.",
      },
      icon: <Users size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "Internship Funnel", en: "Internship Funnel" },
      desc: {
        uz: "Yolg'on foydalanuvchilar uchun kutuvlar asosida ishlar olib borish imkoniyati. Yolg'on foydalanuvchilar uchun ish tajribasi olish.",
        en: "Eligible users get invited to internships as they progress on their roadmap — gain real work experience.",
      },
      icon: <BadgeCheck size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "AI Career Coach", en: "AI Career Coach" },
      desc: {
        uz: "Shaxsiy takliflar va mentorlik takliflarini oling. Sizning kasb yo'nalishingizni yaxshilang.",
        en: "Personalized tips and mentorship recommendations to boost your career journey.",
      },
      icon: <Sparkles size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "Verified Skills", en: "Verified Skills" },
      desc: {
        uz: "Barcha sizning afzalliklar va ko'nikmalaringiz haqida ma'lumotlar va tasdiqlanadi. Haqiqiy vaqtda.",
        en: "All your achievements and skills are tracked and verified in real-time.",
      },
      icon: <ShieldCheck size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "Job Market Insights", en: "Job Market Insights" },
      desc: {
        uz: "Sizning sohasidagi trend ko'nikmalar va eng talab qilinadigan ish kategoriyalarini aniqlang.",
        en: "Discover trending skills and the most in-demand job categories in your field.",
      },
      icon: <FileSearch size={36} className='text-[#10B981] mb-4' />,
    },
    {
      title: { uz: "AI Learning Assistant", en: "AI Learning Assistant" },
      desc: {
        uz: "Savollar berish, tushuntirishlar olish va o'rganishda qolib qolmasangiz, AI yordamchisi sizni yordam beradi.",
        en: "Ask questions, get explanations, and never get stuck while learning.",
      },
      icon: <Lightbulb size={36} className='text-[#10B981] mb-4' />,
    },
  ],
  projects: {
    title: {
      uz: "Haqiqiy loyihalar. Haqiqiy tajriba.",
      en: "Real projects. Real experience.",
    },
    topCards: [
      {
        title: { uz: "Loyiha boshlash", en: "Start a Project" },
        desc: {
          uz: "O'zingizning loyihingizni boshlang, to'g'ri maqsadlar o'rnatish va jamoangizni taklif qiling.",
          en: "Launch your own project, set clear goals, and invite your team.",
        },
        icon: "/images/start-project.svg",
      },
      {
        title: {
          uz: "Vazifalar va vazifalarini boshqarish",
          en: "Manage & Track Tasks",
        },
        desc: {
          uz: "Katta maqsadlarni vazifalarga ajrating, muddatlar o'rnatish va vazifalaringizni osonlik bilan boshqarish.",
          en: "Break big goals into tasks, set deadlines, and track your progress easily.",
        },
        icon: "/images/task-tracking.svg",
      },
    ],
    bottomCards: [
      {
        title: { uz: "Jam olish", en: "Team Collaboration" },
        desc: {
          uz: "Boshqalar bilan qo'shiling, vazifalarni bajarish va haqiqiy vaqtda jamoaningiz bilan ishlash.",
          en: "Invite others to join, assign roles, and build together in real-time.",
        },
        icon: "/images/team-collab.svg",
      },
      {
        title: { uz: "AI yordamchisi", en: "AI Assistance" },
        desc: {
          uz: "AI yordamida fikrlar yaratish, yaxshiroq tavsiflar yozish va ishingizni yuqori darajaga ko'tarish.",
          en: "Use AI to generate ideas, write better descriptions, and level up your work.",
        },
        icon: "/images/ai-help.svg",
      },
      {
        title: {
          uz: "Ko'rsatish va rezyume birlashishi",
          en: "Showcase & Resume Integration",
        },
        desc: {
          uz: "Agar loyihingiz bajarilsa, u avtomatik ravishda rezyumeingizga va umumiy portfoliyingizga qo'shiladi.",
          en: "When your project is done, it's automatically added to your resume and public portfolio.",
        },
        icon: "/images/showcase.svg",
      },
    ],
  },
  community: {
    label: { uz: "Jamiyat", en: "Community" },
    title: {
      uz: "Texnologiyalar bilan bog'lanish joyi.",
      en: "The place where tech minds connect.",
    },
    desc: {
      uz: "Bilish, ulash va o'zimizni rivojlantiring. Sizning jamoangiz bilan ishlash, jamoangiz bilan ishlash va yordam olish.",
      en: "Connect, share, and grow with your community. Join discussions, find teammates, and get help.",
    },
    button: {
      uz: "Jamoa bilan bog'lanish",
      en: "Join the community",
    },
    stats: {
      members: { uz: "10,000+", en: "10,000+" },
      discussions: { uz: "5,000+", en: "5,000+" },
      projects: { uz: "2,000+", en: "2,000+" },
      mentors: { uz: "500+", en: "500+" },
    },
    features: [
      {
        title: { uz: "Forum va Munozaralar", en: "Forums & Discussions" },
        desc: {
          uz: "Texnologiya, loyihalar va martaba haqida suhbatlashing",
          en: "Discuss technology, projects, and career topics",
        },
        icon: MessageCircle,
      },
      {
        title: { uz: "Jamoa Topish", en: "Find Teams" },
        desc: {
          uz: "Loyihangiz uchun to'g'ri hamkorlarni toping",
          en: "Find the right teammates for your projects",
        },
        icon: Users,
      },
      {
        title: { uz: "Mentorlik", en: "Mentorship" },
        desc: {
          uz: "Tajribali mutaxassislardan maslahat oling",
          en: "Get advice from experienced professionals",
        },
        icon: UserCheck,
      },
      {
        title: { uz: "Loyiha Hamkorlik", en: "Project Collaboration" },
        desc: {
          uz: "Boshqalar bilan loyihalarda ishlang",
          en: "Work on projects with others",
        },
        icon: Workflow,
      },
    ],
    recentDiscussions: [
      {
        title: {
          uz: "React 18 yangi xususiyatlari",
          en: "React 18 New Features",
        },
        author: "Aziz Karimov",
        replies: 23,
        views: 156,
        category: "Frontend",
      },
      {
        title: {
          uz: "AI va dasturlash kelajagi",
          en: "AI and Programming Future",
        },
        author: "Malika Yusupova",
        replies: 45,
        views: 289,
        category: "AI/ML",
      },
      {
        title: {
          uz: "Freelance loyihalar uchun maslahat",
          en: "Advice for Freelance Projects",
        },
        author: "Jasur Toshmatov",
        replies: 12,
        views: 89,
        category: "Career",
      },
    ],
  },
  jobs: {
    title: {
      uz: "Ishlar",
      en: "Jobs",
    },
  },
  pricing: {
    label: { uz: "Narxlar", en: "Pricing" },
    title: {
      uz: "Sizning martabangiz uchun to'g'ri reja.",
      en: "The right plan for your career.",
    },
    desc: {
      uz: "Har xil darajadagi dasturchilar uchun moslashgan rejalar. Boshlang va o'z martabangizni rivojlantiring.",
      en: "Plans tailored for developers at every level. Start free and scale your career.",
    },
    plans: [
      {
        name: { uz: "Bepul", en: "Free" },
        price: { uz: "0", en: "0" },
        currency: { uz: "so'm", en: "$" },
        period: { uz: "oyiga", en: "/month" },
        desc: { uz: "Boshlang uchun", en: "Perfect to get started" },
        features: [
          { uz: "5 ta loyiha", en: "5 projects" },
          { uz: "Asosiy AI yordam", en: "Basic AI assistance" },
          { uz: "Jamiyatga kirish", en: "Community access" },
          { uz: "Standart rezyume", en: "Standard resume" },
          { uz: "Email qo'llab-quvvatlash", en: "Email support" },
        ],
        popular: false,
        color: "from-gray-500 to-gray-600",
      },
      {
        name: { uz: "Pro", en: "Pro" },
        price: { uz: "99,000", en: "19" },
        currency: { uz: "so'm", en: "$" },
        period: { uz: "oyiga", en: "/month" },
        desc: {
          uz: "Professional rivojlanish",
          en: "For growing professionals",
        },
        features: [
          { uz: "Cheksiz loyihalar", en: "Unlimited projects" },
          { uz: "Kuchli AI yordam", en: "Advanced AI assistance" },
          { uz: "Eksklyuziv jamiyat", en: "Exclusive community" },
          { uz: "AI rezyume yaratish", en: "AI resume builder" },
          { uz: "24/7 qo'llab-quvvatlash", en: "24/7 priority support" },
          { uz: "Mentorlik sessiyalari", en: "Mentorship sessions" },
          { uz: "Ish intervyu simulyatori", en: "Job interview simulator" },
        ],
        popular: true,
        color: "from-emerald-500 to-emerald-600",
      },
      {
        name: { uz: "Enterprise", en: "Enterprise" },
        price: { uz: "299,000", en: "49" },
        currency: { uz: "so'm", en: "$" },
        period: { uz: "oyiga", en: "/month" },
        desc: { uz: "Katta jamoalar uchun", en: "For teams and companies" },
        features: [
          { uz: "Barcha Pro xususiyatlari", en: "All Pro features" },
          { uz: "Jamoaviy boshqaruv", en: "Team management" },
          { uz: "API kirish", en: "API access" },
          { uz: "Maxsus integratsiyalar", en: "Custom integrations" },
          { uz: "Dedicated qo'llab-quvvatlash", en: "Dedicated support" },
          { uz: "Maxsus o'quv dasturi", en: "Custom training programs" },
          { uz: "Analitika va hisobotlar", en: "Analytics & reporting" },
        ],
        popular: false,
        color: "from-blue-500 to-blue-600",
      },
    ],
    button: {
      uz: "Rejani tanlang",
      en: "Choose Plan",
    },
    note: {
      uz: "Barcha rejalar 30 kunlik bepul sinov bilan. Hech qanday karta talab qilinmaydi.",
      en: "All plans include a 30-day free trial. No credit card required.",
    },
  },
  testimonials: {
    label: { uz: "Fikrlar", en: "Testimonials" },
    title: {
      uz: "Foydalanuvchilarimiz nima deyishadi.",
      en: "What our users say.",
    },
    desc: {
      uz: "FraiJob bilan martabalarini rivojlantirgan dasturchilarning haqiqiy hikoyalari.",
      en: "Real stories from developers who've grown their careers with FraiJob.",
    },
    reviews: [
      {
        name: "Aziz Karimov",
        role: { uz: "Frontend Dasturchi", en: "Frontend Developer" },
        company: "TechCorp",
        avatar: "👨‍💻",
        rating: 5,
        text: {
          uz: "FraiJob orqali men o'z ko'nikmalarimni rivojlantirdim va yaxshi ish topdim. AI yordamchisi juda foydali bo'ldi!",
          en: "Through FraiJob, I developed my skills and found a great job. The AI assistant was incredibly helpful!",
        },
        highlight: { uz: "3 oyda ish topdi", en: "Found job in 3 months" },
      },
      {
        name: "Malika Yusupova",
        role: { uz: "Full Stack Dasturchi", en: "Full Stack Developer" },
        company: "StartupHub",
        avatar: "👩‍💻",
        rating: 5,
        text: {
          uz: "Jamiyat va mentorlik sessiyalari mening martabamni butunlay o'zgartirdi. FraiJob haqiqatan ham ishlaydi!",
          en: "The community and mentorship sessions completely transformed my career. FraiJob really works!",
        },
        highlight: { uz: "50% maosh oshdi", en: "50% salary increase" },
      },
      {
        name: "Jasur Toshmatov",
        role: { uz: "Backend Dasturchi", en: "Backend Developer" },
        company: "DataFlow",
        avatar: "👨‍💻",
        rating: 5,
        text: {
          uz: "Loyihalar va AI intervyu simulyatori meni ishga tayyor bo'lishimga yordam berdi. Juda tavsiya etaman!",
          en: "The projects and AI interview simulator helped me get job-ready. Highly recommend!",
        },
        highlight: { uz: "2 oyda ishga joylashdi", en: "Hired in 2 months" },
      },
    ],
    stats: {
      users: { uz: "10,000+", en: "10,000+" },
      success: { uz: "95%", en: "95%" },
      companies: { uz: "500+", en: "500+" },
      countries: { uz: "50+", en: "50+" },
    },
  },
};

// JobsSection kodini landing page ichiga joylayman va i18n matnlari bilan moslashtiraman
const jobsData = [
  {
    title: {
      uz: "Masofaviy va ofis ishlar",
      en: "Remote & On-Site Offers",
    },
    description: {
      uz: "Istalgan joydan ishlang yoki ofis jamoasiga qo'shiling. Hayotingizga mos masofaviy yoki ofis ishlarini tanlang.",
      en: "Work from anywhere or join teams in the office. Pick flexible remote or in-person jobs that match your lifestyle.",
    },
    icon: Briefcase,
  },
  {
    title: {
      uz: "Ko'nikmaga asoslangan moslik",
      en: "Skill-Based Matching",
    },
    description: {
      uz: "Endi tasodifiy takliflar yo'q — faqat sizning ko'nikma va tajribangizga mos ishlarni ko'rasiz.",
      en: "No more random offers — see only jobs that fit your skills and experience.",
    },
    icon: BarChart2,
  },
  {
    title: {
      uz: "Tasdiqlangan ish beruvchilar",
      en: "Verified Employers",
    },
    description: {
      uz: "Barcha kompaniyalar ishonchliligi tekshirilgan. Vaqtingiz va iste'dodingizni qadrlaydigan ish beruvchilar bilan ishlang.",
      en: "All companies are checked for legitimacy. Work with reliable employers who value your time and talent.",
    },
    icon: ShieldCheck,
  },
  {
    title: {
      uz: "Moslashuvchan vaqt imkoniyatlari",
      en: "Flexible Time Options",
    },
    description: {
      uz: "To'liq, yarim stavka yoki freelancerlik ishlarni toping. Jadvalingizga mosini tanlang.",
      en: "Find full-time, part-time, or freelance work. Choose what works best for your schedule.",
    },
    icon: Clock,
  },
  {
    title: {
      uz: "Ariza holatini kuzatish",
      en: "Track Your Application Status",
    },
    description: {
      uz: "Har bir arizangiz bo'yicha yangiliklardan xabardor bo'ling. Real vaqt bildirishnomalari — kutib qolmaysiz.",
      en: "Stay updated on every application. Get real-time notifications — never be left waiting.",
    },
    icon: ClipboardCheck,
  },
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
    transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const FadeInLeft = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const FadeInRight = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const ScaleIn = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const StaggerContainer = ({ children, staggerDelay = 0.05 }) => (
  <motion.div
    initial='hidden'
    whileInView='visible'
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}>
    {children}
  </motion.div>
);

const StaggerItem = ({ children, delay = 0 }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.3, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

export default function LandingPage() {
  const [notification, setNotification] = useState(null);
  const [lang, setLang] = useState("en");
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    companies: 0,
    successRate: 0,
    countries: 0,
  });

  // Scroll animations
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  // Language switcher
  const handleLangChange = (newLang) => {
    setLang(newLang);
    // Bu yerda i18n yoki boshqa tilni almashtirish logikasini qo'shish mumkin
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className='min-h-screen bg-white text-gray-800 scroll-smooth'>
      {/* Header */}
      <motion.header className='sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 py-4 mobile-menu-container'>
        <div className='max-w-7xl mx-auto flex justify-between items-center gap-4 lg:gap-8'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-3 flex-shrink-0'>
            <div className='w-18 h-10 relative'>
              <Image
                src='/logo.svg'
                alt='FraiJob logo'
                fill
                className='object-contain'
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className='space-x-6 lg:space-x-8 hidden lg:flex text-sm flex-1 justify-center mx-auto'>
            {TEXT.header[lang].map((label, i) => {
              // O'zbekcha va inglizcha linklar uchun ID mapping
              const linkMapping = {
                uz: {
                  "Qanday ishlaydi": "#how-it-works",
                  Xususiyatlar: "#features",
                  Loyihalar: "#projects",
                  Jamiyat: "#community",
                  Narxlar: "#pricing",
                  Ishlar: "#jobs",
                  Fikrlar: "#testimonials",
                },
                en: {
                  "How It Works": "#how-it-works",
                  Features: "#features",
                  Projects: "#projects",
                  Community: "#community",
                  Pricing: "#pricing",
                  Jobs: "#jobs",
                  Testimonials: "#testimonials",
                },
              };

              const href =
                linkMapping[lang][label] ||
                `#${label.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <Link
                  key={i}
                  href={href}
                  className='text-gray-600 hover:text-[#10B981] transition-colors duration-300 font-medium relative group whitespace-nowrap'>
                  {label}
                  <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-[#10B981] transition-all duration-300 group-hover:w-full'></span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Controls */}
          <div className='hidden lg:flex items-center gap-3 xl:gap-4'>
            {/* Language Switcher */}
            <div className='flex bg-gray-100 rounded-full overflow-hidden text-xs font-semibold p-1'>
              <button
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === "uz" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleLangChange("uz")}>
                UZ
              </button>
              <button
                className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === "en" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleLangChange("en")}>
                EN
              </button>
            </div>

            <Link
              href='/signup'
              className='group relative bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-4 xl:px-6 py-2.5 rounded-full text-sm font-semibold overflow-hidden transition-all duration-300 flex items-center gap-2 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
              <div className='absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <span className='relative z-10'>
                {lang === "uz" ? "Boshlash" : "Get started"}
              </span>
              <ArrowRight
                size={16}
                className='relative z-10 group-hover:translate-x-1.5 transition-transform duration-300'
              />
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className='flex lg:hidden items-center gap-2'>
            {/* Language Switcher for Mobile */}
            <div className='flex bg-gray-100 rounded-full overflow-hidden text-xs font-semibold p-1'>
              <button
                className={`px-2 py-1 rounded-full transition-all duration-300 ${lang === "uz" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleLangChange("uz")}>
                UZ
              </button>
              <button
                className={`px-2 py-1 rounded-full transition-all duration-300 ${lang === "en" ? "bg-white text-[#10B981] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => handleLangChange("en")}>
                EN
              </button>
            </div>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200'>
              {mobileMenuOpen ? (
                <X size={20} className='text-gray-700' />
              ) : (
                <Menu size={20} className='text-gray-700' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className='lg:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl overflow-hidden'>
              <div className='p-6 space-y-4'>
                {/* Mobile Navigation */}
                <nav className='space-y-3'>
                  {TEXT.header[lang].map((label, i) => {
                    const linkMapping = {
                      uz: {
                        "Qanday ishlaydi": "#how-it-works",
                        Xususiyatlar: "#features",
                        Loyihalar: "#projects",
                        Jamiyat: "#community",
                        Narxlar: "#pricing",
                        Ishlar: "#jobs",
                        Fikrlar: "#testimonials",
                      },
                      en: {
                        "How It Works": "#how-it-works",
                        Features: "#features",
                        Projects: "#projects",
                        Community: "#community",
                        Pricing: "#pricing",
                        Jobs: "#jobs",
                        Testimonials: "#testimonials",
                      },
                    };

                    const href =
                      linkMapping[lang][label] ||
                      `#${label.toLowerCase().replace(/\s+/g, "-")}`;

                    return (
                      <Link
                        key={i}
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className='block text-gray-700 hover:text-[#10B981] transition-colors duration-300 font-medium py-2 px-3 rounded-lg hover:bg-gray-50'>
                        {label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Signup Button */}
                <div className='pt-4 border-t border-gray-200'>
                  <Link
                    href='/signup'
                    onClick={() => setMobileMenuOpen(false)}
                    className='w-full group relative bg-gradient-to-r from-[#10B981] to-[#34D399] text-white py-3 px-4 rounded-xl text-sm font-semibold overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
                    <div className='absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <span className='relative z-10'>
                      {lang === "uz" ? "Boshlash" : "Get started"}
                    </span>
                    <ArrowRight
                      size={16}
                      className='relative z-10 group-hover:translate-x-1.5 transition-transform duration-300'
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      {/* Toast */}
      {notification && (
        <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-fit max-w-sm px-6 py-4 flex items-start gap-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md bg-white/70'>
          <div
            className={`p-2 rounded-full ${
              notification.type === "success"
                ? "bg-[#10B981]/10 text-[#10B981]"
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
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <Star size={16} className='text-yellow-500' />
              <span>
                {lang === "uz"
                  ? "AI yordamida ishga tayyor bo'ling"
                  : "Get job-ready with AI assistance"}
              </span>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <h2 className='text-4xl md:text-[4rem] font-bold mb-6 leading-tight max-w-6xl mx-auto'>
              <span className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent'>
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
                <div className='absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <span className='relative z-10'>
                  {TEXT.hero.waitlist[lang]}
                </span>
                <ArrowRight
                  size={18}
                  className='relative z-10 group-hover:translate-x-2 transition-transform duration-300'
                />
              </button>
              <Link
                href='/signup'
                className='group relative bg-white/80 backdrop-blur-xl border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-[0_10px_25px_rgba(16,185,129,0.15)] hover:border-[#10B981] hover:text-[#10B981]'>
                <div className='absolute inset-0 bg-gradient-to-r from-[#10B981]/10 to-[#34D399]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <span className='relative z-10'>{TEXT.hero.start[lang]}</span>
                <Zap
                  size={18}
                  className='relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300'
                />
              </Link>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.25}>
            <div className='flex items-center justify-center gap-8 text-sm text-gray-500'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-[#10B981] rounded-full'></div>
                <span>
                  {lang === "uz"
                    ? `${stats.users.toLocaleString()}+ foydalanuvchi`
                    : `${stats.users.toLocaleString()}+ users`}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-[#34D399] rounded-full'></div>
                <span>{lang === "uz" ? "AI yordamida" : "AI-powered"}</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-[#10B981] rounded-full'></div>
                <span>
                  {lang === "uz" ? "Bepul sinab ko'ring" : "Try for free"}
                </span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </motion.section>
      {/* Waitlist Form */}
      <section
        className='relative bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 py-24 px-6 overflow-hidden'
        id='waitlist-form'>
        {/* Background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-10 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl'></div>
        </div>

        <ScaleIn>
          <div className='relative z-10 max-w-4xl mx-auto'>
            <div className='bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center shadow-lg border border-white/20 relative overflow-hidden'>
              {/* Decorative elements */}
              <div className='absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-blue-100/50 rounded-full blur-2xl'></div>
              <div className='absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-2xl'></div>
              <FadeInUp delay={0.05}>
                <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
                  <Target size={16} className='text-emerald-600' />
                  <span>
                    {lang === "uz" ? "Birinchi bo'ling" : "Be the first"}
                  </span>
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
                <div className='mt-8 flex items-center justify-center gap-6 text-sm text-gray-500'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle size={16} className='text-[#10B981]' />
                    <span>{lang === "uz" ? "Bepul" : "Free"}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <ShieldCheck size={16} className='text-[#34D399]' />
                    <span>{lang === "uz" ? "Xavfsiz" : "Secure"}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Zap size={16} className='text-[#10B981]' />
                    <span>{lang === "uz" ? "Tezkor" : "Instant"}</span>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </ScaleIn>
      </section>
      {/* How It Works */}
      <section
        className='relative bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 py-24 px-6 overflow-hidden'
        id='how-it-works'>
        {/* Background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-20 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full blur-3xl'></div>
        </div>

        <div className='relative z-10 max-w-6xl mx-auto text-center'>
          <FadeInUp>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <Workflow size={16} className='text-emerald-600' />
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
                    <div className='absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300'>
                      {i + 1}
                    </div>

                    {/* Icon background */}
                    <div className='w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
                      {item.title[lang] === "Profil yarating" ||
                      item.title[lang] === "Create Your Smart Profile" ? (
                        <GraduationCap size={32} className='text-emerald-600' />
                      ) : item.title[lang] === "Amaliyot va isbot" ||
                        item.title[lang] === "Practice & Prove Your Skills" ? (
                        <Target size={32} className='text-emerald-600' />
                      ) : (
                        <Rocket size={32} className='text-emerald-600' />
                      )}
                    </div>

                    <h3 className='text-xl font-bold mb-4 text-gray-900'>
                      {item.title[lang]}
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      {item.desc[lang]}
                    </p>

                    {/* Arrow connector */}
                    {i < 2 && (
                      <div className='hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2'>
                        <ArrowRight size={24} className='text-emerald-300' />
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
      <section
        className='relative bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30 py-24 px-6 overflow-hidden'
        id='features'>
        {/* Background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl'></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto text-center'>
          <FadeInUp>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <Sparkles size={16} className='text-emerald-600' />
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
                  <div className='group bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-left border border-white/20 transition-all duration-300 relative overflow-hidden h-full'>
                    {/* Gradient overlay on hover */}
                    <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                    {/* Icon with enhanced styling */}
                    <div className='relative z-10 w-14 h-14 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                      {icon}
                    </div>

                    <div className='relative z-10'>
                      <h3 className='text-lg font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors'>
                        {title[lang]}
                      </h3>
                      <p className='text-gray-600 text-sm leading-relaxed'>
                        {desc[lang]}
                      </p>
                    </div>

                    {/* Hover indicator */}
                    <div className='absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300'></div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
      {/* Project's  */}
      <section
        id='projects'
        className='relative z-10 py-24 px-6 bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 overflow-hidden'>
        {/* Enhanced background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/5 to-emerald-200/5 rounded-full blur-2xl'></div>
        </div>

        <div className='relative z-10 max-w-6xl mx-auto text-center'>
          <FadeInUp>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <Briefcase size={16} className='text-emerald-600' />
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
                  <div className='group bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-left border border-white/20 transition-all duration-300 relative overflow-hidden h-full'>
                    {/* Gradient overlay */}
                    <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                    <div className='relative z-10 flex justify-between items-center'>
                      <div className='flex-1'>
                        <h3 className='text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors'>
                          {item.title[lang]}
                        </h3>
                        <p className='text-gray-600 leading-relaxed'>
                          {item.desc[lang]}
                        </p>
                      </div>
                      <div className='ml-6 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl flex items-center justify-center p-4'>
                        <Image
                          src={item.icon}
                          alt={item.title[lang]}
                          width={200}
                          height={200}
                        />
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
                  <div className='group bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-left border border-white/20 transition-all duration-300 relative overflow-hidden h-full'>
                    {/* Gradient overlay */}
                    <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                    <div className='relative z-10 flex flex-col justify-between h-full'>
                      <div className='flex-1'>
                        <h3 className='text-xl font-bold mb-3 text-gray-900 group-hover:text-emerald-700 transition-colors'>
                          {item.title[lang]}
                        </h3>
                        <p className='text-gray-600 leading-relaxed'>
                          {item.desc[lang]}
                        </p>
                      </div>
                      <div className='mt-6 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl flex items-center justify-center p-3'>
                        <Image
                          src={item.icon}
                          alt={item.title[lang]}
                          width={200}
                          height={200}
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
      <section
        id='community'
        className='relative py-32 bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30 text-gray-800 overflow-hidden'>
        {/* Simple background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl' />
        </div>

        {/* Main content */}
        <div className='relative z-10 max-w-7xl mx-auto px-6'>
          {/* Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <Users size={16} className='text-emerald-600' />
              <span>{TEXT.community.label[lang]}</span>
            </div>

            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
              {TEXT.community.title[lang]}
            </h2>

            <p className='text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto'>
              {TEXT.community.desc[lang]}
            </p>
          </div>

          {/* Community Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16'>
            <div className='group bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full'>
              <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-2'>
                  {stats.users.toLocaleString()}+
                </div>
                <div className='text-sm text-gray-600'>
                  {lang === "uz" ? "A'zolar" : "Members"}
                </div>
              </div>
            </div>
            <div className='group bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full'>
              <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2'>
                  {stats.jobs.toLocaleString()}+
                </div>
                <div className='text-sm text-gray-600'>
                  {lang === "uz" ? "Ishlar" : "Jobs"}
                </div>
              </div>
            </div>
            <div className='group bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full'>
              <div className='absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-2'>
                  {stats.companies.toLocaleString()}+
                </div>
                <div className='text-sm text-gray-600'>
                  {lang === "uz" ? "Kompaniyalar" : "Companies"}
                </div>
              </div>
            </div>
            <div className='group bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full'>
              <div className='absolute inset-0 bg-gradient-to-br from-pink-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='relative z-10'>
                <div className='text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent mb-2'>
                  {stats.countries.toLocaleString()}+
                </div>
                <div className='text-sm text-gray-600'>
                  {lang === "uz" ? "Mamlakatlar" : "Countries"}
                </div>
              </div>
            </div>
          </div>

          {/* Community Features */}
          <div className='grid md:grid-cols-2 gap-8 mb-16'>
            <div className='bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg relative overflow-hidden'>
              <div className='absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-blue-100/50 rounded-full blur-2xl'></div>
              <div className='relative z-10'>
                <h3 className='text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2'>
                  <Sparkles size={20} className='text-emerald-600' />
                  {lang === "uz"
                    ? "Jamiyat Xususiyatlari"
                    : "Community Features"}
                </h3>
                <div className='space-y-6'>
                  {TEXT.community.features.map((feature, index) => (
                    <div
                      key={index}
                      className='group flex items-start gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-blue-50/50 transition-all duration-300'>
                      <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                        <feature.icon size={24} className='text-emerald-600' />
                      </div>
                      <div>
                        <h4 className='font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors'>
                          {feature.title[lang]}
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {feature.desc[lang]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-lg relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-2xl'></div>
              <div className='relative z-10'>
                <h3 className='text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2'>
                  <MessageCircle size={20} className='text-emerald-600' />
                  {lang === "uz" ? "So'nggi Munozaralar" : "Recent Discussions"}
                </h3>
                <div className='space-y-4'>
                  {TEXT.community.recentDiscussions.map((discussion, index) => (
                    <div
                      key={index}
                      className='group p-4 bg-gray-50/50 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-blue-50/50 transition-all duration-300 cursor-pointer relative overflow-hidden'>
                      <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div className='relative z-10'>
                        <div className='flex items-start justify-between mb-2'>
                          <h4 className='font-medium text-gray-900 text-sm group-hover:text-emerald-600 transition-colors'>
                            {discussion.title[lang]}
                          </h4>
                          <span className='text-xs bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200/50'>
                            {discussion.category}
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-xs text-gray-500'>
                          <span className='font-medium'>
                            {discussion.author}
                          </span>
                          <div className='flex items-center gap-4'>
                            <span className='flex items-center gap-1'>
                              <MessageCircle size={12} />
                              {discussion.replies}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Eye size={12} />
                              {discussion.views}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href='/community'
                  className='group w-full mt-6 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)] inline-flex items-center justify-center hover:from-[#34D399] hover:to-[#10B981]'>
                  <span>
                    {lang === "uz"
                      ? "Barcha munozaralarni ko'rish"
                      : "View All Discussions"}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className='bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-3xl p-8 text-center text-white relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 hover:opacity-100 transition-opacity duration-300'></div>
            <div className='absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl'></div>
            <div className='absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl'></div>
            <div className='relative z-10'>
              <h3 className='text-2xl font-bold mb-4'>
                {lang === "uz" ? "Jamiyatga qo'shiling" : "Join Our Community"}
              </h3>
              <p className='text-emerald-100 mb-6 max-w-2xl mx-auto'>
                {lang === "uz"
                  ? "Boshqa dasturchilar bilan bog'laning, bilim almashing va martabangizni rivojlantiring"
                  : "Connect with other developers, share knowledge, and grow your career"}
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link
                  href='/community'
                  className='group bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 hover:shadow-lg inline-flex'>
                  <span>{TEXT.community.button[lang]}</span>
                  <ArrowRight
                    size={20}
                    className='group-hover:translate-x-1 transition-transform duration-300'
                  />
                </Link>
                <Link
                  href='/community'
                  className='border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:shadow-lg inline-flex'>
                  {lang === "uz" ? "Forumga kirish" : "Enter Forum"}
                </Link>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className='flex gap-6 mt-12 justify-center'>
            <a
              href='https://github.com/fraijob'
              target='_blank'
              rel='noopener noreferrer'
              className='group relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
              <div className='absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
              <Github
                size={28}
                className='relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform'
              />
            </a>
            <a
              href='https://twitter.com/fraijob'
              target='_blank'
              rel='noopener noreferrer'
              className='group relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
              <div className='absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
              <Twitter
                size={28}
                className='relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform'
              />
            </a>
            <a
              href='mailto:hello@fraijob.com'
              className='group relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
              <div className='absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
              <Mail
                size={28}
                className='relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform'
              />
            </a>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section
        id='pricing'
        className='relative w-full py-32 px-6 bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/30 text-gray-800 overflow-hidden'>
        {/* Simple background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-10 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl'></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
              <DollarSign size={16} className='text-emerald-600' />
              <span>{TEXT.pricing.label[lang]}</span>
            </div>

            <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900'>
              {TEXT.pricing.title[lang]}
            </h2>

            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              {TEXT.pricing.desc[lang]}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {TEXT.pricing.plans.map((plan, index) => (
              <div
                key={index}
                className={`relative group ${plan.popular ? "lg:scale-105 lg:-mt-4 lg:mb-4" : ""}`}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 z-20'>
                    <div className='bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg'>
                      {lang === "uz" ? "Eng mashhur" : "Most Popular"}
                    </div>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`relative h-full bg-white/80 backdrop-blur-xl rounded-3xl border-2 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl ${
                    plan.popular
                      ? "border-emerald-200 shadow-emerald-100/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  {/* Background decoration */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-5 rounded-full blur-2xl`}></div>

                  <div className='relative z-10 p-8'>
                    {/* Plan Header */}
                    <div className='text-center mb-8'>
                      <h3
                        className={`text-2xl font-bold mb-2 ${plan.popular ? "text-emerald-600" : "text-gray-900"}`}>
                        {plan.name[lang]}
                      </h3>
                      <p className='text-gray-600 mb-6'>{plan.desc[lang]}</p>

                      {/* Price */}
                      <div className='mb-6'>
                        <div className='flex items-baseline justify-center gap-1'>
                          <span className='text-4xl font-bold text-gray-900'>
                            {plan.price[lang]}
                          </span>
                          <span className='text-lg text-gray-600'>
                            {plan.currency[lang]}
                          </span>
                        </div>
                        <p className='text-gray-500 text-sm'>
                          {plan.period[lang]}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className='space-y-4 mb-8'>
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className='flex items-center gap-3 text-gray-700'>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              plan.popular
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                            <Check size={12} className='font-bold' />
                          </div>
                          <span className='text-sm'>{feature[lang]}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)]"
                          : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
                      }`}
                      onClick={() =>
                        alert(
                          lang === "uz"
                            ? "Tez orada qo'shiladi!"
                            : "Coming soon!"
                        )
                      }>
                      {TEXT.pricing.button[lang]}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className='text-center'>
            <p className='text-gray-500 text-sm max-w-2xl mx-auto'>
              {TEXT.pricing.note[lang]}
            </p>
          </div>
        </div>
      </section>

      {/* jobs */}
      <section
        id='jobs'
        className='relative w-full py-24 px-6 bg-gradient-to-br from-white via-gray-50/50 to-emerald-50/30 text-gray-800 overflow-hidden'>
        {/* Simple background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-10 left-1/4 w-80 h-80 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl'></div>
        </div>

        <div className='relative z-10 max-w-5xl mx-auto text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-emerald-200/50'>
            <Briefcase size={16} className='text-emerald-600' />
            <span>{TEXT.jobs.title[lang]}</span>
          </div>

          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900'>
            {lang === "uz"
              ? "Ishingizni ishonch bilan toping."
              : "Land your next job with confidence."}
          </h2>

          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {lang === "uz"
              ? "Freelance, stajirovka va to'liq stavkali ishlarni o'rganing — barchasi sizning ko'nikma va maqsadlaringizga mos."
              : "Explore freelance gigs, internships, and full-time roles from verified companies — all tailored to your skills and goals."}
          </p>
        </div>

        <div className='max-w-3xl mx-auto space-y-4'>
          {jobsData.map((job, index) => {
            const Icon = job.icon;
            const isOpen = openIndex === index;
            return (
              <div key={index} className='group'>
                <div
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
                    isOpen
                      ? "bg-white/90 backdrop-blur-xl border-[#10B981] shadow-lg"
                      : "bg-white/80 backdrop-blur-xl border-gray-200 hover:border-[#10B981]/50"
                  }`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className='w-full flex justify-between items-center p-6 text-left focus:outline-none group-hover:bg-gradient-to-r group-hover:from-emerald-50/50 group-hover:to-blue-50/50 transition-all duration-300'>
                    <div className='flex items-center gap-4'>
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? "bg-gradient-to-br from-[#10B981] to-[#34D399] text-white shadow-lg"
                            : "bg-gray-100 text-gray-500 group-hover:bg-gradient-to-br group-hover:from-[#10B981]/20 group-hover:to-[#34D399]/20 group-hover:text-[#10B981]"
                        }`}>
                        <Icon className='w-6 h-6' />
                      </div>
                      <div className='text-left'>
                        <span className='text-lg font-semibold text-gray-900 group-hover:text-[#10B981] transition-colors'>
                          {job.title[lang]}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "bg-[#10B981] text-white shadow-lg"
                          : "bg-gray-100 text-gray-400 group-hover:bg-[#10B981] group-hover:text-white"
                      }`}>
                      {isOpen ? (
                        <ChevronUp className='w-5 h-5' />
                      ) : (
                        <ChevronDown className='w-5 h-5' />
                      )}
                    </div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className='overflow-hidden'>
                    <div className='px-6 pb-6 text-sm text-gray-700 leading-relaxed bg-gradient-to-br from-emerald-50/30 to-blue-50/30 border-t border-emerald-100/50'>
                      <div className='pt-4'>
                        <div className='flex items-start gap-3'>
                          <div className='w-2 h-2 bg-[#10B981] rounded-full mt-2 flex-shrink-0'></div>
                          <p>{job.description[lang]}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* testimonials */}
      <section
        id='testimonials'
        className='relative w-full py-32 px-6 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 text-gray-800 overflow-hidden'>
        {/* Simple background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-10 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl'></div>
          <div className='absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl'></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-purple-200/50'>
              <Star size={16} className='text-purple-600' />
              <span>{TEXT.testimonials.label[lang]}</span>
            </div>

            <h2 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900'>
              {TEXT.testimonials.title[lang]}
            </h2>

            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              {TEXT.testimonials.desc[lang]}
            </p>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16'>
            <div className='text-center'>
              <div className='bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg h-full'>
                <div className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                  {stats.users.toLocaleString()}+
                </div>
                <div className='text-sm text-gray-600 font-medium'>
                  {lang === "uz" ? "Foydalanuvchi" : "Users"}
                </div>
              </div>
            </div>
            <div className='text-center'>
              <div className='bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg h-full'>
                <div className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                  {stats.successRate}%
                </div>
                <div className='text-sm text-gray-600 font-medium'>
                  {lang === "uz" ? "Muvaffaqiyat" : "Success Rate"}
                </div>
              </div>
            </div>
            <div className='text-center'>
              <div className='bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg h-full'>
                <div className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                  {stats.companies.toLocaleString()}+
                </div>
                <div className='text-sm text-gray-600 font-medium'>
                  {lang === "uz" ? "Kompaniya" : "Companies"}
                </div>
              </div>
            </div>
            <div className='text-center'>
              <div className='bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg h-full'>
                <div className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                  {stats.countries.toLocaleString()}+
                </div>
                <div className='text-sm text-gray-600 font-medium'>
                  {lang === "uz" ? "Mamlakat" : "Countries"}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {TEXT.testimonials.reviews.map((review, index) => (
              <div key={index} className='group relative'>
                {/* Card */}
                <div className='relative h-full bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden'>
                  {/* Background decoration */}
                  <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-2xl'></div>

                  <div className='relative z-10 p-8'>
                    {/* Rating */}
                    <div className='flex gap-1 mb-4'>
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className='text-yellow-400 fill-current'
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <blockquote className='text-gray-700 mb-6 leading-relaxed italic'>
                      &ldquo;{review.text[lang]}&rdquo;
                    </blockquote>

                    {/* Highlight */}
                    <div className='inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium mb-6'>
                      <TrendingUp size={12} className='text-emerald-600' />
                      {review.highlight[lang]}
                    </div>

                    {/* Author */}
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-2xl'>
                        {review.avatar}
                      </div>
                      <div>
                        <div className='font-semibold text-gray-900'>
                          {review.name}
                        </div>
                        <div className='text-sm text-gray-600'>
                          {review.role[lang]}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {review.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* footer*/}
      <footer className='relative bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30 border-t border-white/20 mt-24 py-20 px-6 overflow-hidden'>
        {/* Enhanced background decorations */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl animate-float-slow'></div>
          <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse-slow'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-200/5 to-emerald-200/5 rounded-full blur-2xl animate-float-slow'></div>
          <div className='absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full blur-xl animate-pulse-slow'></div>
          <div className='absolute bottom-10 left-10 w-12 h-12 bg-gradient-to-br from-pink-300/20 to-red-300/20 rounded-full blur-lg animate-float-slow'></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto'>
          {/* Main footer content */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
            {/* Company Info */}
            <FadeInLeft delay={0.2}>
              <div className='lg:col-span-2'>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className='flex items-center gap-3 mb-6'>
                  <div className='w-18 h-10 relative'>
                    <Image
                      src='/logo.svg'
                      alt='FraiJob logo'
                      fill
                      className='object-contain'
                    />
                  </div>
                </motion.div>
                <p className='text-gray-600 mb-8 max-w-md leading-relaxed text-lg'>
                  {lang === "uz"
                    ? "AI yordamida ishga tayyor bo'ling va haqiqiy ko'nikmalar orqali yangi imkoniyatlarni oching."
                    : "Get job-ready with AI assistance and unlock new opportunities through real skills."}
                </p>
                <div className='flex gap-4'>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    href='https://github.com/fraijob'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group relative w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
                    <div className='absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
                    <Github
                      size={22}
                      className='relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform'
                    />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    href='https://twitter.com/fraijob'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group relative w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
                    <div className='absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
                    <Twitter
                      size={22}
                      className='relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform'
                    />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    href='mailto:hello@fraijob.com'
                    className='group relative w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-[#10B981] hover:to-[#34D399] rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]'>
                    <div className='absolute inset-0 bg-gradient-to-br from-[#10B981] to-[#34D399] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl'></div>
                    <Mail
                      size={22}
                      className='relative z-10 text-gray-600 group-hover:text-white transition-colors group-hover:scale-110 transition-transform'
                    />
                  </motion.a>
                </div>
              </div>
            </FadeInLeft>

            {/* Quick Links */}
            <FadeInUp delay={0.4}>
              <div className='bg-white/50 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg relative overflow-hidden h-full'>
                <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 rounded-full blur-xl'></div>
                <div className='relative z-10'>
                  <h4 className='font-semibold text-gray-900 mb-6 text-lg flex items-center gap-2'>
                    <ArrowRight size={18} className='text-emerald-600' />
                    {lang === "uz" ? "Tezkor havolalar" : "Quick Links"}
                  </h4>
                  <ul className='space-y-4'>
                    {FOOTER_LINKS.slice(0, 3).map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ x: 5 }}>
                        <a
                          href={`#${item.id}`}
                          className='text-gray-600 hover:text-emerald-600 transition-all duration-300 flex items-center gap-3 group font-medium'>
                          <div className='w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                          {item[lang]}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeInUp>

            {/* Contact Info */}
            <FadeInRight delay={0.6}>
              <div className='bg-white/50 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg relative overflow-hidden h-full'>
                <div className='absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-xl'></div>
                <div className='relative z-10'>
                  <h4 className='font-semibold text-gray-900 mb-6 text-lg flex items-center gap-2'>
                    <MessageCircle size={18} className='text-emerald-600' />
                    {lang === "uz" ? "Aloqa" : "Contact"}
                  </h4>
                  <ul className='space-y-4'>
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ x: -5 }}
                      className='flex items-center gap-4 text-gray-600 group'>
                      <div className='w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                        <Mail size={18} className='text-emerald-600' />
                      </div>
                      <span className='text-sm font-medium group-hover:text-emerald-600 transition-colors'>
                        hello@fraijob.com
                      </span>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ x: -5 }}
                      className='flex items-center gap-4 text-gray-600 group'>
                      <div className='w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                        <MessageCircle size={18} className='text-emerald-600' />
                      </div>
                      <span className='text-sm font-medium group-hover:text-emerald-600 transition-colors'>
                        {lang === "uz"
                          ? "24/7 qo'llab-quvvatlash"
                          : "24/7 Support"}
                      </span>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ x: -5 }}
                      className='flex items-center gap-4 text-gray-600 group'>
                      <div className='w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                        <MessageCircle size={18} className='text-emerald-600' />
                      </div>
                      <a
                        href='https://t.me/fraijob_support'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm font-medium group-hover:text-emerald-600 transition-colors'>
                        @fraijob_support
                      </a>
                    </motion.li>
                  </ul>
                </div>
              </div>
            </FadeInRight>
          </div>

          {/* Bottom section */}
          <FadeInUp delay={0.8}>
            <div className='pt-8 border-t border-white/20'>
              <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className='text-gray-500 text-sm'>
                  © {new Date().getFullYear()} FraiJob.{" "}
                  {lang === "uz"
                    ? "Barcha huquqlar himoyalangan."
                    : "All rights reserved."}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className='flex gap-6 text-sm'>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href='#'
                    className='text-gray-500 hover:text-emerald-600 transition-colors font-medium'>
                    {lang === "uz" ? "Maxfiylik siyosati" : "Privacy Policy"}
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href='#'
                    className='text-gray-500 hover:text-emerald-600 transition-colors font-medium'>
                    {lang === "uz"
                      ? "Foydalanish shartlari"
                      : "Terms of Service"}
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </footer>
    </main>
  );
}
