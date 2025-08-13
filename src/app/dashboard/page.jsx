"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import chatManager from "@/lib/socket";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  MessagesSquare,
  Settings,
  LogOut,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  Edit,
  Trash2,
  Reply,
  Bell,
  Search,
  TrendingUp,
  Users,
  Eye,
  Award,
  X,
  Clock,
  GraduationCap,
  Menu,
  Home,
  Send,
} from "lucide-react";
import Image from "next/image";

// Animation components
const FadeInUp = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const ScaleIn = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const LANGS = [
  { value: "en", label: "English" },
  { value: "uz", label: "O'zbekcha" },
];

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Portfolio", icon: FolderOpen },
  { label: "Jobs", icon: Briefcase },
  { label: "Freelance", icon: Users },
  { label: "Frai AI", icon: Bot },
  { label: "Test", icon: FileText },
  { label: "Chats", icon: MessagesSquare },
  { label: "Settings", icon: Settings },
  { label: "Admin Panel", icon: Users, adminOnly: true },
];

// Career Assessment Test System
const CAREER_CATEGORIES = {
  technical: {
    name: "Texnik sohalar",
    careers: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "Mobile Developer",
      "Game Developer",
      "AR/VR Developer",
      "AI/ML Engineer",
      "Data Scientist",
      "Data Analyst",
      "Data Engineer",
      "Cybersecurity Specialist",
      "DevOps Engineer",
      "QA Engineer",
      "System Administrator",
      "Embedded/IoT Developer",
    ],
  },
  design: {
    name: "Dizayn va kreativ",
    careers: [
      "UX/UI Designer",
      "Graphic Designer",
      "Motion Designer",
      "3D Artist",
      "Animator",
      "Illustrator",
    ],
  },
  business: {
    name: "Biznes va boshqaruv",
    careers: [
      "Product Manager",
      "Project Manager",
      "Team Lead",
      "Business Analyst",
      "Scrum Master",
    ],
  },
  content: {
    name: "Kontent va hamjamiyat",
    careers: [
      "Content Creator",
      "Copywriter",
      "Technical Writer",
      "Community Manager",
      "DevRel",
    ],
  },
  marketing: {
    name: "Marketing va mijoz bilan ish",
    careers: [
      "Digital Marketing Specialist",
      "SEO/SEM Specialist",
      "SMM Specialist",
      "CRM Specialist",
      "Customer Support Specialist",
      "IT Recruiter",
    ],
  },
};

// Career Assessment Questions
const CAREER_ASSESSMENT_QUESTIONS = [
  // PSIXOTIP BLOK (10 questions)
  {
    id: 1,
    category: "personality",
    question: "Dam olish kuni bo'lsa, nimani xohlaysan?",
    options: [
      {
        text: "Uyda qolib, kompyuter bilan ishlash",
        careers: ["Frontend Developer", "Backend Developer", "Game Developer"],
      },
      {
        text: "Do'stlar bilan chiroyli joylarda surat tushirish",
        careers: ["UX/UI Designer", "Graphic Designer", "Content Creator"],
      },
      {
        text: "Yangi joylarni kashf qilish va sayohat qilish",
        careers: ["Product Manager", "Project Manager", "Business Analyst"],
      },
      {
        text: "Jamiyat bilan bog'lanish va yangi odamlar bilan tanishish",
        careers: ["Community Manager", "DevRel", "IT Recruiter"],
      },
    ],
  },
  {
    id: 2,
    category: "personality",
    question: "Do'stlar bilan safar, sen qayerda qulay?",
    options: [
      {
        text: "Texnik masalalar bo'yicha maslahat berish",
        careers: [
          "System Administrator",
          "DevOps Engineer",
          "Cybersecurity Specialist",
        ],
      },
      {
        text: "Safar rejasini tuzish va tashkil qilish",
        careers: ["Project Manager", "Product Manager", "Team Lead"],
      },
      {
        text: "Chiroyli joylarni topish va surat tushirish",
        careers: ["Graphic Designer", "Motion Designer", "Content Creator"],
      },
      {
        text: "Harakatli o'yinlar va qiziqarli faoliyatlar",
        careers: ["Game Developer", "AR/VR Developer", "Mobile Developer"],
      },
    ],
  },
  {
    id: 3,
    category: "personality",
    question: "Tug'ilgan kun sovg'asi tayyorlashda roling?",
    options: [
      {
        text: "Sovg'ani tanlash va sotib olish",
        careers: [
          "Business Analyst",
          "Product Manager",
          "Digital Marketing Specialist",
        ],
      },
      {
        text: "Sovg'ani chiroyli o'rab, dizayn qilish",
        careers: ["Graphic Designer", "UX/UI Designer", "Illustrator"],
      },
      {
        text: "Sovg'ani yashirincha saqlash va kutilmagan taassurot qoldirish",
        careers: ["Game Developer", "AR/VR Developer", "Content Creator"],
      },
      {
        text: "Sovg'ani texnik jihatdan ishlab chiqish",
        careers: ["Embedded/IoT Developer", "AI/ML Engineer", "Data Engineer"],
      },
    ],
  },
  {
    id: 4,
    category: "personality",
    question: "Katta tadbirda qaysi ishni olasan?",
    options: [
      {
        text: "Tadbirni texnik jihatdan ta'minlash",
        careers: [
          "System Administrator",
          "DevOps Engineer",
          "Backend Developer",
        ],
      },
      {
        text: "Tadbirni tashkil qilish va boshqarish",
        careers: ["Project Manager", "Event Manager", "Team Lead"],
      },
      {
        text: "Tadbir uchun materiallar tayyorlash",
        careers: ["Graphic Designer", "Content Creator", "Copywriter"],
      },
      {
        text: "Mehmonlar bilan bog'lanish va ularni kutib olish",
        careers: [
          "Community Manager",
          "Customer Support Specialist",
          "IT Recruiter",
        ],
      },
    ],
  },
  {
    id: 5,
    category: "personality",
    question: "Biror ishda xatolik chiqsa, nima qilasan?",
    options: [
      {
        text: "Xatolikni tahlil qilib, texnik yechim topish",
        careers: ["QA Engineer", "Data Analyst", "Cybersecurity Specialist"],
      },
      {
        text: "Muammoni hal qilish uchun jamoa bilan ishlash",
        careers: ["Team Lead", "Scrum Master", "Project Manager"],
      },
      {
        text: "Xatolikni yashirish va yaxshiroq natija ko'rsatish",
        careers: ["Marketing Specialist", "Content Creator", "DevRel"],
      },
      {
        text: "Xatolikni tuzatish va kelajakda oldini olish",
        careers: [
          "DevOps Engineer",
          "System Administrator",
          "Fullstack Developer",
        ],
      },
    ],
  },
  {
    id: 6,
    category: "personality",
    question: "Yangi narsani o'rganganingda qanday yo'l tanlaysan?",
    options: [
      {
        text: "Amaliy mashg'ulotlar va kod yozish",
        careers: [
          "Frontend Developer",
          "Backend Developer",
          "Mobile Developer",
        ],
      },
      {
        text: "Vizual materiallar va dizayn namunalari",
        careers: ["UX/UI Designer", "Graphic Designer", "3D Artist"],
      },
      {
        text: "Tahlil va ma'lumotlarni o'rganish",
        careers: ["Data Scientist", "Data Analyst", "Business Analyst"],
      },
      {
        text: "Boshqalar bilan muloqot va tajriba almashish",
        careers: ["Community Manager", "DevRel", "Technical Writer"],
      },
    ],
  },
  {
    id: 7,
    category: "personality",
    question: "Qiyin vaziyatda birinchi o'ylaganing?",
    options: [
      {
        text: "Muammoni texnik jihatdan hal qilish",
        careers: [
          "System Administrator",
          "DevOps Engineer",
          "Cybersecurity Specialist",
        ],
      },
      {
        text: "Jamoa bilan maslahatlashish va yordam so'rash",
        careers: ["Team Lead", "Scrum Master", "Project Manager"],
      },
      {
        text: "Muammoni tahlil qilib, ma'lumotlar asosida hal qilish",
        careers: ["Data Scientist", "Business Analyst", "Product Manager"],
      },
      {
        text: "Muammoni ijodiy yo'l bilan hal qilish",
        careers: ["UX/UI Designer", "Content Creator", "Game Developer"],
      },
    ],
  },
  {
    id: 8,
    category: "personality",
    question: "Qanday vazifa senga eng yoqadi?",
    options: [
      {
        text: "Murakkab texnik muammolarni hal qilish",
        careers: ["AI/ML Engineer", "Data Engineer", "Embedded/IoT Developer"],
      },
      {
        text: "Jamoa bilan ishlash va loyihalarni boshqarish",
        careers: ["Project Manager", "Team Lead", "Scrum Master"],
      },
      {
        text: "Ijodiy ishlar va dizayn qilish",
        careers: ["Graphic Designer", "Motion Designer", "Illustrator"],
      },
      {
        text: "Odamlar bilan ishlash va ularga yordam berish",
        careers: [
          "Customer Support Specialist",
          "IT Recruiter",
          "Community Manager",
        ],
      },
    ],
  },
  {
    id: 9,
    category: "personality",
    question: "Qaysi ishni ertalab birinchi qilasan?",
    options: [
      {
        text: "Kod yozish va texnik masalalar ustida ishlash",
        careers: ["Fullstack Developer", "Mobile Developer", "Game Developer"],
      },
      {
        text: "Kunlik rejani ko'rib chiqish va vazifalarni taqsimlash",
        careers: ["Product Manager", "Project Manager", "Business Analyst"],
      },
      {
        text: "Ijodiy ishlar va dizayn ustida ishlash",
        careers: ["UX/UI Designer", "Graphic Designer", "3D Artist"],
      },
      {
        text: "Jamiyat bilan bog'lanish va yangi ma'lumotlarni o'rganish",
        careers: ["Content Creator", "DevRel", "Technical Writer"],
      },
    ],
  },
  {
    id: 10,
    category: "personality",
    question: "Ishlashda senga muhim narsa nima?",
    options: [
      {
        text: "Texnik jihatdan mukammallik va aniq natijalar",
        careers: ["QA Engineer", "Data Analyst", "System Administrator"],
      },
      {
        text: "Jamoa bilan ishlash va hamkorlik",
        careers: ["Team Lead", "Scrum Master", "Community Manager"],
      },
      {
        text: "Ijodiy erkinlik va yangi g'oyalar",
        careers: ["UX/UI Designer", "Content Creator", "Game Developer"],
      },
      {
        text: "Odamlar bilan ishlash va ularga foyda keltirish",
        careers: ["Customer Support Specialist", "IT Recruiter", "DevRel"],
      },
    ],
  },
  // MOTIVATSIYA BLOK (10 questions)
  {
    id: 11,
    category: "motivation",
    question: "Ishni nega qilasan? Pul, shon-shuhrat, qiziqish?",
    options: [
      {
        text: "Texnik qobiliyatlarni rivojlantirish va yangi texnologiyalarni o'rganish",
        careers: ["AI/ML Engineer", "Data Scientist", "AR/VR Developer"],
      },
      {
        text: "Jamoa bilan ishlash va loyihalarni muvaffaqiyatli bajarish",
        careers: ["Project Manager", "Team Lead", "Scrum Master"],
      },
      {
        text: "Ijodiy erkinlik va o'z g'oyalarini amalga oshirish",
        careers: ["Graphic Designer", "Content Creator", "Game Developer"],
      },
      {
        text: "Odamlarga yordam berish va jamiyatga foyda keltirish",
        careers: [
          "Customer Support Specialist",
          "Community Manager",
          "IT Recruiter",
        ],
      },
    ],
  },
  {
    id: 12,
    category: "motivation",
    question: "Kimni ishini ko'rib havas qilasan?",
    options: [
      {
        text: "Mashhur texnologiya kompaniyalarida ishlaydigan dasturchilar",
        careers: [
          "Frontend Developer",
          "Backend Developer",
          "Fullstack Developer",
        ],
      },
      {
        text: "Mashhur dizayn studiyalarida ishlaydigan dizaynchilar",
        careers: ["UX/UI Designer", "Graphic Designer", "Motion Designer"],
      },
      {
        text: "Katta kompaniyalarda boshqaruv lavozimlarida ishlaydigan odamlar",
        careers: ["Product Manager", "Project Manager", "Team Lead"],
      },
      {
        text: "Ijtimoiy tarmoqlarda mashhur bo'lgan kontent yaratuvchilar",
        careers: ["Content Creator", "DevRel", "Community Manager"],
      },
    ],
  },
  {
    id: 13,
    category: "motivation",
    question: "Biror narsani do'stlarga ko'rsatganda nimaga qaraysan?",
    options: [
      {
        text: "Texnik jihatdan qanday ishlashini tushuntirish",
        careers: ["System Administrator", "DevOps Engineer", "Data Engineer"],
      },
      {
        text: "Dizayn va ko'rinishiga qarash",
        careers: ["UX/UI Designer", "Graphic Designer", "Illustrator"],
      },
      {
        text: "Foydalanish qulayligi va funksionalligiga qarash",
        careers: ["Product Manager", "Business Analyst", "QA Engineer"],
      },
      {
        text: "Odamlar reaksiyasiga va ularning fikriga qarash",
        careers: [
          "Community Manager",
          "Customer Support Specialist",
          "Marketing Specialist",
        ],
      },
    ],
  },
  {
    id: 14,
    category: "motivation",
    question: "Ishning qaysi natijasi sen uchun zavq?",
    options: [
      {
        text: "Murakkab texnik muammolarni hal qilish",
        careers: [
          "AI/ML Engineer",
          "Cybersecurity Specialist",
          "Embedded/IoT Developer",
        ],
      },
      {
        text: "Jamoa bilan birgalikda muvaffaqiyatli natijaga erishish",
        careers: ["Team Lead", "Scrum Master", "Project Manager"],
      },
      {
        text: "Ijodiy ishlar va chiroyli natijalar yaratish",
        careers: ["Graphic Designer", "Motion Designer", "3D Artist"],
      },
      {
        text: "Odamlarga yordam berish va ularning hayotini yaxshilash",
        careers: [
          "Customer Support Specialist",
          "Community Manager",
          "IT Recruiter",
        ],
      },
    ],
  },
  {
    id: 15,
    category: "motivation",
    question: "Hammaning oldida gapirishni xohlaysanmi?",
    options: [
      {
        text: "Texnik masalalar bo'yicha ma'ruza qilish",
        careers: ["DevRel", "Technical Writer", "System Administrator"],
      },
      {
        text: "Loyiha natijalarini taqdim etish",
        careers: ["Project Manager", "Product Manager", "Business Analyst"],
      },
      {
        text: "Ijodiy ishlarni ko'rsatish va tushuntirish",
        careers: ["Content Creator", "Graphic Designer", "Motion Designer"],
      },
      {
        text: "Jamiyat bilan bog'lanish va ularga ma'lumot berish",
        careers: ["Community Manager", "Marketing Specialist", "DevRel"],
      },
    ],
  },
  {
    id: 16,
    category: "motivation",
    question: "O'z ustingdan ko'proq nimaga vaqt ajratasan?",
    options: [
      {
        text: "Yangi texnologiyalarni o'rganish va kod yozish",
        careers: ["Fullstack Developer", "Mobile Developer", "Game Developer"],
      },
      {
        text: "Dizayn va ijodiy ishlar ustida ishlash",
        careers: ["UX/UI Designer", "Graphic Designer", "Illustrator"],
      },
      {
        text: "Ma'lumotlarni tahlil qilish va hisobotlar tayyorlash",
        careers: ["Data Scientist", "Data Analyst", "Business Analyst"],
      },
      {
        text: "Jamiyat bilan bog'lanish va kontent yaratish",
        careers: ["Content Creator", "Community Manager", "DevRel"],
      },
    ],
  },
  {
    id: 17,
    category: "motivation",
    question: "Internetda nimani ko'p o'qiysan?",
    options: [
      {
        text: "Texnik maqolalar va dasturlash bo'yicha yangiliklar",
        careers: ["Backend Developer", "AI/ML Engineer", "Data Engineer"],
      },
      {
        text: "Dizayn va ijodiy ishlar bo'yicha maqolalar",
        careers: ["Graphic Designer", "Motion Designer", "3D Artist"],
      },
      {
        text: "Biznes va boshqaruv bo'yicha maqolalar",
        careers: ["Product Manager", "Business Analyst", "Project Manager"],
      },
      {
        text: "Ijtimoiy tarmoqlar va marketing bo'yicha maqolalar",
        careers: ["Marketing Specialist", "Content Creator", "SMM Specialist"],
      },
    ],
  },
  {
    id: 18,
    category: "motivation",
    question: "Senga nima tez yetishmaydi?",
    options: [
      {
        text: "Yangi texnologiyalar va dasturlash tillari",
        careers: ["Frontend Developer", "Mobile Developer", "AR/VR Developer"],
      },
      {
        text: "Dizayn va ijodiy ishlar bo'yicha yangi g'oyalar",
        careers: ["UX/UI Designer", "Graphic Designer", "Illustrator"],
      },
      {
        text: "Biznes va boshqaruv bo'yicha yangi metodlar",
        careers: ["Product Manager", "Project Manager", "Scrum Master"],
      },
      {
        text: "Jamiyat bilan bog'lanish va marketing bo'yicha yangi usullar",
        careers: ["Community Manager", "Marketing Specialist", "DevRel"],
      },
    ],
  },
  {
    id: 19,
    category: "motivation",
    question: "Kim bilan ishlash qulay: do'stlar, tanishlar, begona?",
    options: [
      {
        text: "Kichik jamoa bilan ishlash va hamkorlik qilish",
        careers: ["Team Lead", "Scrum Master", "Project Manager"],
      },
      {
        text: "Mustaqil ishlash va o'z vazifalarini bajarish",
        careers: ["Data Scientist", "AI/ML Engineer", "Graphic Designer"],
      },
      {
        text: "Katta jamoa bilan ishlash va ko'p odamlar bilan bog'lanish",
        careers: ["Community Manager", "IT Recruiter", "Marketing Specialist"],
      },
      {
        text: "Har xil odamlar bilan ishlash va ularga yordam berish",
        careers: ["Customer Support Specialist", "DevRel", "Technical Writer"],
      },
    ],
  },
  {
    id: 20,
    category: "motivation",
    question: "Mas'uliyatni bo'yningga olishni yoqtirasanmi?",
    options: [
      {
        text: "Texnik masalalar bo'yicha mas'uliyat",
        careers: [
          "System Administrator",
          "DevOps Engineer",
          "Cybersecurity Specialist",
        ],
      },
      {
        text: "Loyiha va jamoa boshqaruvi bo'yicha mas'uliyat",
        careers: ["Project Manager", "Team Lead", "Product Manager"],
      },
      {
        text: "Ijodiy ishlar va dizayn bo'yicha mas'uliyat",
        careers: ["UX/UI Designer", "Graphic Designer", "Creative Director"],
      },
      {
        text: "Jamiyat va mijozlar bilan ishlash bo'yicha mas'uliyat",
        careers: ["Community Manager", "Customer Support Specialist", "DevRel"],
      },
    ],
  },
  // QIZIQISH BLOK (10 questions)
  {
    id: 21,
    category: "interest",
    question: "Do'stlaring senga qaysi masalada murojaat qiladi?",
    options: [
      {
        text: "Kompyuter va texnik muammolar bo'yicha",
        careers: ["System Administrator", "DevOps Engineer", "IT Support"],
      },
      {
        text: "Dizayn va ko'rinish bo'yicha",
        careers: ["Graphic Designer", "UX/UI Designer", "Illustrator"],
      },
      {
        text: "Biznes va rejalar bo'yicha",
        careers: ["Business Analyst", "Product Manager", "Project Manager"],
      },
      {
        text: "Ijtimoiy tarmoqlar va kontent bo'yicha",
        careers: ["Content Creator", "SMM Specialist", "Community Manager"],
      },
    ],
  },
  {
    id: 22,
    category: "interest",
    question: "Biror qurilmani tuzatganmisan?",
    options: [
      {
        text: "Kompyuter va texnik qurilmalar",
        careers: [
          "System Administrator",
          "Embedded/IoT Developer",
          "Hardware Engineer",
        ],
      },
      {
        text: "Telefon va mobil qurilmalar",
        careers: ["Mobile Developer", "QA Engineer", "DevOps Engineer"],
      },
      {
        text: "O'yin konsollari va o'yin qurilmalari",
        careers: ["Game Developer", "AR/VR Developer", "Hardware Engineer"],
      },
      {
        text: "Uy texnikasi va oddiy qurilmalar",
        careers: [
          "Embedded/IoT Developer",
          "System Administrator",
          "Hardware Engineer",
        ],
      },
    ],
  },
  {
    id: 23,
    category: "interest",
    question: "Do'stlaring bilan kontent tayyorlaganmisan?",
    options: [
      {
        text: "Video va fotolar tayyorlash",
        careers: ["Content Creator", "Motion Designer", "Video Editor"],
      },
      {
        text: "Dizayn va grafik materiallar",
        careers: ["Graphic Designer", "Illustrator", "UX/UI Designer"],
      },
      {
        text: "Matn va maqolalar yozish",
        careers: ["Copywriter", "Technical Writer", "Content Creator"],
      },
      {
        text: "Ijtimoiy tarmoqlar uchun materiallar",
        careers: ["SMM Specialist", "Community Manager", "Content Creator"],
      },
    ],
  },
  {
    id: 24,
    category: "interest",
    question: "Voqea-suratlarni qanday saqlaysan?",
    options: [
      {
        text: "Kompyuterda tashkil etib saqlash",
        careers: ["Data Engineer", "System Administrator", "Backend Developer"],
      },
      {
        text: "Bulut xizmatlarida saqlash",
        careers: ["DevOps Engineer", "Data Engineer", "Cloud Engineer"],
      },
      {
        text: "Ijtimoiy tarmoqlarda joylashtirish",
        careers: ["Content Creator", "SMM Specialist", "Community Manager"],
      },
      {
        text: "Fizik albomda saqlash",
        careers: ["Graphic Designer", "Photographer", "Content Creator"],
      },
    ],
  },
  {
    id: 25,
    category: "interest",
    question: "Tez-tez reja tuzasanmi?",
    options: [
      {
        text: "Kunlik va haftalik rejalar",
        careers: ["Project Manager", "Product Manager", "Business Analyst"],
      },
      {
        text: "Texnik loyihalar rejasi",
        careers: ["System Administrator", "DevOps Engineer", "Data Engineer"],
      },
      {
        text: "Ijodiy ishlar rejasi",
        careers: ["Graphic Designer", "Content Creator", "Motion Designer"],
      },
      {
        text: "Jamiyat va tadbirlar rejasi",
        careers: ["Community Manager", "Event Manager", "Marketing Specialist"],
      },
    ],
  },
  {
    id: 26,
    category: "interest",
    question: "Senga nimani ishonib topshirishadi?",
    options: [
      {
        text: "Texnik masalalar va kompyuter muammolari",
        careers: ["System Administrator", "IT Support", "DevOps Engineer"],
      },
      {
        text: "Dizayn va ko'rinish masalalar",
        careers: ["Graphic Designer", "UX/UI Designer", "Illustrator"],
      },
      {
        text: "Biznes va boshqaruv masalalar",
        careers: ["Business Analyst", "Product Manager", "Project Manager"],
      },
      {
        text: "Jamiyat va mijozlar bilan ishlash",
        careers: [
          "Customer Support Specialist",
          "Community Manager",
          "IT Recruiter",
        ],
      },
    ],
  },
  {
    id: 27,
    category: "interest",
    question: "Tug'ilgan kun yoki to'yni kim tashkil qiladi?",
    options: [
      {
        text: "Men tashkil qilaman va boshqaraman",
        careers: ["Event Manager", "Project Manager", "Community Manager"],
      },
      {
        text: "Men yordam beraman va texnik jihatdan ta'minlayman",
        careers: ["System Administrator", "DevOps Engineer", "IT Support"],
      },
      {
        text: "Men dizayn va ko'rinishni tayyorlayman",
        careers: ["Graphic Designer", "UX/UI Designer", "Motion Designer"],
      },
      {
        text: "Men kontent va fotolar tayyorlayman",
        careers: ["Content Creator", "Photographer", "Video Editor"],
      },
    ],
  },
  {
    id: 28,
    category: "interest",
    question: "Blog, video, rasm tayyorlaganmisan?",
    options: [
      {
        text: "Texnik blog va dasturlash bo'yicha maqolalar",
        careers: ["Technical Writer", "DevRel", "Backend Developer"],
      },
      {
        text: "Dizayn va ijodiy ishlar",
        careers: ["Graphic Designer", "Content Creator", "Illustrator"],
      },
      {
        text: "Video va fotolar tayyorlash",
        careers: ["Content Creator", "Motion Designer", "Video Editor"],
      },
      {
        text: "Ijtimoiy tarmoqlar uchun kontent",
        careers: ["SMM Specialist", "Community Manager", "Content Creator"],
      },
    ],
  },
  {
    id: 29,
    category: "interest",
    question: "Telefonning qaysi qismi qiziq? Kamera, sozlash, xavfsizlik?",
    options: [
      {
        text: "Kamera va fotolar tayyorlash",
        careers: ["Content Creator", "Graphic Designer", "Photographer"],
      },
      {
        text: "Sozlash va dasturlar",
        careers: ["Mobile Developer", "App Developer", "QA Engineer"],
      },
      {
        text: "Xavfsizlik va ma'lumotlarni himoya qilish",
        careers: [
          "Cybersecurity Specialist",
          "Data Engineer",
          "System Administrator",
        ],
      },
      {
        text: "Ijtimoiy tarmoqlar va ilovalar",
        careers: ["SMM Specialist", "Community Manager", "Mobile Developer"],
      },
    ],
  },
  {
    id: 30,
    category: "interest",
    question: "O'zingni qanday so'z bilan ta'riflaysan?",
    options: [
      {
        text: "Texnik va mantiqiy fikrlash",
        careers: ["Data Scientist", "AI/ML Engineer", "System Administrator"],
      },
      {
        text: "Ijodiy va dizayn fikrlash",
        careers: ["UX/UI Designer", "Graphic Designer", "Creative Director"],
      },
      {
        text: "Tashkiliy va boshqaruv qobiliyati",
        careers: ["Project Manager", "Team Lead", "Product Manager"],
      },
      {
        text: "Ijtimoiy va kommunikativ",
        careers: ["Community Manager", "DevRel", "IT Recruiter"],
      },
    ],
  },
];

// Career Assessment Test Component
const CareerAssessmentTest = ({ onTestCompleted, setNotifications }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [careerResults, setCareerResults] = useState({});
  const [testStarted, setTestStarted] = useState(false);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateResults = () => {
    const careerScores = {};

    // Initialize all careers with 0 score
    Object.values(CAREER_CATEGORIES).forEach((category) => {
      category.careers.forEach((career) => {
        careerScores[career] = 0;
      });
    });

    // Calculate scores based on answers
    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = CAREER_ASSESSMENT_QUESTIONS.find(
        (q) => q.id === parseInt(questionId)
      );
      if (question && question.options[optionIndex]) {
        const selectedCareers = question.options[optionIndex].careers;
        selectedCareers.forEach((career) => {
          careerScores[career] = (careerScores[career] || 0) + 1;
        });
      }
    });

    // Sort careers by score
    const sortedCareers = Object.entries(careerScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); // Top 10 careers

    return sortedCareers;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const results = calculateResults();
    setCareerResults(results);
    setShowResults(true);

    // Add notification
    setNotifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "success",
        message: "Career assessment completed! Check your results.",
        time: "Just now",
      },
    ]);

    setIsSubmitting(false);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setCareerResults({});
    setTestStarted(false);
  };

  const startTest = () => {
    setTestStarted(true);
  };

  // Test Overview Screen
  if (!testStarted) {
    return (
      <div className='space-y-4 max-w-4xl mx-auto p-4 md:p-6'>
        <div className='text-center mb-6'>
          <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <FileText className='w-8 h-8 text-white' />
          </div>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-3'>
            🎯 Career Assessment Test
          </h2>
          <p className='text-gray-600 mb-6 text-sm md:text-base'>
            Discover which IT career path best matches your personality and
            interests
          </p>
        </div>

        {/* Test Information */}
        <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/30 shadow-lg'>
          <h3 className='text-lg md:text-xl font-semibold text-gray-800 mb-4'>
            Test Information
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2.5'>
                <div className='w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <span className='text-blue-600 font-semibold text-sm'>📝</span>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800 text-sm'>
                    Total Questions
                  </h4>
                  <p className='text-gray-600 text-xs'>30 questions</p>
                </div>
              </div>

              <div className='flex items-center gap-2.5'>
                <div className='w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center'>
                  <span className='text-green-600 font-semibold text-sm'>⏱️</span>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800 text-sm'>
                    Estimated Time
                  </h4>
                  <p className='text-gray-600 text-xs'>10-15 minutes</p>
                </div>
              </div>

              <div className='flex items-center gap-2.5'>
                <div className='w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <span className='text-purple-600 font-semibold text-sm'>🎯</span>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800 text-sm'>
                    Career Categories
                  </h4>
                  <p className='text-gray-600 text-xs'>35+ IT careers</p>
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-2.5'>
                <div className='w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center'>
                  <span className='text-orange-600 font-semibold text-sm'>🧠</span>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800 text-sm'>Test Sections</h4>
                  <p className='text-gray-600 text-xs'>
                    Personality, Motivation, Interests
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-2.5'>
                <div className='w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center'>
                  <span className='text-red-600 font-semibold text-sm'>📊</span>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800 text-sm'>Results</h4>
                  <p className='text-gray-600 text-xs'>Top 10 career matches</p>
                </div>
              </div>

              <div className='flex items-center gap-2.5'>
                <div className='w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center'>
                  <span className='text-indigo-600 font-semibold text-sm'>🔄</span>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800 text-sm'>Retake</h4>
                  <p className='text-gray-600 text-xs'>Unlimited attempts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Instructions */}
          <div className='bg-blue-50/80 rounded-xl p-4 mb-6'>
            <h4 className='font-semibold text-blue-800 mb-3'>
              📋 Instructions:
            </h4>
            <ul className='space-y-2 text-blue-700'>
              <li>• Answer each question honestly based on your preferences</li>
              <li>
                • You can go back to previous questions and change answers
              </li>
              <li>• There are no right or wrong answers - be yourself!</li>
              <li>• Take your time to think about each question</li>
              <li>• You can retake the test anytime</li>
            </ul>
          </div>

          {/* Start Button */}
          <div className='text-center'>
            <button
              onClick={startTest}
              className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-base hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
              🚀 Start Career Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className='space-y-4 max-w-4xl mx-auto p-4 md:p-6'>
        <div className='text-center'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-3'>
            🎯 Your Career Results
          </h2>
          <p className='text-gray-600 mb-6 text-sm md:text-base'>
            Based on your answers, here are the careers that best match your
            personality and interests:
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {careerResults.map(([career, score], index) => (
            <div
              key={career}
              className='bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/30 shadow-lg'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-base font-semibold text-gray-800'>
                  {career}
                </h3>
                <span className='text-xs font-medium text-green-600'>
                  Score: {score}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full'
                  style={{ width: `${(score / 30) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center'>
          <button
            onClick={resetTest}
            className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm'>
            🔄 Take Test Again
          </button>
        </div>
      </div>
    );
  }

  const question = CAREER_ASSESSMENT_QUESTIONS[currentQuestion];
  const progress =
    ((currentQuestion + 1) / CAREER_ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <div className='space-y-4 max-w-4xl mx-auto p-4 md:p-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-3'>
          🎯 Career Assessment Test
        </h2>
        <p className='text-gray-600 mb-4 text-sm md:text-base'>
          Discover which IT career path best matches your personality and
          interests
        </p>

        {/* Progress Bar */}
        <div className='w-full bg-gray-200 rounded-full h-2.5 mb-3'>
          <div
            className='bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500'
            style={{ width: `${progress}%` }}></div>
        </div>
        <p className='text-xs text-gray-600'>
          Question {currentQuestion + 1} of {CAREER_ASSESSMENT_QUESTIONS.length}
        </p>
      </div>

      <div className='bg-white/80 backdrop-blur-xl rounded-xl p-4 md:p-6 border border-white/30 shadow-lg'>
        <h3 className='text-lg md:text-xl font-semibold text-gray-800 mb-4'>
          {question.question}
        </h3>

        <div className='space-y-3'>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, index)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-300 ${
                answers[question.id] === index
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}>
              <span className='font-medium text-sm'>{option.text}</span>
            </button>
          ))}
        </div>

        <div className='flex justify-between items-center mt-6'>
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className='px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
            ← Previous
          </button>

          {currentQuestion === CAREER_ASSESSMENT_QUESTIONS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={
                Object.keys(answers).length <
                  CAREER_ASSESSMENT_QUESTIONS.length || isSubmitting
              }
              className='px-6 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
              {isSubmitting ? "Calculating..." : "🎯 Get Results"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              disabled={!answers[question.id]}
              className='px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm'>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  // All useState hooks must be at the top
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar_url: "",
    lang: "en",
    github: "",
    telegram: "",
    role: "user",
  });
  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [deletingMessages, setDeletingMessages] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Portfolio state
  const [portfolio, setPortfolio] = useState(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState({});

  // Inline editing state
  const [editingField, setEditingField] = useState(null);
  const [tempData, setTempData] = useState({});

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // User count state
  const [userCount, setUserCount] = useState(0);
  const [jobApplications, setJobApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);

  // Freelance state
  const [projects, setProjects] = useState([]);
  const [projectProposals, setProjectProposals] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showProposals, setShowProposals] = useState(false);

  // Frai AI state
  const [aiMessage, setAiMessage] = useState("");
  const [aiMessages, setAiMessages] = useState([]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      message: "Profile updated successfully!",
      time: "2m ago",
    },
    {
      id: 2,
      type: "info",
      message: "New job opportunity: Frontend Developer at TechCorp",
      time: "1h ago",
    },
    {
      id: 3,
      type: "warning",
      message: "Test deadline approaching: React Advanced",
      time: "3h ago",
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Clean up old notifications (keep only last 10)
  useEffect(() => {
    if (notifications.length > 10) {
      setNotifications((prev) => prev.slice(-10));
    }
  }, [notifications]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notifications-dropdown")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Foydalanuvchi va profilni JWT cookie orqali olish
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/me");
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      const { user } = await res.json();
      setUser(user);

      // Profil ma'lumotlarini to'g'ridan-to'g'ri user'dan olish
      setProfile({
        name: user.name || "",
        email: user.email,
        bio: user.bio || "",
        avatar_url: user.image || "",
        lang: user.lang || "en",
        github: user.github || "",
        telegram: user.telegram || "",
        role: user.role || "user",
      });
    };
    fetchProfile();
  }, []);

  // Profil inputlar
  const handleChange = (e) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // Profilni yangilash
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          lang: profile.lang,
          github: profile.github,
          telegram: profile.telegram,
        }),
      });

      if (response.ok) {
        setSuccess("Profile updated!");
        // Add notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Profile updated successfully!",
            time: "Just now",
          },
        ]);
      } else {
        setError("Error updating profile");
        // Add error notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "warning",
            message: "Failed to update profile. Please try again.",
            time: "Just now",
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile");
    }

    setLoading(false);
  };

  // Logout
  const handleLogout = async () => {
    try {
      // API logout call
      await fetch("/api/logout", {
        method: "POST",
      });

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profileImage");

      // Clear all localStorage items related to the app
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith("profile") ||
          key.startsWith("portfolio") ||
          key.startsWith("chat")
        ) {
          localStorage.removeItem(key);
        }
      });

      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if API call fails
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    // This is now handled by the chat-specific online users fetching
    // No need for separate online count fetching
  }, []);

  // Chat xabarlarini olish
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setChatMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Har 3 soniyada yangilash
    return () => clearInterval(interval);
  }, []);

  // Portfolio ma'lumotlarini olish
  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoadingPortfolio(true);
      try {
        const response = await fetch("/api/portfolio");
        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);

          // Set profile image from portfolio data if exists
          if (data.profile_image) {
            setProfileImage(data.profile_image);
            localStorage.setItem("profileImage", data.profile_image);
          }
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoadingPortfolio(false);
      }
    };

    if (active === "Portfolio") {
      fetchPortfolio();
    }
  }, [active]);

  // Jobs ma'lumotlarini olish
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const response = await fetch("/api/jobs");
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoadingJobs(false);
      }
    };

    const fetchJobApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/job-applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setJobApplications(data);
        }
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchProjectProposals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/project-proposals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProjectProposals(data);
        }
      } catch (error) {
        console.error("Error fetching project proposals:", error);
      }
    };

    if (active === "Jobs") {
      fetchJobs();
      fetchJobApplications();
    }

    if (active === "Freelance") {
      fetchProjects();
      fetchProjectProposals();
    }
  }, [active]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Portfolio yangilash
  const handlePortfolioUpdate = async (updatedData) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedPortfolio = await response.json();
        setPortfolio(updatedPortfolio);
        setShowEditModal(false);
        setEditingPortfolio({});

        // Add notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Portfolio updated successfully!",
            time: "Just now",
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
      // Add error notification
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "Failed to update portfolio. Please try again.",
          time: "Just now",
        },
      ]);
    }
  };

  // Quick save for inline editing
  const handleQuickSave = async (field) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempData),
      });

      if (response.ok) {
        const updatedPortfolio = await response.json();
        setPortfolio(updatedPortfolio);
        setEditingField(null);
        setTempData({});

        // Add notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Updated successfully!",
            time: "Just now",
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating:", error);
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "Failed to update. Please try again.",
          time: "Just now",
        },
      ]);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "File size must be less than 5MB",
          time: "Just now",
        },
      ]);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "Please select an image file",
          time: "Just now",
        },
      ]);
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.imageUrl);

        // Save to localStorage for immediate persistence
        localStorage.setItem("profileImage", data.imageUrl);

        // Update portfolio with new image
        try {
          console.log("Updating portfolio with image:", data.imageUrl);

          const portfolioResponse = await fetch("/api/portfolio", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ profile_image: data.imageUrl }),
          });

          console.log("Portfolio response status:", portfolioResponse.status);

          if (portfolioResponse.ok) {
            const updatedPortfolio = await portfolioResponse.json();
            console.log("Updated portfolio:", updatedPortfolio);
            setPortfolio(updatedPortfolio);
          } else {
            const errorData = await portfolioResponse.text();
            console.error("Portfolio update failed:", errorData);
          }
        } catch (portfolioError) {
          console.error("Error updating portfolio:", portfolioError);
        }

        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Profile image updated successfully!",
            time: "Just now",
          },
        ]);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "Failed to upload image. Please try again.",
          time: "Just now",
        },
      ]);
    } finally {
      setUploadingImage(false);
    }
  };

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Chat connection and data fetching
  useEffect(() => {
    if (user && active === "Chats") {
      const token = localStorage.getItem("token");
      if (token) {
        // Connect to chat manager
        chatManager.connect(token);

        chatManager.onNewMessage((message) => {
          setChatMessages((prev) => [...prev, message]);
          // Don't auto-scroll when receiving messages - let user control scroll
        });
        chatManager.onMessageUpdated((updatedMessage) => {
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        });
        chatManager.onMessageDeleted(({ messageId }) => {
          setChatMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        });
        chatManager.onError((error) => {
          console.error("Chat error:", error);
        });

        // Fetch initial chat messages
        fetchChatMessages();

        // Fetch user count
        fetchUserCount();

        // Don't auto-scroll on initial load - let user see from top

        // Update user activity every 30 seconds
        const activityInterval = setInterval(() => {
          updateUserActivity();
        }, 30000);

        return () => {
          chatManager.disconnect();
          clearInterval(activityInterval);
        };
      }
    }
  }, [user, active]);

  // Auto scroll when messages change
  // Auto-scroll only when user sends a message, not when viewing old messages
  // useEffect(() => {
  //   if (chatMessages.length > 0) {
  //     setTimeout(() => {
  //       scrollToBottom();
  //     }, 100);
  //   }
  // }, [chatMessages]);

  // Typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      chatManager.startTyping();
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        chatManager.stopTyping();
      }, 2000);
    } else {
      chatManager.stopTyping();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping]);

  // Xabar yuborish
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const messageData = {
        message: newMessage.trim(),
        replyToId: replyingTo?.id || null,
      };

      // Send message with reply data
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setChatMessages((prev) => [...prev, newMsg]);
      }
      setNewMessage("");
      setReplyingTo(null); // Clear reply after sending
      setIsTyping(false);
      // Update user activity after sending message
      updateUserActivity();
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleEditMessage = (messageId, currentText) => {
    setEditingMessage(messageId);
    setEditMessageText(currentText);
    // Scroll to the editing message
    setTimeout(() => {
      const editingElement = document.querySelector(
        `[data-message-id="${messageId}"]`
      );
      if (editingElement) {
        editingElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleSaveEdit = () => {
    if (!editMessageText.trim()) return;

    chatManager.editMessage(editingMessage, editMessageText.trim());
    setEditingMessage(null);
    setEditMessageText("");
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditMessageText("");
  };

  const handleReplyMessage = (message) => {
    setReplyingTo(message);
    // Focus on input
    const input = document.querySelector(
      'input[placeholder*="Type your message"]'
    );
    if (input) input.focus();
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Ensure we're scrolling the chat messages container, not the whole page
      const chatMessagesContainer = messagesEndRef.current.closest('.overflow-y-auto');
      if (chatMessagesContainer) {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
      } else {
        // Fallback to the original method
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }
  };

  const handleDeleteMessage = (messageId) => {
    // Add to deleting set for animation
    setDeletingMessages((prev) => new Set([...prev, messageId]));

    // Delete after a short delay for animation
    setTimeout(() => {
      chatManager.deleteMessage(messageId);
      setDeletingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }, 300);
  };

  // Fetch chat messages
  const fetchChatMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  // Fetch user count
  const fetchUserCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserCount(data.totalUsers || 0);
      }
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  // Update user activity
  const updateUserActivity = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/users/online", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error updating user activity:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  if (!user)
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50'>
        <div className='text-center'>
          <div className='animate-spin w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
          <p className='text-sm text-gray-500 mt-2'>
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );

  const demoChats = [
    {
      id: 1,
      user: "Admin",
      last: "Welcome to FraiJob!",
      time: "2m ago",
      unread: 1,
    },
    {
      id: 2,
      user: "HR",
      last: "Interview scheduled.",
      time: "1h ago",
      unread: 0,
    },
  ];

  return (
    <div className='flex flex-col md:flex-row min-h-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50'>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`hidden md:flex transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex-col justify-between ${sidebarOpen ? "p-4" : "p-2"} backdrop-blur-xl bg-white/80 border-r border-white/30 shadow-xl`}>
        <div>
          <div
            className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} mb-6`}>
            <div className='flex items-center justify-center'>
              <div
                className={`${sidebarOpen ? "w-10 h-10" : "w-8 h-8"} relative`}>
                <Image
                  src='/logo.svg'
                  alt='Logo'
                  fill
                  className='object-contain'
                />
              </div>
            </div>
          </div>

          <nav className='space-y-2'>
            {menuItems.map(({ label, icon: Icon, adminOnly }, index) => {
              // Admin panel faqat admin foydalanuvchilar uchun
              if (adminOnly && profile.role?.toLowerCase() !== "admin") {
                return null;
              }

              return (
                <motion.button
                  key={label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (label === "Admin Panel") {
                      window.open("/admin/users", "_blank");
                    } else {
                      setActive(label);
                    }
                  }}
                  className={`flex items-center w-full ${sidebarOpen ? "px-3" : "px-2"} ${sidebarOpen ? "py-2" : "py-2"} rounded-lg text-sm font-medium transition-all duration-300 ${
                    active === label
                      ? "bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#10B981]"
                  } ${!sidebarOpen ? "justify-center" : ""}`}>
                  <Icon className='w-4 h-4 flex-shrink-0' />
                  {sidebarOpen && <span className='ml-2 text-sm'>{label}</span>}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className='space-y-2'>
          <div
            className={`flex items-center gap-2 ${sidebarOpen ? "p-3" : "p-2"} rounded-lg bg-gray-50 border border-gray-200`}>
            <div
              className={`${sidebarOpen ? "w-8 h-8" : "w-8 h-8"} rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-bold text-sm`}>
              {profile.name ? (
                <span>{profile.name[0].toUpperCase()}</span>
              ) : (
                <User size={16} />
              )}
            </div>
            {sidebarOpen && (
              <div className='flex-1 min-w-0'>
                <div className='font-medium text-gray-800 text-sm truncate'>
                  {profile.name || "User"}
                </div>
                <div className='text-gray-500 text-xs truncate'>
                  {profile.email}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button - Separate */}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full ${sidebarOpen ? "px-3 gap-2" : "px-2 justify-center"} py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200`}>
            <LogOut className='w-4 h-4 flex-shrink-0' />
            {sidebarOpen && <span className='text-sm'>Logout</span>}
          </button>
        </div>

        {/* Sidebar Toggle Button - always visible at the bottom */}
        {/* Remove the toggle button from inside <motion.aside> */}
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 z-50 md:hidden'
            onClick={() => setMobileMenuOpen(false)}>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className='w-64 h-full bg-white/95 backdrop-blur-xl shadow-xl p-4'
              onClick={(e) => e.stopPropagation()}>
              {/* Mobile Menu Header */}
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center justify-center'>
                  <div className='w-8 h-8 relative'>
                    <Image
                      src='/logo.svg'
                      alt='Logo'
                      fill
                      className='object-contain'
                    />
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className='p-2 rounded-lg hover:bg-gray-100'>
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <nav className='space-y-2 mb-8'>
                {menuItems.map(({ label, icon: Icon, adminOnly }) => {
                  if (adminOnly && profile.role?.toLowerCase() !== "admin") {
                    return null;
                  }

                  return (
                    <button
                      key={label}
                      onClick={() => {
                        if (label === "Admin Panel") {
                          window.open("/admin/users", "_blank");
                        } else {
                          setActive(label);
                          setMobileMenuOpen(false);
                        }
                      }}
                      className={`flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        active === label
                          ? "bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100 hover:text-[#10B981]"
                      }`}>
                      <Icon className='w-5 h-5 flex-shrink-0' />
                      <span className='ml-3'>{label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile User Profile */}
              <div className='space-y-3 border-t border-gray-200 pt-4'>
                <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-50'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-bold'>
                    {profile.name ? (
                      <span>{profile.name[0].toUpperCase()}</span>
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium text-gray-800 text-sm truncate'>
                      {profile.name || "User"}
                    </div>
                    <div className='text-gray-500 text-xs truncate'>
                      {profile.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className='flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200'>
                  <LogOut className='w-5 h-5 flex-shrink-0' />
                  <span className='ml-3'>Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden pb-16 md:pb-0'>
        {/* Enhanced Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='bg-white/80 backdrop-blur-xl border-b border-white/30 p-4 md:p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className='hidden md:block p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200'
                aria-label='Toggle sidebar'>
                {sidebarOpen ? (
                  <ChevronLeft size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200'
                aria-label='Toggle mobile menu'>
                <Menu size={20} />
              </button>

              <h1 className='text-xl md:text-2xl font-bold text-gray-800'>
                {active}
              </h1>
            </div>

            <div className='flex items-center gap-2 md:gap-4'>
              <div className='relative hidden sm:block'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search...'
                  className='pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:bg-white transition-all duration-300 w-48 md:w-64'
                />
              </div>
              <div className='relative notifications-dropdown'>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className='p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 relative'>
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className='absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full'></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-md border border-gray-200 z-50'>
                    <div className='p-3 border-b border-gray-100'>
                      <h3 className='font-semibold text-gray-800 text-sm'>
                        Notifications
                      </h3>
                    </div>
                    <div className='max-h-56 overflow-y-auto'>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className='p-3 border-b border-gray-100 hover:bg-gray-50'>
                          <div className='flex items-start gap-3'>
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === "success"
                                  ? "bg-green-500"
                                  : notification.type === "warning"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}></div>
                            <div className='flex-1'>
                              <p className='text-xs text-gray-800'>
                                {notification.message}
                              </p>
                              <p className='text-xs text-gray-500 mt-0.5'>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='p-3 border-t border-gray-100'>
                      <button className='text-sm text-[#10B981] hover:text-[#0ea672] font-medium'>
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className='flex-1 overflow-auto p-3 md:p-5'>
          <AnimatePresence mode='wait'>
            {active === "Dashboard" && (
              <motion.div
                key='dashboard'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                {/* Hero */}
                <FadeInUp delay={0.1}>
                  <div className='relative overflow-hidden rounded-2xl p-6 md:p-7 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl'>
                    <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl'></div>
                    <div className='absolute -bottom-12 -left-12 w-56 h-56 bg-white/10 rounded-full blur-3xl'></div>
                    <div className='relative flex items-start justify-between gap-6'>
                      <div>
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-semibold'>
                            {profile.name ? profile.name[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <h2 className='text-xl md:text-2xl font-semibold'>
                              Welcome back, {profile.name || "User"}! 👋
                            </h2>
                            <p className='text-white/80 text-sm'>Let’s boost your career journey today.</p>
                          </div>
                        </div>
                        <div className='mt-4 flex flex-wrap items-center gap-2'>
                          <button onClick={() => setActive("Portfolio")} className='px-3 py-1.5 rounded-lg bg-white text-emerald-700 text-xs md:text-sm font-medium hover:bg-white/90 transition'>Complete profile</button>
                          <button onClick={() => setActive("Jobs")} className='px-3 py-1.5 rounded-lg border border-white/40 text-white text-xs md:text-sm font-medium hover:bg-white/10 transition'>Find jobs</button>
                        </div>
                      </div>
                      <div className='text-right hidden sm:block'>
                        <div className='text-sm font-medium'>
                          {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                        </div>
                        <div className='text-xs text-white/80'>
                          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInUp>

                {/* Main layout */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                  {/* Left: KPIs, Activity, Quick actions */}
                  <div className='lg:col-span-2 space-y-4'>
                    {/* KPI tiles */}
                    <FadeInUp delay={0.2}>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                        <div className='rounded-xl bg-white/90 backdrop-blur border border-white/40 shadow-sm p-4 relative overflow-hidden'>
                          <div className='absolute right-0 top-0 w-16 h-16 bg-emerald-100 rounded-bl-[100%]'></div>
                          <div className='flex items-center justify-between relative'>
                            <span className='text-sm text-gray-600'>Applications</span>
                            <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700'>
                              <Briefcase className='h-4 w-4' />
                            </span>
                          </div>
                          <div className='mt-2 text-2xl font-semibold text-gray-900'>2</div>
                          <div className='mt-2 flex items-end gap-1 h-8'>
                            <span className='w-1.5 bg-emerald-200 rounded' style={{ height: '40%' }}></span>
                            <span className='w-1.5 bg-emerald-300 rounded' style={{ height: '60%' }}></span>
                            <span className='w-1.5 bg-emerald-400 rounded' style={{ height: '80%' }}></span>
                            <span className='w-1.5 bg-emerald-300 rounded' style={{ height: '55%' }}></span>
                            <span className='w-1.5 bg-emerald-500 rounded' style={{ height: '100%' }}></span>
                          </div>
                        </div>

                        <div className='rounded-xl bg-white/90 backdrop-blur border border-white/40 shadow-sm p-4 relative overflow-hidden'>
                          <div className='absolute right-0 top-0 w-16 h-16 bg-blue-100 rounded-bl-[100%]'></div>
                          <div className='flex items-center justify-between relative'>
                            <span className='text-sm text-gray-600'>Messages</span>
                            <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700'>
                              <MessagesSquare className='h-4 w-4' />
                            </span>
                          </div>
                          <div className='mt-2 text-2xl font-semibold text-gray-900'>{Array.isArray(chatMessages) ? chatMessages.length : 0}</div>
                          <div className='mt-2 flex items-end gap-1 h-8'>
                            <span className='w-1.5 bg-blue-200 rounded' style={{ height: '35%' }}></span>
                            <span className='w-1.5 bg-blue-300 rounded' style={{ height: '70%' }}></span>
                            <span className='w-1.5 bg-blue-400 rounded' style={{ height: '50%' }}></span>
                            <span className='w-1.5 bg-blue-300 rounded' style={{ height: '65%' }}></span>
                            <span className='w-1.5 bg-blue-500 rounded' style={{ height: '90%' }}></span>
                          </div>
                        </div>

                        <div className='rounded-xl bg-white/90 backdrop-blur border border-white/40 shadow-sm p-4 relative overflow-hidden'>
                          <div className='absolute right-0 top-0 w-16 h-16 bg-amber-100 rounded-bl-[100%]'></div>
                          <div className='flex items-center justify-between relative'>
                            <span className='text-sm text-gray-600'>Profile Views</span>
                            <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700'>
                              <Eye className='h-4 w-4' />
                            </span>
                          </div>
                          <div className='mt-2 text-2xl font-semibold text-gray-900'>—</div>
                          <div className='mt-2 flex items-end gap-1 h-8'>
                            <span className='w-1.5 bg-amber-200 rounded' style={{ height: '50%' }}></span>
                            <span className='w-1.5 bg-amber-300 rounded' style={{ height: '45%' }}></span>
                            <span className='w-1.5 bg-amber-400 rounded' style={{ height: '75%' }}></span>
                            <span className='w-1.5 bg-amber-300 rounded' style={{ height: '55%' }}></span>
                            <span className='w-1.5 bg-amber-500 rounded' style={{ height: '85%' }}></span>
                          </div>
                        </div>

                        <div className='rounded-xl bg-white/90 backdrop-blur border border-white/40 shadow-sm p-4 relative overflow-hidden'>
                          <div className='absolute right-0 top-0 w-16 h-16 bg-purple-100 rounded-bl-[100%]'></div>
                          <div className='flex items-center justify-between relative'>
                            <span className='text-sm text-gray-600'>Saved Jobs</span>
                            <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700'>
                              <FolderOpen className='h-4 w-4' />
                            </span>
                          </div>
                          <div className='mt-2 text-2xl font-semibold text-gray-900'>0</div>
                          <div className='mt-2 flex items-end gap-1 h-8'>
                            <span className='w-1.5 bg-purple-200 rounded' style={{ height: '30%' }}></span>
                            <span className='w-1.5 bg-purple-300 rounded' style={{ height: '55%' }}></span>
                            <span className='w-1.5 bg-purple-400 rounded' style={{ height: '40%' }}></span>
                            <span className='w-1.5 bg-purple-300 rounded' style={{ height: '65%' }}></span>
                            <span className='w-1.5 bg-purple-500 rounded' style={{ height: '70%' }}></span>
                          </div>
                        </div>
                      </div>
                    </FadeInUp>

                    {/* Application pipeline */}
                    <FadeInUp delay={0.28}>
                      <div className='rounded-2xl bg-white/90 backdrop-blur-xl p-6 border border-gray-200 shadow-sm'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Application pipeline</h3>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                          <div className='rounded-xl border border-gray-200 p-4'>
                            <div className='text-2xl font-semibold text-gray-900'>2</div>
                            <div className='text-xs text-gray-500'>Applied</div>
                            <div className='mt-3 h-1.5 w-full rounded-full bg-gray-200'>
                              <div className='h-1.5 rounded-full bg-emerald-500' style={{ width: '40%' }}></div>
                            </div>
                          </div>
                          <div className='rounded-xl border border-gray-200 p-4'>
                            <div className='text-2xl font-semibold text-gray-900'>1</div>
                            <div className='text-xs text-gray-500'>Interview</div>
                            <div className='mt-3 h-1.5 w-full rounded-full bg-gray-200'>
                              <div className='h-1.5 rounded-full bg-blue-500' style={{ width: '20%' }}></div>
                            </div>
                          </div>
                          <div className='rounded-xl border border-gray-200 p-4'>
                            <div className='text-2xl font-semibold text-gray-900'>0</div>
                            <div className='text-xs text-gray-500'>Offers</div>
                            <div className='mt-3 h-1.5 w-full rounded-full bg-gray-200'>
                              <div className='h-1.5 rounded-full bg-indigo-500' style={{ width: '0%' }}></div>
                            </div>
                          </div>
                          <div className='rounded-xl border border-gray-200 p-4'>
                            <div className='text-2xl font-semibold text-gray-900'>0</div>
                            <div className='text-xs text-gray-500'>Rejected</div>
                            <div className='mt-3 h-1.5 w-full rounded-full bg-gray-200'>
                              <div className='h-1.5 rounded-full bg-rose-500' style={{ width: '0%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FadeInUp>

                    {/* Job suggestions */}
                    <FadeInUp delay={0.32}>
                      <div className='rounded-2xl bg-white/90 backdrop-blur-xl p-6 border border-gray-200 shadow-sm'>
                        <div className='flex items-center justify-between mb-4'>
                          <h3 className='text-lg font-semibold text-gray-900'>Job suggestions</h3>
                          <button onClick={() => setActive('Jobs')} className='text-sm text-emerald-600 hover:text-emerald-700'>See all</button>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                          <div className='rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition'>
                            <div className='flex items-start justify-between'>
                              <div>
                                <div className='text-sm font-medium text-gray-900'>Frontend Developer</div>
                                <div className='text-xs text-gray-500'>TechCorp • Remote • Full-time</div>
                              </div>
                              <span className='text-xs px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700'>$2.5k–4k</span>
                            </div>
                            <div className='mt-3 flex flex-wrap gap-2'>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-emerald-50 text-emerald-700'>React</span>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-700'>TypeScript</span>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-purple-50 text-purple-700'>Tailwind</span>
                            </div>
                            <div className='mt-3'>
                              <button onClick={() => setActive('Jobs')} className='text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition'>View</button>
                            </div>
                          </div>
                          <div className='rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition'>
                            <div className='flex items-start justify-between'>
                              <div>
                                <div className='text-sm font-medium text-gray-900'>React Native Engineer</div>
                                <div className='text-xs text-gray-500'>Appify • Hybrid • Contract</div>
                              </div>
                              <span className='text-xs px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700'>$3k–5k</span>
                            </div>
                            <div className='mt-3 flex flex-wrap gap-2'>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-indigo-50 text-indigo-700'>React Native</span>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-pink-50 text-pink-700'>Expo</span>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-amber-50 text-amber-700'>REST</span>
                            </div>
                            <div className='mt-3'>
                              <button onClick={() => setActive('Jobs')} className='text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition'>View</button>
                            </div>
                          </div>
                          <div className='rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition'>
                            <div className='flex items-start justify-between'>
                              <div>
                                <div className='text-sm font-medium text-gray-900'>UI Engineer</div>
                                <div className='text-xs text-gray-500'>Designly • Remote • Part-time</div>
                              </div>
                              <span className='text-xs px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700'>$1.5k–3k</span>
                            </div>
                            <div className='mt-3 flex flex-wrap gap-2'>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-purple-50 text-purple-700'>Figma</span>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-blue-50 text-blue-700'>UI</span>
                              <span className='text-[11px] px-2 py-1 rounded-md bg-emerald-50 text-emerald-700'>Accessibility</span>
                            </div>
                            <div className='mt-3'>
                              <button onClick={() => setActive('Jobs')} className='text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition'>View</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FadeInUp>

                    {/* Upcoming interviews */}
                    <FadeInUp delay={0.36}>
                      <div className='rounded-2xl bg-white/90 backdrop-blur-xl p-6 border border-gray-200 shadow-sm'>
                        <div className='flex items-center justify-between mb-4'>
                          <h3 className='text-lg font-semibold text-gray-900'>Upcoming interviews</h3>
                          <button className='text-sm text-emerald-600 hover:text-emerald-700'>Add</button>
                        </div>
                        <div className='space-y-3'>
                          <div className='flex items-start justify-between rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition'>
                            <div className='flex items-start gap-3'>
                              <div className='w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-medium'>13</div>
                              <div>
                                <div className='text-sm font-medium text-gray-900'>Frontend Interview • TechCorp</div>
                                <div className='text-xs text-gray-500'>Wed, 10:30 • Google Meet</div>
                              </div>
                            </div>
                            <button className='text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition'>View</button>
                          </div>
                          <div className='flex items-start justify-between rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition'>
                            <div className='flex items-start gap-3'>
                              <div className='w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-medium'>15</div>
                              <div>
                                <div className='text-sm font-medium text-gray-900'>Tech Screen • Appify</div>
                                <div className='text-xs text-gray-500'>Fri, 14:00 • Zoom</div>
                              </div>
                            </div>
                            <button className='text-xs px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition'>View</button>
                          </div>
                        </div>
                      </div>
                    </FadeInUp>
                  </div>

                  {/* Right: Progress + Recommendations */}
                  <div className='space-y-4'>
                    {/* Next steps checklist with progress ring */}
                    <FadeInUp delay={0.25}>
                      <div className='rounded-2xl bg-white/90 backdrop-blur-xl p-6 border border-gray-200 shadow-sm'>
                        <div className='flex items-center justify-between mb-3'>
                          <h3 className='text-base font-semibold text-gray-900'>Next steps</h3>
                          <span className='text-xs px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100'>85% complete</span>
                        </div>
                        <div className='flex items-start gap-4'>
                          <div className='relative w-24 h-24 flex-shrink-0'>
                            <div className='absolute inset-0 rounded-full' style={{ background: 'conic-gradient(#10B981 0% 85%, #e5e7eb 85% 100%)' }}></div>
                            <div className='absolute inset-2 rounded-full bg-white/90 backdrop-blur flex items-center justify-center border border-gray-200'>
                              <span className='text-lg font-semibold text-gray-900'>85%</span>
                            </div>
                          </div>
                          <div className='flex-1 space-y-2'>
                            <label className='flex items-center gap-2 text-sm text-gray-800'>
                              <input type='checkbox' defaultChecked className='rounded text-emerald-600' /> Add 5+ skills
                            </label>
                            <label className='flex items-center gap-2 text-sm text-gray-800'>
                              <input type='checkbox' defaultChecked={false} className='rounded text-emerald-600' /> Upload 2 portfolio items
                            </label>
                            <label className='flex items-center gap-2 text-sm text-gray-800'>
                              <input type='checkbox' defaultChecked className='rounded text-emerald-600' /> Set desired salary range
                            </label>
                            <div className='pt-2'>
                              <button onClick={() => setActive('Portfolio')} className='text-xs px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition'>Continue</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FadeInUp>

                    {/* Recommendations - removed as requested */}
                  </div>
                </div>

                {/* Removed duplicate sections as requested */}
              </motion.div>
            )}

            {active === "Portfolio" && (
              <motion.div
                key='portfolio'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6 max-w-6xl mx-auto'>
                {loadingPortfolio ? (
                  <div className='flex items-center justify-center py-20'>
                    <div className='animate-spin w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full'></div>
                  </div>
                ) : (
                  <>
                    {/* Header Section - New Layout */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                      {/* Profile Picture - Left Side (Larger) */}
                      <FadeInUp delay={0.1}>
                        <div className='group relative bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg h-full overflow-hidden border border-cyan-200/50'>
                          <div className='absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <label className='w-8 h-8 bg-cyan-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-cyan-500/30 transition-all duration-200 border border-cyan-300/30 shadow-lg hover:scale-110 cursor-pointer'>
                              <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageUpload}
                                className='hidden'
                              />
                              {uploadingImage ? (
                                <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                              ) : (
                                <svg
                                  className='w-3 h-3 text-cyan-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                </svg>
                              )}
                            </label>
                          </div>

                          <div className='relative z-10 flex items-center justify-center h-full p-4'>
                            {profileImage || portfolio?.profile_image ? (
                              <div className='aspect-square w-full min-w-[150px] max-w-[400px] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border-4 border-cyan-200/50 shadow-2xl'>
                                <img
                                  src={profileImage || portfolio?.profile_image}
                                  alt='Profile'
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            ) : (
                              <div className='aspect-square w-full min-w-[150px] max-w-[400px] bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center text-8xl font-bold text-cyan-700 border-4 border-cyan-200/50 shadow-2xl'>
                                {portfolio?.name
                                  ? portfolio.name[0].toUpperCase()
                                  : profile.name
                                    ? profile.name[0].toUpperCase()
                                    : "U"}
                              </div>
                            )}
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Right Side - Name and Contact Stacked */}
                      <div className='lg:col-span-2 space-y-4'>
                        {/* Name and Title */}
                        <FadeInUp delay={0.2}>
                          <div className='group relative bg-gradient-to-br from-teal-50 via-emerald-50 to-green-100 rounded-2xl p-5 shadow-lg overflow-hidden border border-teal-200/50'>
                            <div className='absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8'></div>

                            {/* Hover Edit Button */}
                            <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                              <button
                                onClick={() =>
                                  setEditingField(
                                    editingField === "name" ? null : "name"
                                  )
                                }
                                className='w-8 h-8 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-teal-500/30 transition-all duration-200 border border-teal-300/30 shadow-lg hover:scale-110'>
                                <Edit size={12} className='text-teal-700' />
                              </button>
                            </div>

                            <div className='relative z-10'>
                              <div className='space-y-3'>
                                {editingField === "name" ? (
                                  <div className='space-y-3'>
                                    <input
                                      type='text'
                                      value={
                                        tempData.name ||
                                        portfolio?.name ||
                                        profile.name ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          name: e.target.value,
                                        })
                                      }
                                      className='w-full text-2xl font-bold bg-white/80 text-teal-800 placeholder-teal-500 border border-teal-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300/50'
                                      placeholder='Your Name'
                                    />
                                    <input
                                      type='text'
                                      value={
                                        tempData.title || portfolio?.title || ""
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          title: e.target.value,
                                        })
                                      }
                                      className='w-full text-lg bg-white/80 text-teal-800 placeholder-teal-500 border border-teal-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300/50'
                                      placeholder='Your Title'
                                    />
                                    <textarea
                                      value={
                                        tempData.bio ||
                                        portfolio?.bio ||
                                        profile.bio ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          bio: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-teal-800 placeholder-teal-500 border border-teal-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300/50 resize-none'
                                      placeholder='Your Bio'
                                      rows={3}
                                    />
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={() => handleQuickSave("name")}
                                        className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingField(null)}
                                        className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <h1 className='text-2xl font-bold text-teal-800'>
                                      {portfolio?.name ||
                                        profile.name ||
                                        "User Name"}
                                    </h1>
                                    <p className='text-lg text-teal-700 font-medium'>
                                      🚀{" "}
                                      {portfolio?.title ||
                                        "Full-Stack Developer"}
                                    </p>
                                    <p className='text-teal-600 text-sm leading-relaxed'>
                                      {portfolio?.bio ||
                                        profile.bio ||
                                        "Passionate about creating amazing digital experiences"}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </FadeInUp>

                        {/* Contact Information */}
                        <FadeInUp delay={0.3}>
                          <div className='group relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 rounded-2xl p-5 shadow-lg overflow-hidden border border-orange-200/50'>
                            <div className='absolute top-0 right-0 w-22 h-22 bg-white/10 rounded-full -translate-y-11 translate-x-11'></div>

                            {/* Hover Edit Button */}
                            <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                              <button
                                onClick={() =>
                                  setEditingField(
                                    editingField === "contact"
                                      ? null
                                      : "contact"
                                  )
                                }
                                className='w-8 h-8 bg-orange-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-500/30 transition-all duration-200 border border-orange-300/30 shadow-lg hover:scale-110'>
                                <Edit size={12} className='text-orange-700' />
                              </button>
                            </div>

                            <div className='relative z-10'>
                              <div className='flex items-center gap-3 mb-6'>
                                <div className='w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-300/30'>
                                  <svg
                                    className='w-5 h-5 text-orange-700'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                    />
                                  </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-orange-800'>
                                  Contact
                                </h3>
                              </div>
                              {editingField === "contact" ? (
                                <div className='space-y-3'>
                                  <input
                                    type='email'
                                    value={
                                      tempData.email ||
                                      portfolio?.email ||
                                      profile.email ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        email: e.target.value,
                                      })
                                    }
                                    className='w-full bg-white/80 text-orange-800 placeholder-orange-500 border border-orange-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300/50'
                                    placeholder='Email Address'
                                  />
                                  <input
                                    type='tel'
                                    value={
                                      tempData.phone || portfolio?.phone || ""
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        phone: e.target.value,
                                      })
                                    }
                                    className='w-full bg-white/80 text-orange-800 placeholder-orange-500 border border-orange-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300/50'
                                    placeholder='Phone Number'
                                  />
                                  <div className='flex gap-2'>
                                    <button
                                      onClick={() => handleQuickSave("contact")}
                                      className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingField(null)}
                                      className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className='space-y-3'>
                                  <div className='flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 shadow-sm'>
                                    <div className='w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-300/30'>
                                      <svg
                                        className='w-4 h-4 text-orange-700'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                        />
                                      </svg>
                                    </div>
                                    <span className='text-sm text-orange-800 font-medium'>
                                      {portfolio?.email || profile.email}
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 shadow-sm'>
                                    <div className='w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-300/30'>
                                      <svg
                                        className='w-4 h-4 text-orange-700'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                                        />
                                      </svg>
                                    </div>
                                    <span className='text-sm text-orange-800 font-medium'>
                                      {" "}
                                      {portfolio?.phone || "+998 90 123 45 67"}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </FadeInUp>
                      </div>
                    </div>

                    {/* Education Section - Full Width */}
                    <FadeInUp delay={0.4}>
                      <div className='group relative bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg overflow-hidden border border-indigo-200/50'>
                        <div className='absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 -translate-x-12'></div>

                        {/* Hover Edit Button */}
                        <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                          <button
                            onClick={() =>
                              setEditingField(
                                editingField === "education"
                                  ? null
                                  : "education"
                              )
                            }
                            className='w-8 h-8 bg-indigo-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-indigo-500/30 transition-all duration-200 border border-indigo-300/30 shadow-lg hover:scale-110'>
                            <Edit size={12} className='text-indigo-700' />
                          </button>
                        </div>

                        <div className='relative z-10'>
                          <div className='flex items-center gap-4 mb-6'>
                            <div className='w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-300/30'>
                              <svg
                                className='w-6 h-6 text-indigo-700'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 14l9-5-9-5-9 5 9 5z'
                                />
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
                                />
                              </svg>
                            </div>
                            <h2 className='text-2xl font-bold text-indigo-800'>
                              🎓 Education
                            </h2>
                          </div>
                          {editingField === "education" ? (
                            <div className='space-y-4'>
                              <div className='bg-white/90 backdrop-blur-sm border border-indigo-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-sm mb-3 text-indigo-800'>
                                  Edit Education
                                </h3>
                                <div className='space-y-3'>
                                  <input
                                    type='text'
                                    value={
                                      tempData.degree ||
                                      portfolio?.degree ||
                                      "Bachelor in Computer Science"
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        degree: e.target.value,
                                      })
                                    }
                                    className='w-full text-sm bg-white/80 text-indigo-800 placeholder-indigo-500 border border-indigo-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300/50'
                                    placeholder='Degree/Course Name'
                                  />
                                  <input
                                    type='text'
                                    value={
                                      tempData.university ||
                                      portfolio?.university ||
                                      "Tashkent University"
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        university: e.target.value,
                                      })
                                    }
                                    className='w-full text-sm bg-white/80 text-indigo-800 placeholder-indigo-500 border border-indigo-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300/50'
                                    placeholder='University Name'
                                  />
                                  <input
                                    type='text'
                                    value={
                                      tempData.educationYears ||
                                      portfolio?.educationYears ||
                                      "2020-2024"
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        educationYears: e.target.value,
                                      })
                                    }
                                    className='w-full text-sm bg-white/80 text-indigo-800 placeholder-indigo-500 border border-indigo-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300/50'
                                    placeholder='Years (e.g., 2020-2024)'
                                  />
                                  <div className='flex gap-2'>
                                    <button
                                      onClick={() =>
                                        handleQuickSave("education")
                                      }
                                      className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingField(null)}
                                      className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div className='flex items-start gap-4 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-5 shadow-sm'>
                                <div className='w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-300/30'>
                                  <svg
                                    className='w-6 h-6 text-indigo-700'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className='font-bold text-lg mb-2 text-indigo-800'>
                                    Bachelor in Computer Science
                                  </h3>
                                  <p className='text-indigo-700 font-medium mb-1'>
                                    🏫 Tashkent University
                                  </p>
                                  <p className='text-indigo-600 text-sm'>
                                    📅 2020-2024
                                  </p>
                                </div>
                              </div>
                              <div className='flex items-start gap-4 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-5 shadow-sm'>
                                <div className='w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-300/30'>
                                  <svg
                                    className='w-6 h-6 text-indigo-700'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className='font-bold text-lg mb-2 text-indigo-800'>
                                    Web Development Bootcamp
                                  </h3>
                                  <p className='text-indigo-700 font-medium mb-1'>
                                    💻 Udemy & Coursera
                                  </p>
                                  <p className='text-indigo-600 text-sm'>
                                    📅 2023-2024
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </FadeInUp>

                    {/* Middle Section - 3 Columns */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {/* Experience - Premium Blue */}
                      <FadeInUp delay={0.5}>
                        <div className='group relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-2xl p-5 shadow-lg overflow-hidden h-full border border-blue-200/50'>
                          {/* Background Pattern */}
                          <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
                          <div className='absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-14 translate-x-14'></div>
                          <div className='absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10'></div>
                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() =>
                                setEditingField(
                                  editingField === "experience"
                                    ? null
                                    : "experience"
                                )
                              }
                              className='w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all duration-200 border border-blue-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-blue-700' />
                            </button>
                          </div>
                          {/* Content */}
                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-300/30'>
                                <Briefcase
                                  size={24}
                                  className='text-blue-700'
                                />
                              </div>
                              <h2 className='text-2xl font-bold text-blue-800'>
                                Experience
                              </h2>
                            </div>
                            {editingField === "experience" ? (
                              <div className='space-y-4'>
                                <div className='bg-white/90 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 shadow-sm'>
                                  <h3 className='font-bold text-sm mb-3 text-blue-800'>
                                    Edit Experience
                                  </h3>
                                  <div className='space-y-3'>
                                    <input
                                      type='text'
                                      value={
                                        tempData.jobTitle ||
                                        portfolio?.jobTitle ||
                                        "Frontend Developer"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          jobTitle: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-blue-800 placeholder-blue-500 border border-blue-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
                                      placeholder='Job Title'
                                    />
                                    <input
                                      type='text'
                                      value={
                                        tempData.company ||
                                        portfolio?.company ||
                                        "TechSoft"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          company: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-blue-800 placeholder-blue-500 border border-blue-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
                                      placeholder='Company Name'
                                    />
                                    <input
                                      type='text'
                                      value={
                                        tempData.workPeriod ||
                                        portfolio?.workPeriod ||
                                        "Aug 2023 - Present"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          workPeriod: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-blue-800 placeholder-blue-500 border border-blue-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
                                      placeholder='Work Period'
                                    />
                                    <input
                                      type='text'
                                      value={
                                        tempData.workLocation ||
                                        portfolio?.workLocation ||
                                        "Tashkent, Uzbekistan"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          workLocation: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-blue-800 placeholder-blue-500 border border-blue-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
                                      placeholder='Work Location'
                                    />
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={() =>
                                          handleQuickSave("experience")
                                        }
                                        className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingField(null)}
                                        className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className='space-y-4'>
                                <div className='bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 hover:bg-blue-50 transition-all duration-300 shadow-sm'>
                                  <h3 className='font-bold text-lg mb-2 text-blue-800'>
                                    Frontend Developer
                                  </h3>
                                  <p className='text-blue-700 font-medium text-sm mb-1'>
                                    🏢 TechSoft • Aug 2023
                                  </p>
                                  <p className='text-blue-600 text-xs'>
                                    📍 Tashkent, Uzbekistan
                                  </p>
                                </div>
                                <div className='bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 hover:bg-blue-50 transition-all duration-300 shadow-sm'>
                                  <h3 className='font-bold text-lg mb-2 text-blue-800'>
                                    UI/UX Designer
                                  </h3>
                                  <p className='text-blue-700 font-medium text-sm mb-1'>
                                    🎨 Design Studio • Jan 2023
                                  </p>
                                  <p className='text-blue-600 text-xs'>
                                    🌐 Remote
                                  </p>
                                </div>
                                <div className='bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 hover:bg-blue-50 transition-all duration-300 shadow-sm'>
                                  <h3 className='font-bold text-lg mb-2 text-blue-800'>
                                    Freelance Developer
                                  </h3>
                                  <p className='text-blue-700 font-medium text-sm mb-1'>
                                    💼 Upwork • 2022-Present
                                  </p>
                                  <p className='text-blue-600 text-xs'>
                                    🌍 Global
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Skills - Green Gradient */}
                      <FadeInUp delay={0.6}>
                        <div className='group relative bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 rounded-2xl p-5 shadow-lg h-full overflow-hidden border border-emerald-200/50'>
                          <div className='absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() =>
                                setEditingField(
                                  editingField === "skills" ? null : "skills"
                                )
                              }
                              className='w-8 h-8 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-all duration-200 border border-emerald-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-emerald-700' />
                            </button>
                          </div>

                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-300/30'>
                                <svg
                                  className='w-5 h-5 text-emerald-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                  />
                                </svg>
                              </div>
                              <h2 className='text-xl font-bold text-emerald-800'>
                                Skills
                              </h2>
                            </div>

                            {editingField === "skills" ? (
                              <div className='space-y-4'>
                                <div className='bg-white/90 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 shadow-sm'>
                                  <h3 className='font-bold text-sm mb-3 text-emerald-800'>
                                    Edit Skills
                                  </h3>
                                  <div className='space-y-3'>
                                    <textarea
                                      value={
                                        tempData.skillsDescription ||
                                        portfolio?.skillsDescription ||
                                        "Frontend: React, Next.js, TypeScript, Tailwind CSS\nBackend: Node.js, Express.js, MongoDB\nTools: Git, Docker, Vercel"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          skillsDescription: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-emerald-800 placeholder-emerald-500 border border-emerald-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 resize-none'
                                      placeholder='Describe your skills (one per line)'
                                      rows={6}
                                    />
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={() =>
                                          handleQuickSave("skills")
                                        }
                                        className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingField(null)}
                                        className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className='space-y-4'>
                                {/* Frontend Skills */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 shadow-sm'>
                                  <h3 className='text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                                    Frontend Development
                                  </h3>
                                  <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100'>
                                      <div className='w-8 h-8 flex items-center justify-center'>
                                        <svg
                                          viewBox='0 0 24 24'
                                          className='w-6 h-6'
                                          fill='#61DAFB'>
                                          <circle cx='12' cy='12' r='2' />
                                          <path d='M12,1C18.5,1 24,6.5 24,12C24,17.5 18.5,23 12,23C5.5,23 0,17.5 0,12C0,6.5 5.5,1 12,1M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M7.5,18C8,17.5 8.5,17 9,16.5C10,15.5 11,14.5 12,13.5C13,14.5 14,15.5 15,16.5C15.5,17 16,17.5 16.5,18C14.5,19.5 10.5,19.5 7.5,18M16.5,6C16,6.5 15.5,7 15,7.5C14,8.5 13,9.5 12,10.5C11,9.5 10,8.5 9,7.5C8.5,7 8,6.5 7.5,6C10.5,4.5 14.5,4.5 16.5,6M6,7.5C6.5,8 7,8.5 7.5,9C8.5,10 9.5,11 10.5,12C9.5,13 8.5,14 7.5,15C7,15.5 6.5,16 6,16.5C4.5,14.5 4.5,10.5 6,7.5M18,16.5C17.5,16 17,15.5 16.5,15C15.5,14 14.5,13 13.5,12C14.5,11 15.5,10 16.5,9C17,8.5 17.5,8 18,7.5C19.5,10.5 19.5,14.5 18,16.5Z' />
                                        </svg>
                                      </div>
                                      <span className='text-sm font-medium text-emerald-800'>
                                        React
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100'>
                                      <div className='w-8 h-8 flex items-center justify-center'>
                                        <svg
                                          viewBox='0 0 24 24'
                                          className='w-6 h-6'
                                          fill='#000000'>
                                          <path d='M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C19.146 4.318 16.956 1.669 13.94.394 13.114.134 12.208.026 11.572 0z' />
                                        </svg>
                                      </div>
                                      <span className='text-sm font-medium text-emerald-800'>
                                        Next.js
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100'>
                                      <div className='w-8 h-8 flex items-center justify-center'>
                                        <svg
                                          viewBox='0 0 24 24'
                                          className='w-6 h-6'
                                          fill='#06B6D4'>
                                          <path d='M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z' />
                                        </svg>
                                      </div>
                                      <span className='text-sm font-medium text-emerald-800'>
                                        Tailwind CSS
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100'>
                                      <div className='w-8 h-8 flex items-center justify-center'>
                                        <svg
                                          viewBox='0 0 24 24'
                                          className='w-6 h-6'
                                          fill='#3178C6'>
                                          <path d='M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z' />
                                        </svg>
                                      </div>
                                      <span className='text-sm font-medium text-emerald-800'>
                                        TypeScript
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Backend Skills */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 shadow-sm'>
                                  <h3 className='text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                                    Backend Development
                                  </h3>
                                  <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Node.js
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Express.js
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      MongoDB
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      REST API
                                    </span>
                                  </div>
                                </div>

                                {/* Tools & Technologies */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 shadow-sm'>
                                  <h3 className='text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                                    Tools & Technologies
                                  </h3>
                                  <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Git & GitHub
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Docker
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Vercel
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      PWA
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      JavaScript
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      HTML5/CSS3
                                    </span>
                                  </div>
                                </div>

                                <div className='mt-4 text-center'>
                                  <p className='text-xs text-emerald-600 font-medium'>
                                    🚀 Constantly learning and improving skills
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Expertise - Red Gradient */}
                      <FadeInUp delay={0.7}>
                        <div className='group relative bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 rounded-2xl p-5 shadow-lg h-full overflow-hidden border border-red-200/50'>
                          <div className='absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 -translate-x-10'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() => {
                                setEditingField("expertise");
                                setShowEditModal(true);
                                setEditingPortfolio({
                                  field: "expertise",
                                  title: "Edit Expertise",
                                  data: portfolio?.expertise || {},
                                });
                              }}
                              className='w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/30 transition-all duration-200 border border-red-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-red-700' />
                            </button>
                          </div>

                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-300/30'>
                                <svg
                                  className='w-5 h-5 text-red-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                                  />
                                </svg>
                              </div>
                              <h2 className='text-xl font-bold text-red-800'>
                                Expertise
                              </h2>
                            </div>
                            <div className='space-y-4'>
                              <div>
                                <div className='flex justify-between mb-2'>
                                  <span className='text-sm font-medium text-red-800'>
                                    Frontend Development
                                  </span>
                                  <span className='text-sm font-bold text-red-800'>
                                    90%
                                  </span>
                                </div>
                                <div className='w-full bg-red-200/50 rounded-full h-2'>
                                  <div
                                    className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                    style={{ width: "90%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className='flex justify-between mb-2'>
                                  <span className='text-sm font-medium text-red-800'>
                                    Backend Development
                                  </span>
                                  <span className='text-sm font-bold text-red-800'>
                                    85%
                                  </span>
                                </div>
                                <div className='w-full bg-red-200/50 rounded-full h-2'>
                                  <div
                                    className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                    style={{ width: "85%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className='flex justify-between mb-2'>
                                  <span className='text-sm font-medium text-red-800'>
                                    UI/UX Design
                                  </span>
                                  <span className='text-sm font-bold text-red-800'>
                                    80%
                                  </span>
                                </div>
                                <div className='w-full bg-red-200/50 rounded-full h-2'>
                                  <div
                                    className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                    style={{ width: "80%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className='flex justify-between mb-2'>
                                  <span className='text-sm font-medium text-red-800'>
                                    Mobile Development
                                  </span>
                                  <span className='text-sm font-bold text-red-800'>
                                    75%
                                  </span>
                                </div>
                                <div className='w-full bg-red-200/50 rounded-full h-2'>
                                  <div
                                    className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                    style={{ width: "75%" }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>
                    </div>

                    {/* Bottom Section - 3 Columns */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {/* References - Purple Gradient */}
                      <FadeInUp delay={1.1}>
                        <div className='group relative bg-gradient-to-br from-purple-100 via-purple-200 to-indigo-200 rounded-2xl p-5 shadow-lg h-full overflow-hidden border border-purple-200/50'>
                          <div className='absolute top-0 left-0 w-18 h-18 bg-white/10 rounded-full -translate-y-9 -translate-x-9'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() => {
                                setEditingField("references");
                                setShowEditModal(true);
                                setEditingPortfolio({
                                  field: "references",
                                  title: "Edit References",
                                  data: portfolio?.references || {},
                                });
                              }}
                              className='w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-all duration-200 border border-purple-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-purple-700' />
                            </button>
                          </div>

                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-300/30'>
                                <svg
                                  className='w-5 h-5 text-purple-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                                  />
                                </svg>
                              </div>
                              <h2 className='text-xl font-bold text-purple-800'>
                                References
                              </h2>
                            </div>
                            <div className='space-y-3'>
                              <div className='bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-base mb-2 text-purple-800'>
                                  John Smith
                                </h3>
                                <p className='text-sm text-purple-700 font-medium mb-1'>
                                  Senior Developer at TechSoft
                                </p>
                                <p className='text-xs text-purple-600 mb-1'>
                                  📞 +998 90 123 45 67
                                </p>
                                <p className='text-xs text-purple-600'>
                                  ✉️ john@techsoft.com
                                </p>
                              </div>
                              <div className='bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-base mb-2 text-purple-800'>
                                  Sarah Johnson
                                </h3>
                                <p className='text-sm text-purple-700 font-medium mb-1'>
                                  UI/UX Lead at Design Studio
                                </p>
                                <p className='text-xs text-purple-600 mb-1'>
                                  📞 +998 90 987 65 43
                                </p>
                                <p className='text-xs text-purple-600'>
                                  ✉️ sarah@designstudio.com
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Skills & Achievements - Green Gradient */}
                      <FadeInUp delay={1.2}>
                        <div className='group relative bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 rounded-2xl p-5 shadow-lg h-full overflow-hidden border border-emerald-200/50'>
                          <div className='absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-y-[-10px] translate-x-[10px]'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() => {
                                setEditingField("achievements");
                                setShowEditModal(true);
                                setEditingPortfolio({
                                  field: "achievements",
                                  title: "Edit Skills & Achievements",
                                  data: portfolio?.achievements || {},
                                });
                              }}
                              className='w-8 h-8 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-all duration-200 border border-emerald-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-emerald-700' />
                            </button>
                          </div>

                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-300/30'>
                                <svg
                                  className='w-5 h-5 text-emerald-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                  />
                                </svg>
                              </div>
                              <h2 className='text-xl font-bold text-emerald-800'>
                                Skills & Achievements
                              </h2>
                            </div>

                            <div className='space-y-4'>
                              {/* Top Skills */}
                              <div className='bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-sm mb-3 text-emerald-800'>
                                  🚀 Top Skills
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                  <span className='px-2 py-1 bg-emerald-100 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200'>
                                    React.js
                                  </span>
                                  <span className='px-2 py-1 bg-emerald-100 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200'>
                                    Node.js
                                  </span>
                                  <span className='px-2 py-1 bg-emerald-100 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200'>
                                    Python
                                  </span>
                                  <span className='px-2 py-1 bg-emerald-100 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200'>
                                    MongoDB
                                  </span>
                                </div>
                              </div>

                              {/* Achievements */}
                              <div className='bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-sm mb-3 text-emerald-800'>
                                  🏆 Recent Achievements
                                </h3>
                                <div className='space-y-2'>
                                  <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-xs text-emerald-700'>
                                      Completed 25+ Projects
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-xs text-emerald-700'>
                                      5-Star Rating Average
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-xs text-emerald-700'>
                                      Top 10% Developer
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Experience Level */}
                              <div className='bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-3 text-center shadow-sm'>
                                <div className='text-lg font-bold text-emerald-800 mb-1'>
                                  3+ Years
                                </div>
                                <div className='text-xs text-emerald-600'>
                                  Professional Experience
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Portfolio Stats - Blue Gradient */}
                      <FadeInUp delay={1.3}>
                        <div className='group relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-2xl p-5 shadow-lg overflow-hidden h-full border border-blue-200/50'>
                          {/* Background Pattern */}
                          <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
                          <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16'></div>
                          <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() => {
                                setEditingField("stats");
                                setShowEditModal(true);
                                setEditingPortfolio({
                                  field: "stats",
                                  title: "Edit Portfolio Stats",
                                  data: portfolio?.stats || {},
                                });
                              }}
                              className='w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all duration-200 border border-blue-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-blue-700' />
                            </button>
                          </div>

                          {/* Content */}
                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-300/30'>
                                <TrendingUp
                                  size={24}
                                  className='text-blue-700'
                                />
                              </div>
                              <h2 className='text-2xl font-bold text-blue-800'>
                                Portfolio Stats
                              </h2>
                            </div>

                            <div className='space-y-6'>
                              {/* Main Stat */}
                              <div className='text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-sm'>
                                <div className='text-5xl font-black text-blue-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                                  15K+
                                </div>
                                <div className='text-xl font-bold text-blue-700 mb-2'>
                                  Profile Views
                                </div>
                                <div className='text-sm text-blue-600 font-medium'>
                                  🚀 Featured Projects
                                </div>
                              </div>

                              {/* Secondary Stats */}
                              <div className='grid grid-cols-2 gap-4'>
                                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm'>
                                  <div className='text-2xl font-bold text-blue-800 mb-1'>
                                    98%
                                  </div>
                                  <div className='text-xs text-blue-600'>
                                    Success Rate
                                  </div>
                                </div>
                                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm'>
                                  <div className='text-2xl font-bold text-blue-800 mb-1'>
                                    24/7
                                  </div>
                                  <div className='text-xs text-blue-600'>
                                    Available
                                  </div>
                                </div>
                              </div>

                              {/* Website Link */}
                              <div className='flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-3 hover:bg-blue-50 transition-all duration-300 shadow-sm'>
                                <svg
                                  className='w-5 h-5 text-emerald-600'
                                  fill='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                                </svg>
                                <span className='text-sm font-semibold text-blue-700'>
                                  www.fraijob.com/profile
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>
                    </div>
                  </>
                )}

                {/* Universal Edit Modal */}
                {showEditModal && (
                  <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-bold text-gray-800'>
                          {editingPortfolio.title}
                        </h3>
                        <button
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingField(null);
                            setEditingPortfolio({});
                          }}
                          className='w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'>
                          <svg
                            className='w-4 h-4 text-gray-600'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>

                      <div className='space-y-4'>
                        {editingPortfolio.field === "expertise" && (
                          <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Frontend Development (%)
                            </label>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempData.frontendSkill || 90}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  frontendSkill: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Backend Development (%)
                            </label>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempData.backendSkill || 85}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  backendSkill: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              UI/UX Design (%)
                            </label>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempData.designSkill || 80}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  designSkill: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Mobile Development (%)
                            </label>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempData.mobileSkill || 75}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  mobileSkill: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                        )}

                        {editingPortfolio.field === "references" && (
                          <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Reference Name
                            </label>
                            <input
                              type='text'
                              value={tempData.referenceName || "John Smith"}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  referenceName: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Reference Name'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Position
                            </label>
                            <input
                              type='text'
                              value={
                                tempData.referencePosition || "Senior Developer"
                              }
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  referencePosition: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Position'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Company
                            </label>
                            <input
                              type='text'
                              value={tempData.referenceCompany || "TechCorp"}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  referenceCompany: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Company'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Contact
                            </label>
                            <input
                              type='text'
                              value={
                                tempData.referenceContact || "john@techcorp.com"
                              }
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  referenceContact: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Email or Phone'
                            />
                          </div>
                        )}

                        {editingPortfolio.field === "achievements" && (
                          <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Achievement Title
                            </label>
                            <input
                              type='text'
                              value={
                                tempData.achievementTitle ||
                                "Best Developer Award"
                              }
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  achievementTitle: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Achievement Title'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Description
                            </label>
                            <textarea
                              value={
                                tempData.achievementDescription ||
                                "Recognized for outstanding performance in web development"
                              }
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  achievementDescription: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                              placeholder='Achievement Description'
                              rows={3}
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Year
                            </label>
                            <input
                              type='text'
                              value={tempData.achievementYear || "2024"}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  achievementYear: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Year'
                            />
                          </div>
                        )}

                        {editingPortfolio.field === "stats" && (
                          <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Projects Completed
                            </label>
                            <input
                              type='number'
                              value={tempData.projectsCompleted || 25}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  projectsCompleted: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Happy Clients
                            </label>
                            <input
                              type='number'
                              value={tempData.happyClients || 15}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  happyClients: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Years Experience
                            </label>
                            <input
                              type='number'
                              value={tempData.yearsExperience || 3}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  yearsExperience: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Awards Won
                            </label>
                            <input
                              type='number'
                              value={tempData.awardsWon || 5}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  awardsWon: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                        )}
                      </div>

                      <div className='flex gap-3 mt-6'>
                        <button
                          onClick={() => {
                            handleQuickSave(editingPortfolio.field);
                            setShowEditModal(false);
                          }}
                          className='flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium'>
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingField(null);
                            setEditingPortfolio({});
                            setTempData({});
                          }}
                          className='flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium'>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {active === "Jobs" && (
              <motion.div
                key='jobs'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-4 max-w-5xl mx-auto p-4 md:p-6'>
                
                {/* Compact Header Section */}
                <div className='bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/40 shadow-lg'>
                  <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center border border-white/40 shadow-md'>
                          <Briefcase className='w-5 h-5 text-white' />
                        </div>
                        <div>
                          <h1 className='text-xl md:text-2xl font-bold text-gray-800'>
                            Job Opportunities
                          </h1>
                          <p className='text-gray-600 text-sm md:text-base'>
                            Discover your next career move
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-wrap items-center gap-2 mt-3'>
                        <div className='flex items-center gap-2 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/50'>
                          <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                          <span className='text-xs md:text-sm font-medium text-emerald-700'>
                            {jobs.length} Active Jobs
                          </span>
                        </div>
                        <div className='flex items-center gap-2 bg-blue-50/80 px-2.5 py-1.5 rounded-lg border border-blue-200/50'>
                          <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                          <span className='text-xs md:text-sm font-medium text-blue-700'>
                            {jobApplications.length} Applications
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <button
                        onClick={() => setShowApplications(!showApplications)}
                        className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 text-sm ${
                          showApplications
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                            : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 border border-gray-200/50"
                        }`}>
                        <Briefcase className='w-4 h-4' />
                        <span className='hidden sm:inline'>
                          {showApplications ? "Browse Jobs" : "My Applications"}
                        </span>
                        <span className='sm:hidden'>
                          {showApplications ? "Jobs" : "Apps"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {showApplications ? (
                  // Enhanced Job Applications View
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2'>
                        <div className='w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
                          <span className='text-white font-bold text-xs'>
                            {jobApplications.length}
                          </span>
                        </div>
                        My Applications
                      </h2>
                    </div>

                    {jobApplications.length === 0 ? (
                      <div className='text-center py-8 md:py-12 bg-gray-50/80 rounded-xl border border-gray-200/50'>
                        <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Briefcase className='w-8 h-8 text-gray-600' />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>
                          No Applications Yet
                        </h3>
                        <p className='text-gray-600 mb-4 max-w-sm mx-auto text-sm'>
                          Start applying for jobs to track your applications and
                          progress here
                        </p>
                        <button
                          onClick={() => setShowApplications(false)}
                          className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm'>
                          Browse Available Jobs
                        </button>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {jobApplications.map((application, index) => (
                          <FadeInUp key={application.id} delay={index * 0.1}>
                            <div className='group bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] overflow-hidden relative'>
                              {/* Status Indicator Bar */}
                              <div
                                className={`absolute top-0 left-0 right-0 h-1 ${
                                  application.status === "Applied"
                                    ? "bg-blue-500"
                                    : application.status === "Interview"
                                      ? "bg-green-500"
                                      : application.status === "Rejected"
                                        ? "bg-red-500"
                                        : application.status === "Accepted"
                                          ? "bg-emerald-500"
                                          : "bg-gray-400"
                                }`}></div>

                              <div className='space-y-4'>
                                <div className='flex items-start justify-between'>
                                  <div className='flex-1'>
                                    <h3 className='text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors'>
                                      {application.job.title}
                                    </h3>
                                    <div className='flex items-center gap-2 mb-3'>
                                      <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                        <svg
                                          className='w-4 h-4 text-blue-600'
                                          fill='none'
                                          stroke='currentColor'
                                          viewBox='0 0 24 24'>
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                                          />
                                        </svg>
                                      </div>
                                      <span className='text-gray-700 font-medium'>
                                        {application.job.company}
                                      </span>
                                    </div>
                                  </div>

                                  <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                                      application.status === "Applied"
                                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                                        : application.status === "Interview"
                                          ? "bg-green-100 text-green-700 border border-green-200"
                                          : application.status === "Rejected"
                                            ? "bg-red-100 text-red-700 border border-red-200"
                                            : application.status === "Accepted"
                                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                              : "bg-gray-100 text-gray-700 border border-gray-200"
                                    }`}>
                                    {application.status}
                                  </span>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <svg
                                      className='w-4 h-4 text-gray-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                                      />
                                    </svg>
                                    <span>{application.job.salary}</span>
                                  </div>
                                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <svg
                                      className='w-4 h-4 text-gray-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                      />
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                      />
                                    </svg>
                                    <span>{application.job.location}</span>
                                  </div>
                                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <svg
                                      className='w-4 h-4 text-gray-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.815-8.742-2.2M21 13.255v5.255A2.255 2.255 0 0118.745 21H5.255A2.255 2.255 0 013 18.495V13.255m0 0A23.931 23.931 0 0112 15c3.183 0 6.22-.815 8.742-2.2M21 13.255A23.931 23.931 0 0012 15c-3.183 0-6.22-.815-8.742-2.2'
                                      />
                                    </svg>
                                    <span>{application.job.type}</span>
                                  </div>
                                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <svg
                                      className='w-4 h-4 text-gray-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                      />
                                    </svg>
                                    <span>
                                      Applied:{" "}
                                      {new Date(
                                        application.appliedAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FadeInUp>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Available Jobs View
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3'>
                        <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center'>
                          <span className='text-white font-bold text-sm'>
                            {jobs.length}
                          </span>
                        </div>
                        Available Positions
                      </h2>

                      {/* Search and Filter Bar */}
                      <div className='flex items-center gap-3'>
                        <div className='relative'>
                          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                          <input
                            type='text'
                            placeholder='Search jobs...'
                            className='pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 md:w-64'
                          />
                        </div>
                      </div>
                    </div>
                    {loadingJobs ? (
                      <div className='flex items-center justify-center py-20'>
                        <div className='text-center'>
                          <div className='animate-spin w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full mx-auto mb-4'></div>
                          <p className='text-gray-600 font-medium'>
                            Loading opportunities...
                          </p>
                        </div>
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className='text-center py-16 bg-gray-50 rounded-2xl border border-gray-200'>
                        <div className='w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6'>
                          <Briefcase className='w-10 h-10 text-gray-600' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-800 mb-2'>
                          No Jobs Available Right Now
                        </h3>
                        <p className='text-gray-600 mb-4 max-w-md mx-auto'>
                          Don't worry! New opportunities are added regularly.
                          Check back soon for exciting positions.
                        </p>
                        <div className='flex items-center justify-center gap-2 text-sm text-gray-500'>
                          <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
                          <span>We'll notify you when new jobs arrive</span>
                        </div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {jobs.map((job, index) => (
                          <FadeInUp key={job.id} delay={index * 0.1}>
                            <div className='group bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 overflow-hidden'>
                              {/* Job Type Badge */}
                              <div className='px-3 py-2.5 border-b border-gray-100/50 bg-gray-50/80'>
                                <div className='flex items-center justify-between'>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      job.type === "Full-time"
                                        ? "bg-blue-100 text-blue-800"
                                        : job.type === "Part-time"
                                          ? "bg-green-100 text-green-800"
                                          : job.type === "Contract"
                                            ? "bg-purple-100 text-purple-800"
                                            : job.type === "Remote"
                                              ? "bg-orange-100 text-orange-800"
                                              : "bg-gray-100 text-gray-800"
                                    }`}>
                                    {job.type}
                                  </span>
                                  {job.type === "Full-time" && (
                                    <span className='text-xs text-gray-500 flex items-center gap-1'>
                                      <span className='w-1.5 h-1.5 bg-yellow-400 rounded-full'></span>
                                      Premium
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className='p-3'>
                                <div className='space-y-2.5'>
                                  {/* Job Title & Company */}
                                  <div>
                                    <h3 className='text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1'>
                                      {job.title}
                                    </h3>
                                    <div className='flex items-center gap-2'>
                                      <div className='w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                        <svg
                                          className='w-2.5 h-2.5 text-gray-600'
                                          fill='none'
                                          stroke='currentColor'
                                          viewBox='0 0 24 24'>
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                                          />
                                        </svg>
                                      </div>
                                      <span className='text-gray-700 font-medium text-xs'>
                                        {job.company}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Job Details */}
                                  <div className='grid grid-cols-2 gap-2'>
                                    <div className='flex items-center gap-1.5 text-xs'>
                                      <svg
                                        className='w-3.5 h-3.5 text-gray-400'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                                        />
                                      </svg>
                                      <span className='text-gray-700 font-medium'>
                                        {job.salary}
                                      </span>
                                    </div>

                                    <div className='flex items-center gap-1.5 text-xs'>
                                      <svg
                                        className='w-3.5 h-3.5 text-gray-400'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                        />
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                        />
                                      </svg>
                                      <span className='text-gray-700 font-medium'>
                                        {job.location}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Job Description */}
                                  {job.description && (
                                    <div className='bg-gray-50 rounded-lg p-3 border border-gray-100'>
                                      <p className='text-sm text-gray-600 leading-relaxed'>
                                        {job.description}
                                      </p>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className='flex items-center gap-3 pt-2'>
                                    <button
                                      onClick={async () => {
                                        try {
                                          const token =
                                            localStorage.getItem("token");
                                          const response = await fetch(
                                            "/api/jobs",
                                            {
                                              method: "POST",
                                              headers: {
                                                "Content-Type":
                                                  "application/json",
                                                Authorization: `Bearer ${token}`,
                                              },
                                              body: JSON.stringify({
                                                jobId: job.id,
                                                coverLetter:
                                                  "I'm interested in this position and would love to discuss how I can contribute to your team.",
                                              }),
                                            }
                                          );

                                          if (response.ok) {
                                            const result =
                                              await response.json();
                                            setNotifications((prev) => [
                                              ...prev,
                                              {
                                                id: Date.now(),
                                                type: "success",
                                                message:
                                                  "Job application submitted successfully!",
                                                time: "Just now",
                                              },
                                            ]);

                                            const applicationsResponse =
                                              await fetch(
                                                "/api/job-applications",
                                                {
                                                  headers: {
                                                    Authorization: `Bearer ${token}`,
                                                  },
                                                }
                                              );
                                            if (applicationsResponse.ok) {
                                              const applicationsData =
                                                await applicationsResponse.json();
                                              setJobApplications(
                                                applicationsData
                                              );
                                            }
                                          } else {
                                            const error = await response.json();
                                            setNotifications((prev) => [
                                              ...prev,
                                              {
                                                id: Date.now(),
                                                type: "error",
                                                message:
                                                  error.error ||
                                                  "Failed to apply for job",
                                                time: "Just now",
                                              },
                                            ]);
                                          }
                                        } catch (error) {
                                          console.error(
                                            "Error applying for job:",
                                            error
                                          );
                                          setNotifications((prev) => [
                                            ...prev,
                                            {
                                              id: Date.now(),
                                              type: "error",
                                              message:
                                                "Failed to apply for job",
                                              time: "Just now",
                                            },
                                          ]);
                                        }
                                      }}
                                      className='flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2'>
                                      <Briefcase className='w-4 h-4' />
                                      Apply Now
                                    </button>

                                    <button className='p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-center'>
                                      <svg
                                        className='w-4 h-4'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FadeInUp>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {active === "Freelance" && (
              <motion.div
                key='freelance'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-4 max-w-5xl mx-auto p-4 md:p-6'>
                
                {/* Compact Freelance Projects Header */}
                <div className='bg-white/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/40 shadow-lg'>
                  <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center border border-white/40 shadow-md'>
                          <Users className='w-5 h-5 text-white' />
                        </div>
                        <div>
                          <h1 className='text-xl md:text-2xl font-bold text-gray-800'>
                            Freelance Projects
                          </h1>
                          <p className='text-gray-600 text-sm md:text-base'>
                            Find your next freelance opportunity
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-wrap items-center gap-2 mt-3'>
                        <div className='flex items-center gap-2 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/50'>
                          <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                          <span className='text-xs md:text-sm font-medium text-emerald-700'>
                            {projects.length} Active Projects
                          </span>
                        </div>
                        <div className='flex items-center gap-2 bg-blue-50/80 px-2.5 py-1.5 rounded-lg border border-blue-200/50'>
                          <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                          <span className='text-xs md:text-sm font-medium text-blue-700'>
                            {projectProposals.length} My Proposals
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <button
                        onClick={() => setShowProposals(!showProposals)}
                        className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 text-sm ${
                          showProposals
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                            : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 border border-gray-200/50"
                        }`}>
                        <Users className='w-4 h-4' />
                        <span className='hidden sm:inline'>
                          {showProposals ? "Browse Projects" : "My Proposals"}
                        </span>
                        <span className='sm:hidden'>
                          {showProposals ? "Projects" : "Proposals"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {showProposals ? (
                  // Project Proposals View
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2'>
                        <div className='w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
                          <span className='text-white font-bold text-xs'>
                            {projectProposals.length}
                          </span>
                        </div>
                        My Project Proposals
                      </h2>
                    </div>

                    {projectProposals.length === 0 ? (
                      <div className='text-center py-8 md:py-12 bg-gray-50/80 rounded-xl border border-gray-200/50'>
                        <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Users className='w-8 h-8 text-gray-600' />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>
                          No Proposals Submitted Yet
                        </h3>
                        <p className='text-gray-600 mb-4 max-w-sm mx-auto text-sm'>
                          Start submitting proposals to projects to track your
                          applications and progress here
                        </p>
                        <button
                          onClick={() => setShowProposals(false)}
                          className='bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm'>
                          Browse Available Projects
                        </button>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {projectProposals.map((proposal, index) => (
                          <FadeInUp key={proposal.id} delay={index * 0.1}>
                            <div className='group bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300 overflow-hidden'>
                              {/* Status Badge */}
                              <div className='px-3 py-2.5 border-b border-gray-100/50 bg-gray-50/80'>
                                <div className='flex items-center justify-between'>
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      proposal.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : proposal.status === "accepted"
                                          ? "bg-green-100 text-green-800"
                                          : proposal.status === "rejected"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}>
                                    {proposal.status.charAt(0).toUpperCase() +
                                      proposal.status.slice(1)}
                                  </span>
                                  <span className='text-xs text-gray-500'>
                                    {new Date(
                                      proposal.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className='p-3'>
                                <div className='space-y-2.5'>
                                  {/* Project Title & Client */}
                                  <div>
                                    <h3 className='text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1'>
                                      {proposal.project.title}
                                    </h3>
                                    <div className='flex items-center gap-2'>
                                      <div className='w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                        <svg
                                          className='w-2.5 h-2.5 text-gray-600'
                                          fill='none'
                                          stroke='currentColor'
                                          viewBox='0 0 24 24'>
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                          />
                                        </svg>
                                      </div>
                                      <span className='text-gray-700 font-medium text-xs'>
                                        {proposal.project.client.name ||
                                          proposal.project.client.email}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Proposal Details */}
                                  <div className='grid grid-cols-2 gap-2'>
                                    <div className='flex items-center gap-1.5 text-xs'>
                                      <svg
                                        className='w-3.5 h-3.5 text-gray-400'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                                        />
                                      </svg>
                                      <span className='text-gray-700 font-medium'>
                                        ${proposal.proposedBudget}
                                      </span>
                                    </div>

                                    <div className='flex items-center gap-1.5 text-xs'>
                                      <svg
                                        className='w-3.5 h-3.5 text-gray-400'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                        />
                                      </svg>
                                      <span className='text-gray-700 font-medium'>
                                        {proposal.deliveryTime}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Project Category */}
                                  <div className='flex items-center gap-1.5 text-xs'>
                                    <svg
                                      className='w-3.5 h-3.5 text-gray-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                                      />
                                    </svg>
                                    <span className='text-gray-700 font-medium'>
                                      {proposal.project.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FadeInUp>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Available Projects View
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2'>
                        <div className='w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center'>
                          <span className='text-white font-bold text-xs'>
                            {projects.length}
                          </span>
                        </div>
                        Available Projects
                      </h2>
                    </div>

                    {loadingProjects ? (
                      <div className='flex items-center justify-center py-12'>
                        <div className='text-center'>
                          <div className='animate-spin w-10 h-10 border-4 border-gray-400 border-t-transparent rounded-full mx-auto mb-3'></div>
                          <p className='text-gray-600 font-medium text-sm'>
                            Loading projects...
                          </p>
                        </div>
                      </div>
                    ) : projects.length === 0 ? (
                      <div className='text-center py-8 md:py-12 bg-gray-50/80 rounded-xl border border-gray-200/50'>
                        <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Users className='w-8 h-8 text-gray-600' />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>
                          No Projects Available Right Now
                        </h3>
                        <p className='text-gray-600 mb-4 max-w-sm mx-auto text-sm'>
                          Don't worry! New freelance projects are added
                          regularly. Check back soon for exciting opportunities.
                        </p>
                        <div className='flex items-center justify-center gap-2 text-xs text-gray-500'>
                          <div className='w-1.5 h-1.5 bg-gray-400 rounded-full'></div>
                          <span>We'll notify you when new projects arrive</span>
                        </div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {projects.map((project, index) => (
                          <FadeInUp key={project.id} delay={index * 0.1}>
                            <div className='group bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden'>
                              {/* Card Header */}
                              <div className='flex items-center justify-between px-3 py-2.5 border-b border-gray-100/50 bg-gray-50/80'>
                                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200'>
                                  {project.category}
                                </span>
                                <span className='flex items-center gap-1 text-xs text-gray-500'>
                                  <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0z'
                                    />
                                  </svg>
                                  {project._count?.proposals || 0}
                                </span>
                              </div>
                              {/* Card Body */}
                              <div className='p-3 space-y-2.5'>
                                {/* Title & Client */}
                                <div>
                                  <h3 className='text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1'>
                                    {project.title}
                                  </h3>
                                  <div className='flex items-center gap-2 mb-2'>
                                    <svg
                                      className='w-3.5 h-3.5 text-gray-400'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                      />
                                    </svg>
                                    <span className='text-gray-700 text-xs'>
                                      {project.client.name ||
                                        project.client.email}
                                    </span>
                                  </div>
                                </div>
                                {/* Info Grid */}
                                <div className='grid grid-cols-2 gap-3'>
                                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <svg
                                      className='w-4 h-4'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                                      />
                                    </svg>
                                    <span>{project.budget}</span>
                                  </div>
                                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                                    <svg
                                      className='w-4 h-4'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'>
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                      />
                                    </svg>
                                    <span>{project.duration}</span>
                                  </div>
                                </div>
                                {/* Description */}
                                <div className='bg-gray-50 rounded-lg p-3 border border-gray-100'>
                                  <p className='text-sm text-gray-600 leading-relaxed line-clamp-2'>
                                    {project.description}
                                  </p>
                                </div>
                                {/* Skills */}
                                {project.skills &&
                                  project.skills.length > 0 && (
                                    <div className='flex flex-wrap gap-2'>
                                      {project.skills
                                        .slice(0, 4)
                                        .map((skill, skillIndex) => (
                                          <span
                                            key={skillIndex}
                                            className='px-2 py-1 bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded'>
                                            {skill}
                                          </span>
                                        ))}
                                      {project.skills.length > 4 && (
                                        <span className='px-2 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded'>
                                          +{project.skills.length - 4} more
                                        </span>
                                      )}
                                    </div>
                                  )}
                                {/* Posted Date */}
                                <div className='flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100'>
                                  <svg
                                    className='w-3 h-3'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                    />
                                  </svg>
                                  <span>
                                    Posted{" "}
                                    {new Date(
                                      project.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </FadeInUp>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {active === "Test" && (
              <CareerAssessmentTest
                onTestCompleted={() => {
                  // Handle test completion
                }}
                setNotifications={setNotifications}
              />
            )}

            {active === "Frai AI" && (
              <motion.div
                key='frai-ai'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-4 max-w-3xl mx-auto p-4 md:p-6'>
                
                {/* Compact Header */}
                <div className='text-center mb-6'>
                  <FadeInUp delay={0.1}>
                    <div className='relative mb-4'>
                      {/* Smaller Animated Background */}
                      <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-2xl'></div>

                      {/* Smaller Main Icon */}
                      <div className='relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl'>
                        <Bot className='w-10 h-10 md:w-12 md:h-12 text-white' />

                        {/* Smaller Animated Rings */}
                        <div className='absolute inset-0 border-2 border-blue-300/30 rounded-full animate-ping'></div>
                        <div className='absolute inset-0 border-2 border-purple-300/30 rounded-full animate-pulse'></div>
                      </div>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={0.2}>
                    <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>
                      Frai AI
                    </h2>
                    <p className='text-base md:text-lg text-gray-600 mb-4 max-w-xl mx-auto'>
                      Your intelligent coding companion is coming soon
                    </p>
                  </FadeInUp>
                </div>

                <FadeInUp delay={0.3}>
                  <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/30 shadow-xl max-w-lg mx-auto'>
                    <div className='flex items-center justify-center gap-2 mb-4'>
                      <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></div>
                      <span className='text-sm font-semibold text-yellow-700'>
                        Coming Soon
                      </span>
                      <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></div>
                    </div>

                    <p className='text-gray-700 text-sm md:text-base leading-relaxed mb-4 text-center'>
                      We're working hard to bring you an amazing AI-powered
                      coding assistant. Get ready for intelligent code
                      suggestions, debugging help, and much more!
                    </p>

                    {/* Compact Progress Bar */}
                    <div className='mb-4'>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='text-xs font-medium text-gray-600'>
                          Progress
                        </span>
                        <span className='text-xs font-medium text-gray-600'>
                          75%
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out'
                          style={{ width: "75%" }}></div>
                      </div>
                    </div>

                    {/* Smaller Notify Button */}
                    <button className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-6 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
                      🔔 Notify Me When Ready
                    </button>
                  </div>
                </FadeInUp>
              </motion.div>
            )}

            {active === "Chats" && (
              <motion.div
                key='chats'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='h-full flex flex-col lg:flex-row gap-4 lg:gap-2'>
                {/* Left Sidebar - Community Groups */}
                <div className='hidden lg:flex w-80 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl flex-col h-full'>
                  <div className='p-6 border-b border-gray-100/50'>
                    <div className='mb-4'>
                      <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                        Community
                      </h2>
                    </div>
                    <p className='text-sm text-gray-600 leading-relaxed'>
                      Join groups to connect with other professionals and share
                      knowledge
                    </p>
                  </div>

                  {/* Groups List */}
                  <div className='flex-1 overflow-y-auto p-6'>
                    <div className='space-y-4'>
                      {[
                        {
                          name: "General",
                          members: userCount,
                          active: true,
                          avatar: "G",
                          description: "Main community chat",
                          unread: 0,
                        },
                      ].map((group, index) => (
                        <motion.div
                          key={group.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                            group.active
                              ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg"
                              : "hover:bg-gray-50/80 border-gray-100 hover:border-gray-200 hover:shadow-md"
                          }`}>
                          <div className='relative flex-shrink-0'>
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md ${
                                group.active
                                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                  : "bg-gradient-to-br from-gray-500 to-gray-600"
                              }`}>
                              {group.avatar}
                            </div>
                            {group.active && (
                              <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center'>
                                <div className='w-2 h-2 bg-white rounded-full'></div>
                              </div>
                            )}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between mb-1'>
                              <h4 className='font-semibold text-gray-800 text-sm truncate'>
                                {group.name}
                              </h4>
                              {group.unread > 0 && (
                                <div className='bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>
                                  {group.unread}
                                </div>
                              )}
                            </div>
                            <p className='text-xs text-gray-500 mb-1 truncate'>
                              {group.description}
                            </p>
                            <div className='flex items-center gap-2'>
                              <div className='flex -space-x-2'>
                                {[...Array(Math.min(group.members, 5))].map(
                                  (_, i) => (
                                    <div
                                      key={i}
                                      className='w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-1.5 border-white flex items-center justify-center'>
                                      <span className='text-xs text-white font-medium'>
                                        {String.fromCharCode(65 + i)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                              <span className='text-xs text-gray-400'>
                                {group.members} members
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Chat Area */}
                <div className='flex-1 flex flex-col lg:flex-row gap-2 overflow-hidden'>
                  {/* Chat Container */}
                  <div className='flex-1 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg flex flex-col h-[calc(100vh-200px)] lg:h-[600px] overflow-hidden position-relative'>
                    {/* Chat Header */}
                    <div className='flex items-center justify-between p-4 border-b border-gray-100/50 flex-shrink-0'>
                      <div className='flex items-center gap-3'>
                        <div className='relative'>
                          <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md'>
                            G
                          </div>
                          <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-1.5 border-white flex items-center justify-center'>
                            <div className='w-1.5 h-1.5 bg-white rounded-full'></div>
                          </div>
                        </div>
                        <div>
                          <h3 className='text-lg font-bold text-gray-800'>
                            General
                          </h3>
                          <div className='flex items-center gap-1.5'>
                            <div className='w-1.5 h-1.5 bg-green-500 rounded-full'></div>
                            <p className='text-xs text-gray-500'>
                              {chatMessages.length > 0
                                ? `${chatMessages.length} messages`
                                : "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-1'>
                        {/* Scroll to bottom button - only show when there are many messages */}
                        {chatMessages.length > 15 && (
                          <button 
                            onClick={scrollToBottom}
                            className='p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group bg-emerald-50 hover:bg-emerald-100'
                            title="Scroll to bottom"
                          >
                            <ChevronDown className='w-4 h-4 text-emerald-600 group-hover:text-emerald-800' />
                          </button>
                        )}
                        <button className='p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group'>
                          <Search className='w-4 h-4 text-gray-600 group-hover:text-gray-800' />
                        </button>
                        <button className='p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group'>
                          <Settings className='w-4 h-4 text-gray-600 group-hover:text-gray-800' />
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div
                      className='flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 max-h-full relative'
                      style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", height: "100%", position: "relative" }}
                      onScroll={(e) => {
                        const { scrollTop, scrollHeight, clientHeight } = e.target;
                        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
                        setShowScrollButton(!isNearBottom);
                      }}>
                      
                      {/* Floating scroll to bottom button */}
                      {showScrollButton && (
                        <button
                          onClick={scrollToBottom}
                          className='absolute bottom-4 right-4 z-10 p-3 md:p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-80 hover:opacity-100 touch-manipulation'
                          title="Scroll to bottom"
                        >
                          <ChevronDown className='w-4 h-4' />
                        </button>
                      )}

                      {chatMessages.length === 0 ? (
                        <div className='text-center py-12'>
                          <div className='w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md'>
                            <MessagesSquare className='w-6 h-6 text-white' />
                          </div>
                          <h3 className='text-lg font-bold text-gray-800 mb-0.5'>
                            Welcome to General!
                          </h3>
                          <p className='text-gray-500 text-sm mb-3'>
                            Start chatting with the community
                          </p>
                          <div className='flex items-center justify-center gap-2 text-xs text-gray-400'>
                            <div className='flex items-center gap-1.5'>
                              <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                              <span>{userCount} members online</span>
                            </div>
                            <div className='w-px h-2.5 bg-gray-200'></div>
                            <div className='flex items-center gap-1.5'>
                              <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                              <span>Real-time messaging</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: deletingMessages.has(msg.id) ? 0 : 1,
                              y: deletingMessages.has(msg.id) ? -20 : 0,
                              scale: deletingMessages.has(msg.id) ? 0.95 : 1,
                            }}
                            transition={{
                              delay: deletingMessages.has(msg.id)
                                ? 0
                                : index * 0.05,
                              duration: deletingMessages.has(msg.id)
                                ? 0.2
                                : 0.3,
                            }}
                            className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}>
                            <div className='flex items-start gap-2 max-w-[75%] group'>
                              {msg.userId !== user?.id && (
                                <div className='relative flex-shrink-0'>
                                  <div className='w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-[10px] shadow-sm'>
                                    {msg.user?.name?.[0]?.toUpperCase() ||
                                      msg.userName?.[0]?.toUpperCase() ||
                                      "U"}
                                  </div>
                                  <div className='absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white'></div>
                                </div>
                              )}
                              <div className='flex-1 relative min-h-[40px]'>
                                <div className='flex items-center gap-2 mb-1'>
                                  {msg.userId !== user?.id && (
                                    <span className='font-semibold text-gray-800 text-xs'>
                                      {msg.user?.name || msg.userName}
                                    </span>
                                  )}
                                  <span className='text-[10px] text-gray-400'>
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </span>
                                  {msg.updatedAt &&
                                    msg.updatedAt !== msg.createdAt && (
                                      <span className='text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full'>
                                        edited
                                      </span>
                                    )}
                                </div>

                                <div
                                  data-message-id={msg.id}
                                  className={`message-container px-4 py-3 pr-14 md:pr-16 mt-8 md:mt-1.5 text-xs break-words word-wrap overflow-wrap-anywhere border shadow-md rounded-2xl relative group/message hover:shadow-lg transition-all duration-300 max-w-full ${
                                    msg.userId === user?.id
                                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400"
                                      : "bg-white/90 text-gray-900 border-gray-200 hover:border-gray-300"
                                  }`}
                                  style={{
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    hyphens: "auto",
                                  }}>
                                  {/* Reply indicator */}
                                  {msg.replyTo && (
                                    <div
                                      className={`mb-2 p-1.5 md:p-2 rounded-lg md:rounded-xl border-l-2 md:border-l-3 ${
                                        msg.userId === user?.id
                                          ? "bg-white/20 border-white/50"
                                          : "bg-gray-50/80 border-gray-300"
                                      }`}>
                                      <div className='flex items-center gap-1 md:gap-1.5 mb-1 md:mb-0.5'>
                                        <Reply
                                          className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                                            msg.userId === user?.id
                                              ? "text-white/70"
                                              : "text-gray-500"
                                          }`}
                                        />
                                        <span
                                          className={`text-[9px] md:text-[10px] font-semibold ${
                                            msg.userId === user?.id
                                              ? "text-white/70"
                                              : "text-gray-500"
                                          }`}>
                                          Replying to{" "}
                                          {msg.replyTo.user?.name || "Unknown"}
                                        </span>
                                      </div>
                                      <div className='max-w-full'>
                                        <p
                                          className={`text-[9px] md:text-[10px] line-clamp-2 leading-tight ${
                                            msg.userId === user?.id
                                              ? "text-white/60"
                                              : "text-gray-400"
                                          }`}>
                                          {msg.replyTo.message.length > 80 
                                            ? `${msg.replyTo.message.substring(0, 80)}...` 
                                            : msg.replyTo.message
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  <div className='leading-relaxed'>
                                    {msg.message}
                                  </div>

                                  {/* Message actions - Outside message on mobile, inside on desktop */}
                                  {editingMessage !== msg.id && (
                                    <div className='absolute -top-6 right-0 md:-top-1 md:right-1.5 opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-all duration-300 transform scale-95 z-10'>
                                      <div className='flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 p-1 md:p-0.5 md:bg-white/80'>
                                        {/* Reply button for all messages */}
                                        <button
                                          onClick={() =>
                                            handleReplyMessage(msg)
                                          }
                                          className='p-1.5 md:p-1 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-gray-600'
                                          title='Reply to message'>
                                          <Reply className='w-3 h-3 md:w-2.5 md:h-2.5' />
                                        </button>

                                        {/* Edit and Delete only for own messages */}
                                        {msg.userId === user?.id && (
                                          <>
                                            <div className='w-px h-5 bg-gray-200'></div>
                                            <button
                                              onClick={() =>
                                                handleEditMessage(
                                                  msg.id,
                                                  msg.message
                                                )
                                              }
                                              disabled={
                                                deletingMessages.has(msg.id) ||
                                                editingMessage !== null
                                              }
                                              className={`p-2 md:p-1.5 rounded-lg transition-all duration-200 ${
                                                deletingMessages.has(msg.id) ||
                                                editingMessage !== null
                                                  ? "text-gray-400 cursor-not-allowed"
                                                  : "hover:bg-blue-50 hover:text-blue-600 text-gray-600"
                                              }`}
                                              title={
                                                deletingMessages.has(msg.id)
                                                  ? "Cannot edit while deleting"
                                                  : editingMessage !== null
                                                    ? "Finish editing current message first"
                                                    : "Edit message"
                                              }>
                                              <Edit className='w-4 h-4 md:w-3.5 md:h-3.5' />
                                            </button>
                                            <div className='w-px h-5 bg-gray-200'></div>
                                            <button
                                              onClick={() =>
                                                handleDeleteMessage(msg.id)
                                              }
                                              disabled={
                                                deletingMessages.has(msg.id) ||
                                                editingMessage !== null
                                              }
                                              className={`p-2 md:p-1.5 rounded-lg transition-all duration-200 ${
                                                deletingMessages.has(msg.id)
                                                  ? "bg-red-100 text-red-500 cursor-not-allowed"
                                                  : editingMessage !== null
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "hover:bg-red-50 hover:text-red-600 text-gray-600"
                                              }`}
                                              title={
                                                deletingMessages.has(msg.id)
                                                  ? "Deleting..."
                                                  : editingMessage !== null
                                                    ? "Finish editing current message first"
                                                    : "Delete message"
                                              }>
                                              {deletingMessages.has(msg.id) ? (
                                                <div className='w-4 h-4 md:w-3.5 md:h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin'></div>
                                              ) : (
                                                <Trash2 className='w-4 h-4 md:w-3.5 md:h-3.5' />
                                              )}
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}

                      {/* Typing indicator */}
                      {typingUsers.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='flex justify-start'>
                          <div className='flex items-center gap-3 px-6 py-4 bg-gray-100/80 rounded-3xl border border-gray-200'>
                            <div className='flex space-x-1'>
                              <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                              <div
                                className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                                style={{ animationDelay: "0.1s" }}></div>
                              <div
                                className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                                style={{ animationDelay: "0.2s" }}></div>
                            </div>
                            <span className='text-sm text-gray-600 font-medium'>
                              {typingUsers.map((u) => u.userName).join(", ")}{" "}
                              typing...
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Scroll anchor */}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className='border-t border-gray-100/50 flex-shrink-0'>
                      {/* Reply Preview */}
                      {replyingTo && (
                        <div className='px-3 md:px-6 pt-2 md:pt-4 pb-2'>
                          <div className='bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl md:rounded-2xl p-2.5 md:p-4 border-l-4 border-emerald-500'>
                            <div className='flex items-center justify-between mb-1.5 md:mb-2'>
                              <div className='flex items-center gap-1.5 md:gap-2'>
                                <Reply className='w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600' />
                                <span className='text-xs md:text-sm font-semibold text-gray-700'>
                                  Replying to{" "}
                                  {replyingTo.user?.name || replyingTo.userName}
                                </span>
                              </div>
                              <button
                                onClick={handleCancelReply}
                                className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100'>
                                <X className='w-3.5 h-3.5 md:w-4 md:h-4' />
                              </button>
                            </div>
                            <div className='max-w-full'>
                              <p className='text-xs md:text-sm text-gray-600 line-clamp-2 leading-tight'>
                                {replyingTo.message.length > 100 
                                  ? `${replyingTo.message.substring(0, 100)}...` 
                                  : replyingTo.message
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Edit Preview */}
                      {editingMessage && (
                        <div className='px-3 md:px-6 pt-2 md:pt-4 pb-2'>
                          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-2.5 md:p-4 border-l-4 border-blue-500'>
                            <div className='flex items-center justify-between mb-1.5 md:mb-2'>
                              <div className='flex items-center gap-1.5 md:gap-2'>
                                <Edit className='w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600' />
                                <span className='text-xs md:text-sm font-semibold text-gray-700'>
                                  Editing message
                                </span>
                              </div>
                              <button
                                onClick={handleCancelEdit}
                                className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100'>
                                <X className='w-3.5 h-3.5 md:w-4 md:h-4' />
                              </button>
                            </div>
                            <div className='max-w-full'>
                              <p className='text-xs md:text-sm text-gray-600 line-clamp-2 leading-tight'>
                                {editMessageText.length > 100 
                                  ? `${editMessageText.substring(0, 100)}...` 
                                  : editMessageText
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className='p-3 md:p-4 bg-white/90 backdrop-blur-sm flex-shrink-0'>
                        <form
                          onSubmit={handleSendMessage}
                          className='flex items-center gap-2 md:gap-3 max-w-full'>
                          <div className='flex-1 relative'>
                            <input
                              type='text'
                              value={
                                editingMessage ? editMessageText : newMessage
                              }
                              onChange={
                                editingMessage
                                  ? (e) => setEditMessageText(e.target.value)
                                  : handleInputChange
                              }
                              placeholder={
                                editingMessage
                                  ? "Edit message..."
                                  : replyingTo
                                    ? `Reply to ${replyingTo.user?.name || replyingTo.userName}...`
                                    : "Type a message..."
                              }
                              className='w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-200 rounded-lg md:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80 placeholder-gray-400'
                              disabled={sendingMessage}
                              onKeyPress={
                                editingMessage
                                  ? (e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSaveEdit();
                                      }
                                    }
                                  : undefined
                              }
                              onKeyDown={
                                editingMessage
                                  ? (e) => {
                                      if (e.key === "Escape") {
                                        e.preventDefault();
                                        handleCancelEdit();
                                      }
                                    }
                                  : undefined
                              }
                            />
                          </div>
                          <button
                            type={editingMessage ? "button" : "submit"}
                            onClick={
                              editingMessage ? handleSaveEdit : undefined
                            }
                            disabled={
                              editingMessage
                                ? !editMessageText.trim()
                                : !newMessage.trim() || sendingMessage
                            }
                            className='bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:from-emerald-600 hover:to-teal-700 w-[44px] md:w-[48px] h-[40px] md:h-[44px] flex items-center justify-center flex-shrink-0'>
                            {editingMessage ? (
                              <span className='text-sm font-medium'>Save</span>
                            ) : (
                              <Send className='w-4 h-4' />
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar - Group Info */}
                  <div className='hidden xl:flex w-96 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl flex-col h-full'>
                    <div className='p-4 md:p-6 border-b border-gray-100/50'>
                      <h3 className='text-lg md:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 md:mb-2'>
                        Group Information
                      </h3>
                      <p className='text-xs md:text-sm text-gray-600'>
                        Community details and guidelines
                      </p>
                    </div>

                    {/* Group Info */}
                    <div className='flex-1 p-4 md:p-6'>
                      <div className='space-y-4 md:space-y-6'>
                        {/* General Info */}
                        <div>
                          <h4 className='font-bold text-gray-800 mb-2 md:mb-3 text-base md:text-lg'>
                            About General
                          </h4>
                          <div className='bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-emerald-100'>
                            <p className='text-xs md:text-sm text-gray-700 leading-relaxed mb-2 md:mb-3'>
                              Welcome to our community! This is a space for all
                              professionals to connect, share knowledge, and
                              collaborate on projects. Feel free to introduce
                              yourself and start meaningful conversations.
                            </p>
                            <div className='flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-emerald-600 font-medium'>
                              <div className='w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full'></div>
                              <span>Open to all members</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div>
                          <h4 className='font-bold text-gray-800 mb-2 md:mb-3 text-base md:text-lg'>
                            Community Stats
                          </h4>
                          <div className='grid grid-cols-2 gap-2 md:gap-3'>
                            <div className='bg-white rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-gray-100 shadow-sm'>
                              <div className='text-lg md:text-xl font-bold text-emerald-600 mb-0.5 md:mb-1'>
                                {userCount}
                              </div>
                              <div className='text-xs md:text-sm text-gray-600'>
                                Total Members
                              </div>
                            </div>
                            <div className='bg-white rounded-xl md:rounded-2xl p-2.5 md:p-3 border border-gray-100 shadow-sm'>
                              <div className='text-lg md:text-xl font-bold text-blue-600 mb-0.5 md:mb-1'>
                                {chatMessages.length}
                              </div>
                              <div className='text-xs md:text-sm text-gray-600'>
                                Messages
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {active === "Settings" && (
              <motion.div
                key='settings'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-4 max-w-5xl mx-auto p-4 md:p-6'>
                
                {/* Header Section */}
                <div className='text-center mb-6'>
                  <div className='w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg'>
                    <Settings className='w-7 h-7 text-white' />
                  </div>
                  <h2 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2'>
                    Profile Settings
                  </h2>
                  <p className='text-gray-600 text-sm md:text-base'>
                    Manage your account settings and preferences
                  </p>
                </div>

                <FadeInUp>
                  <div className='max-w-4xl mx-auto'>
                    <div className='bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden'>
                      
                      {/* Profile Picture Section */}
                      <div className='bg-gradient-to-r from-emerald-50 to-teal-50 p-4 md:p-6 border-b border-emerald-100/50'>
                        <div className='flex flex-col md:flex-row items-center gap-4'>
                          <div className='relative'>
                            <div className='w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg'>
                              {profile.name ? profile.name[0]?.toUpperCase() : 'U'}
                            </div>
                            <button className='absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-lg hover:bg-emerald-50 transition-all duration-300'>
                              <Edit className='w-3 h-3 text-emerald-600' />
                            </button>
                          </div>
                          <div className='text-center md:text-left'>
                            <h3 className='text-lg md:text-xl font-bold text-gray-800 mb-1.5'>
                              {profile.name || 'Your Name'}
                            </h3>
                            <p className='text-gray-600 text-sm'>
                              {profile.email}
                            </p>
                            <div className='flex items-center gap-2 mt-2'>
                              <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full'></div>
                              <span className='text-xs text-emerald-600 font-medium'>Active</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form Section */}
                      <div className='p-4 md:p-6'>
                        <form onSubmit={handleProfileSave} className='space-y-4'>
                          
                          {/* Personal Information */}
                          <div className='space-y-3'>
                            <h4 className='text-base font-semibold text-gray-800 flex items-center gap-2'>
                              <User className='w-4 h-4 text-emerald-600' />
                              Personal Information
                            </h4>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                              <div className='space-y-1.5'>
                                <label className='block text-sm font-medium text-gray-700'>
                                  Full Name
                                </label>
                                <input
                                  type='text'
                                  name='name'
                                  value={profile.name}
                                  onChange={handleChange}
                                  className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80'
                                  placeholder='Enter your full name'
                                />
                              </div>
                              <div className='space-y-1.5'>
                                <label className='block text-sm font-medium text-gray-700'>
                                  Email
                                </label>
                                <input
                                  type='email'
                                  value={profile.email}
                                  disabled
                                  className='w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50/80 text-gray-500 cursor-not-allowed'
                                />
                              </div>
                            </div>
                          </div>

                          {/* Bio Section */}
                          <div className='space-y-1.5'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Bio
                            </label>
                            <textarea
                              name='bio'
                              value={profile.bio}
                              onChange={handleChange}
                              rows={3}
                              className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80 resize-none'
                              placeholder='Tell us about yourself...'
                            />
                          </div>

                          {/* Social Links */}
                          <div className='space-y-3'>
                            <h4 className='text-base font-semibold text-gray-800 flex items-center gap-2'>
                              <div className='w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                                <span className='text-white text-xs font-bold'>S</span>
                              </div>
                              Social Links
                            </h4>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                              <div className='space-y-1.5'>
                                <label className='block text-sm font-medium text-gray-700 flex items-center gap-2'>
                                  <div className='w-3.5 h-3.5 bg-gray-800 rounded'></div>
                                  GitHub
                                </label>
                                <input
                                  type='url'
                                  name='github'
                                  value={profile.github}
                                  onChange={handleChange}
                                  className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80'
                                  placeholder='https://github.com/username'
                                />
                              </div>
                              <div className='space-y-1.5'>
                                <label className='block text-sm font-medium text-gray-700 flex items-center gap-2'>
                                  <div className='w-3.5 h-3.5 bg-blue-500 text-white text-xs font-bold rounded flex items-center justify-center'>T</div>
                                  Telegram
                                </label>
                                <input
                                  type='text'
                                  name='telegram'
                                  value={profile.telegram}
                                  onChange={handleChange}
                                  className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80'
                                  placeholder='@username or phone number'
                                />
                              </div>
                            </div>
                          </div>

                          {/* Preferences */}
                          <div className='space-y-3'>
                            <h4 className='text-base font-semibold text-gray-800 flex items-center gap-2'>
                              <div className='w-4 h-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center'>
                                <span className='text-white text-xs font-bold'>P</span>
                              </div>
                              Preferences
                            </h4>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                              <div className='space-y-1.5'>
                                <label className='block text-sm font-medium text-gray-700'>
                                  Language
                                </label>
                                <select
                                  name='lang'
                                  value={profile.lang}
                                  onChange={handleChange}
                                  className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80'>
                                  {LANGS.map((lang) => (
                                    <option key={lang.value} value={lang.value}>
                                      {lang.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className='space-y-1.5'>
                                <label className='block text-sm font-medium text-gray-700'>
                                  Theme
                                </label>
                                <select className='w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-white/80'>
                                  <option value='light'>Light</option>
                                  <option value='dark'>Dark</option>
                                  <option value='auto'>Auto</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className='flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100'>
                            <button
                              type='submit'
                              disabled={loading}
                              className='w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm'>
                              {loading ? (
                                <>
                                  <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <div className='w-3.5 h-3.5 text-white'>✓</div>
                                  Save Changes
                                </>
                              )}
                            </button>
                            <button
                              type='button'
                              className='w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 text-sm'>
                              Cancel
                            </button>
                          </div>

                          {/* Status Messages */}
                          {success && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className='p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg flex items-center gap-2'>
                              <div className='w-4 h-4 text-green-600'>✓</div>
                              <span className='text-green-700 font-medium text-sm'>{success}</span>
                            </motion.div>
                          )}
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className='p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg flex items-center gap-2'>
                              <div className='w-4 h-4 text-red-600'>✗</div>
                              <span className='text-red-700 font-medium text-sm'>{error}</span>
                            </motion.div>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              </motion.div>
            )}

            {/* Take Test */}
            {active === "Take Test" && currentTest && (
              <motion.div
                key='take-test'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                {/* Test Header */}
                <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h2 className='text-2xl font-bold text-gray-800'>
                        {currentTest.title}
                      </h2>
                      <p className='text-gray-600'>{currentTest.description}</p>
                    </div>
                    <div className='text-right'>
                      <div
                        className={`text-2xl font-bold ${
                          timeRemaining < 300 ? "text-red-600" : "text-gray-800"
                        }`}>
                        {formatTime(timeRemaining)}
                      </div>
                      <div className='text-sm text-gray-500'>
                        Time Remaining
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-600'>
                      {Object.keys(testAnswers).length} of{" "}
                      {currentTest.questions?.length || 0} questions answered
                    </div>
                    <button
                      onClick={submitTest}
                      className='bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300'>
                      Submit Test
                    </button>
                  </div>
                </div>

                {/* Questions */}
                <div className='space-y-6'>
                  {currentTest.questions?.map((question, index) => (
                    <FadeInUp key={question.id} delay={index * 0.1}>
                      <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                        <div className='mb-6'>
                          <div className='flex items-center gap-3 mb-4'>
                            <div className='w-8 h-8 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-bold text-sm'>
                              {index + 1}
                            </div>
                            <h3 className='text-lg font-semibold text-gray-800'>
                              Question {index + 1}
                            </h3>
                          </div>
                          <p className='text-gray-700 text-lg'>
                            {question.question}
                          </p>
                        </div>

                        <div className='space-y-3'>
                          {question.options?.map((option, optionIndex) => (
                            <label
                              key={option.id}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                testAnswers[question.id] === option.id
                                  ? "border-[#10B981] bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}>
                              <input
                                type='radio'
                                name={`question-${question.id}`}
                                value={option.id}
                                checked={testAnswers[question.id] === option.id}
                                onChange={() =>
                                  saveAnswer(question.id, option.id)
                                }
                                className='text-[#10B981] focus:ring-[#10B981]'
                              />
                              <span className='flex-1 text-gray-700'>
                                {option.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}