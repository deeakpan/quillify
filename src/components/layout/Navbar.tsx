import { FiMenu, FiSearch } from 'react-icons/fi';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-xl font-bold text-primary">
                Quillify
              </a>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 