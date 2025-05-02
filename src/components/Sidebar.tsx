'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBook, FiTrendingUp, FiUpload, FiUser } from 'react-icons/fi';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-black border-r border-[#d4af37] hidden md:block">
      <nav className="p-4 space-y-2">
        <Link
          href="/library"
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
            isActive('/library')
              ? 'bg-[#d4af37] text-black'
              : 'text-[#d4af37] hover:bg-[#d4af37]/10'
          }`}
        >
          <FiBook size={20} />
          <span>Library</span>
        </Link>

        <Link
          href="/trending"
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
            isActive('/trending')
              ? 'bg-[#d4af37] text-black'
              : 'text-[#d4af37] hover:bg-[#d4af37]/10'
          }`}
        >
          <FiTrendingUp size={20} />
          <span>Trending</span>
        </Link>

        <Link
          href="/publish"
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
            isActive('/publish')
              ? 'bg-[#d4af37] text-black'
              : 'text-[#d4af37] hover:bg-[#d4af37]/10'
          }`}
        >
          <FiUpload size={20} />
          <span>Publish</span>
        </Link>

        <Link
          href="/profile"
          className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
            isActive('/profile')
              ? 'bg-[#d4af37] text-black'
              : 'text-[#d4af37] hover:bg-[#d4af37]/10'
          }`}
        >
          <FiUser size={20} />
          <span>Profile</span>
        </Link>
      </nav>
    </aside>
  );
} 