import { SidebarItem } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white hidden md:flex md:flex-col">
          <div className="p-4 text-lg font-semibold">Dashboard</div>
          <nav>
            <ul className="space-y-2">
              <SidebarItem href="/dashboard" title="Home" />
              <SidebarItem href="/dashboard/strategy" title="Strategy" />
              <SidebarItem href="/dashboard/calendar" title="Calendar" />
              <SidebarItem href="/dashboard/calendar/instagram/post" title="Instagram" />
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
