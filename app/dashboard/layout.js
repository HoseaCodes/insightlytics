// app/layout.js
'use client';

import { useState } from 'react';
import { SidebarItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Navbar */}
      <header className="flex items-center justify-between bg-gray-800 p-4 text-white md:hidden">
        <div className="text-lg font-semibold">Dashboard</div>
        <Button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          {/* Hamburger icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </Button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } md:flex md:flex-col w-64 bg-gray-800 text-white fixed md:sticky top-0 left-0 z-10 transition-transform transform md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ height: '100vh' }} // Ensures the sidebar takes the full viewport height
        >
          <div className="p-4 text-lg font-semibold">Dashboard</div>
          <nav>
            <ul className="space-y-2">
              <SidebarItem href="/dashboard" title="Home" />
              <SidebarItem href="/dashboard/strategy" title="Strategy" />
              <SidebarItem href="/dashboard/calendar" title="Calendar" />
              <SidebarItem href="/dashboard/leads" title="Leads Gen" />
              <SidebarItem href="/dashboard/instagram/post" title="Instagram" />
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-100 ml-0 ">
          {children}
        </main>
      </div>
    </div>
  );
}
