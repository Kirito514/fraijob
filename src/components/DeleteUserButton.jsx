'use client'

import { Trash2 } from 'lucide-react' // ← optional icon (yoki olib tashlashingiz mumkin)

export default function DeleteUserButton({ userId }) {
  const handleDelete = async () => {
    const confirm = window.confirm('Foydalanuvchini o‘chirmoqchimisiz?')
    if (!confirm) return

    const res = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      location.reload()
    } else {
      alert('O‘chirishda xatolik')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1 bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full hover:bg-red-200 transition"
      title="Foydalanuvchini o‘chirish"
    >
      <Trash2 size={16} />
      O‘chirish
    </button>
  )
}
