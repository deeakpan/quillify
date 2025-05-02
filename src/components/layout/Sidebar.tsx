import { useState } from 'react';
import Link from 'next/link';
import { 
  FiBook, 
  FiBookOpen, 
  FiCalendar, 
  FiTrendingUp, 
  FiCreditCard, 
  FiGrid, 
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiPlusCircle
} from 'react-icons/fi';

const menuItems = [
  { icon: FiPlusCircle, label: 'Publish Book', href: '/publish' },
  { icon: FiBookOpen, label: 'My Collection', href: '/collection' },
  { icon: FiCalendar, label: 'Events', href: '/events' },
  { icon: FiTrendingUp, label: 'Trending', href: '/trending' },
  { icon: FiCreditCard, label: 'Wallet', href: '/wallet' },
  { icon: FiGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: FiSettings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 text-[#d4af37]"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-black border-r border-[#d4af37] transition-all duration-300 z-40
          ${isCollapsed ? 'w-16' : 'w-64'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-[#d4af37] text-black p-1 rounded-full hidden md:block"
        >
          {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>

        <div className="h-full overflow-y-auto py-4">
          <nav className="space-y-2 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 text-[#d4af37] hover:bg-[#d4af37]/10 p-2 rounded transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
} 