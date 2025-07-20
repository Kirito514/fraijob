'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0FDF4]">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#10B981]">🧠 FraiJob Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-100"
        >
          Chiqish
        </button>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
