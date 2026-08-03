import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.first_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="px-2 sm:px-3 pt-2 pb-1">
      <div className="rounded-2xl px-3 sm:px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: '#F5F1EB' }}>
        {/* Left - Hamburger (mobile) + Search */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger button - visible only on mobile */}
          <button
            onClick={onMenuClick}
            className="md:hidden w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition"
            aria-label="Open menu"
          >
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative hidden sm:block">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="bg-white border border-gray-100 rounded-xl pl-9 pr-16 py-2 text-sm w-[200px] md:w-[260px] focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">&#8984; F</span>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button className="w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition">
            <ChatBubbleLeftIcon className="w-[17px] h-[17px] text-gray-500" />
          </button>
          <button className="w-9 h-9 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition relative">
            <BellIcon className="w-[17px] h-[17px] text-gray-500" />
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1.5 right-1.5" />
          </button>

          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsProfileOpen(false);
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsProfileOpen(!isProfileOpen); }
              }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-semibold text-gray-800 leading-tight">{displayName}</p>
                <p className="text-[10.5px] text-gray-400">{displayEmail}</p>
              </div>
            </button>

            {isProfileOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{displayEmail}</p>
                </div>
                <button
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => { logout(); setIsProfileOpen(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { logout(); setIsProfileOpen(false); } }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
