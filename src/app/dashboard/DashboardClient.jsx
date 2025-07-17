"use client";

export default function DashboardClient({ user }) {
  return (
    <div className='space-y-4'>
      <div className='bg-white shadow rounded-xl p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          Welcome, {user?.name || user?.email}
        </h2>
        <p className='text-gray-600'>
          This is your dashboard overview. Use the menu on the left to navigate.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-blue-50 p-4 rounded shadow'>
          <p className='text-blue-700 font-semibold'>Projects</p>
          <p className='text-2xl font-bold mt-1'>3</p>
        </div>
        <div className='bg-green-50 p-4 rounded shadow'>
          <p className='text-green-700 font-semibold'>Messages</p>
          <p className='text-2xl font-bold mt-1'>12</p>
        </div>
        <div className='bg-yellow-50 p-4 rounded shadow'>
          <p className='text-yellow-700 font-semibold'>Friends</p>
          <p className='text-2xl font-bold mt-1'>5</p>
        </div>
      </div>
    </div>
  );
}
