import { useState } from 'react';
import { useAuth } from '../../hooks';
import { cn } from '../../utils/cn';
import {
  Squares2X2Icon as Squares2X2Outline,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  Squares2X2Icon as Squares2X2Solid,
} from '@heroicons/react/24/solid';

const menuItems = [
  { name: 'Dashboard', outlineIcon: Squares2X2Outline, solidIcon: Squares2X2Solid },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'flex flex-col fixed top-0 left-0 bottom-0 z-50 w-[220px] rounded-r-2xl md:rounded-2xl md:top-2 md:left-2 md:bottom-2 shadow-sm overflow-hidden transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
        style={{ backgroundColor: '#F5F1EB' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
          <div className="w-9 h-9 rounded-full bg-primary-800 flex items-center justify-center">
            <span className="text-white font-bold text-[16px]">C</span>
          </div>
          <span className="text-lg font-bold text-primary-900">Customer Portal</span>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="ml-auto md:hidden p-1 rounded-lg text-gray-500 hover:bg-white/50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <div className="px-3 mt-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5">Menu</p>
          <nav className="flex flex-col gap-0.5">
            {menuItems.map((item) => {
              const active = activeItem === item.name;
              const Icon = active ? item.solidIcon : item.outlineIcon;
              return (
                <button
                  key={item.name}
                  onClick={() => { setActiveItem(item.name); onClose && onClose(); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative min-h-[44px]',
                    active
                      ? 'bg-white text-primary-900 font-semibold'
                      : 'text-gray-500 hover:bg-white/50'
                  )}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary-800 rounded-r-full" />
                  )}
                  <Icon className={cn('w-[18px] h-[18px]', active ? 'text-primary-800' : 'text-gray-400')} />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1" />

        {/* Logout at bottom */}
        <div className="px-3 pb-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-white/50 transition-all duration-200 min-h-[44px]"
          >
            <ArrowRightOnRectangleIcon className="w-[18px] h-[18px] text-gray-400" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
