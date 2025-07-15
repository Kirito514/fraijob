'use client'

export default function RoleSelect({ userId, currentRole }) {
  const handleRoleChange = async (e) => {
    const newRole = e.target.value

    const res = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })

    if (res.ok) {
      location.reload()
    } else {
      alert('Rolni o‘zgartirishda xatolik')
    }
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={handleRoleChange}
      className="border p-1 rounded"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  )
}
