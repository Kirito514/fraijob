"use client";

import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [greeting, setGreeting] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    if (typeof window !== "undefined") {
      setCurrentMenu(window.location.pathname);
    }
  }, []);

  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <aside className='w-64 bg-white p-6 shadow-md flex flex-col justify-between'>
        <div>
          <p className='text-sm text-gray-400 mb-1'>{greeting}</p>
          <div className='flex items-center gap-2 mb-6'>
            <div className='w-10 h-10 bg-blue-600 rounded-full' />
            <div>
              <p className='font-semibold text-lg'>FraiJob</p>
              <span className='text-green-500 text-sm'>Online</span>
            </div>
          </div>
          <nav className='space-y-2'>
            <p className='text-gray-600 text-sm uppercase mb-2'>Menu</p>
            {[
              { name: "Dashboard", href: "/dashboard" },
              { name: "Jobs", href: "/jobs" },
              { name: "About Me", href: "/about" },
              { name: "Messages", href: "/messages" },
              { name: "Community", href: "/community" },
              { name: "Settings", href: "/settings" },
            ].map(({ name, href }) => (
              <a
                key={name}
                href={href}
                className={`block px-3 py-2 rounded hover:bg-gray-200 ${
                  currentMenu === href ? "bg-gray-200 font-semibold" : ""
                }`}>
                {name}
              </a>
            ))}

            <p className='text-gray-600 text-sm uppercase mt-6 mb-2'>
              Services
            </p>
            <a href='#' className='block px-3 py-2 rounded hover:bg-gray-200'>
              My Projects
            </a>

            <p className='text-gray-600 text-sm uppercase mt-6 mb-2'>Friends</p>
            <a href='#' className='block px-3 py-2 rounded hover:bg-gray-200'>
              My Friends
            </a>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <section className='flex-1 p-6'>
        <header className='flex justify-between items-center mb-6'>
          <input
            type='text'
            placeholder='Search...'
            className='flex-grow px-4 py-2 border rounded max-w-2xl'
          />

          <div className='flex items-center gap-4 ml-4'>
            <button className='relative'>
              <FaBell className='text-xl text-gray-700' />
            </button>

            <div className='relative'>
              <button
                className='flex items-center gap-2 px-4 py-2 bg-white border rounded shadow-sm'
                onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className='w-8 h-8 bg-gray-400 rounded-full' />
                <span className='font-medium'>Orzubek</span>
                <ChevronDown className='w-4 h-4' />
              </button>
              {userMenuOpen && (
                <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10'>
                  <a
                    href='/profile'
                    className='block px-4 py-2 hover:bg-gray-100'>
                    Profile
                  </a>
                  <form method='POST' action='/api/logout'>
                    <button className='w-full text-left px-4 py-2 hover:bg-gray-100'>
                      Logout
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </header>

        {children}
      </section>
    </div>
  );
}
