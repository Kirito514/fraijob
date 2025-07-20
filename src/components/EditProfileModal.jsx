// components/EditProfileModal.tsx
'use client';

import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from './ui/button';

export default function EditProfileModal({ onClose, user }) {
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(user?.photoURL || '');

  const handleUpdate = async () => {
    if (user) {
      await updateProfile(user, {
        displayName: name,
        photoURL: photo,
      });
      onClose(); // modalni yopish
      window.location.reload(); // sahifani yangilash
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Profilni o‘zgartirish</h2>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Ism</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Profil rasmi (URL)</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button className="bg-[#10B981] text-white hover:bg-[#0e9e6e]" onClick={handleUpdate}>
            Saqlash
          </Button>
        </div>
      </div>
    </div>
  );
}
