'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { displayName, email, photoURL } = firebaseUser;
        setUser({
          name: displayName,
          email,
          photo: photoURL,
          profession: "Frontend Developer", // yoki null
          level: 3,
          xp: 1260,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return <Dashboard user={user} />;
}
