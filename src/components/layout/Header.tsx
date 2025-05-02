'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiSearch, FiBook, FiBookOpen, FiUser } from 'react-icons/fi';

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-[#d4af37] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop header */}
        <div className="hidden md:flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-[#d4af37]">
              Quillify
            </Link>
            <div className="flex space-x-6">
              <Link href="/library" className="text-[#d4af37] hover:text-[#d4af37]/80">
                Library
              </Link>
              <Link href="/shelf" className="text-[#d4af37] hover:text-[#d4af37]/80">
                Shelf
              </Link>
              <Link href="/profile" className="text-[#d4af37] hover:text-[#d4af37]/80">
                Profile
              </Link>
            </div>
          </div>
          <button className="bg-[#d4af37] text-black px-4 py-2 rounded">
            Connect Wallet
          </button>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex items-center h-16">
          <Link href="/" className="text-xl font-bold text-[#d4af37]">
            Quillify
          </Link>
          <div className="flex items-center ml-4 space-x-6">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="text-[#d4af37] p-1"
            >
              <FiSearch size={20} />
            </button>
            <button className="bg-[#d4af37] text-black px-2 py-1 rounded text-sm">
              Connect
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {showSearch && (
          <div className="md:hidden py-4 border-t border-[#d4af37]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full bg-black border border-[#d4af37] text-[#d4af37] rounded px-4 py-2 pl-10 focus:outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d4af37]" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#d4af37]">
        <div className="flex justify-around items-center h-16">
          <Link href="/library" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiBook size={20} />
            <span className="mt-1">Library</span>
          </Link>
          <Link href="/shelf" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiBookOpen size={20} />
            <span className="mt-1">Shelf</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiUser size={20} />
            <span className="mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
} 