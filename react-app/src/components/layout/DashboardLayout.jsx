import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* On desktop push content with left margin; on mobile take full width */}
      <div className="flex-1 flex flex-col md:ml-[226px] min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-2 sm:px-3 pb-3 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
