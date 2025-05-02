'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-[#d4af37] z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-[#d4af37] text-xl font-bold">
            Quillify
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#d4af37]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/library" className="text-[#d4af37] hover:text-[#d4af37]/80">
            Library
          </Link>
          <Link href="/trending" className="text-[#d4af37] hover:text-[#d4af37]/80">
            Trending
          </Link>
          <Link href="/publish" className="text-[#d4af37] hover:text-[#d4af37]/80">
            Publish
          </Link>
          <Link href="/profile" className="text-[#d4af37] hover:text-[#d4af37]/80">
            Profile
          </Link>
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-black border-b border-[#d4af37]">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/library"
              className="text-[#d4af37] hover:text-[#d4af37]/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Library
            </Link>
            <Link
              href="/trending"
              className="text-[#d4af37] hover:text-[#d4af37]/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Trending
            </Link>
            <Link
              href="/publish"
              className="text-[#d4af37] hover:text-[#d4af37]/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Publish
            </Link>
            <Link
              href="/profile"
              className="text-[#d4af37] hover:text-[#d4af37]/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 