import { prisma } from '@/lib/prisma';

// Foydalanuvchi o‘chirish (DELETE)
export async function DELETE(request, { params }) {
  const { id } = params

  try {
    const deleted = await prisma.user.delete({
      where: { id: Number(id) },
    })

    return new Response(JSON.stringify({ message: 'O‘chirildi', user: deleted }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'O‘chirishda xatolik' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Foydalanuvchi ro‘lini o‘zgartirish (PATCH)
export async function PATCH(request, { params }) {
  const { id } = params
  const { role } = await request.json() // Requestdan role qiymatini olish

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role },
    })

    return new Response(JSON.stringify({ message: 'Rol o‘zgartirildi', user: updatedUser }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Rolni o‘zgartirishda xatolik' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
