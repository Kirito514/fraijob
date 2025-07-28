'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        console.log("Supabase session:", session);
        // Supabase sessiondan foydalanuvchi ma'lumotini olamiz
        const { email, name, picture, id } = session.user;
        // Backendga yuboramiz va JWT cookie o'rnatamiz
        const res = await fetch("/api/login-oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: name || email.split("@")[0],
            image: picture || null,
            uid: id, // Supabase foydalanuvchi ID
          }),
        });
        const data = await res.json();
        console.log("login-oauth response:", data);
        // Endi dashboardga yo'naltiramiz
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    checkSession();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 text-lg">Please wait, logging you in...</p>
    </div>
  )
}
