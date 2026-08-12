import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

export default function AppShell() {
  const [sidebarCollapsed] = useState(false);
  const [_searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768
            ? (sidebarCollapsed ? '68px' : '240px')
            : '0',
        }}
      >
        <TopBar onSearchOpen={() => setSearchOpen(true)} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
