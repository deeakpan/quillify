'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiCheck, FiBook, FiDollarSign, FiTwitter, FiBookOpen, FiUser, FiShield, FiMoreVertical, FiShare2, FiEdit2, FiSettings } from 'react-icons/fi';
import Sidebar from '@/components/layout/Sidebar';
import { Playfair_Display, Cormorant_Garamond, Cinzel } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['400', '500', '600']
});

const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '500', '600']
});

// Mock data - replace with actual data from your backend
const mockUser = {
  id: 1,
  username: 'johndoe',
  displayName: 'John Doe',
  xHandle: '@johndoe',
  level: 5,
  rank: 3,
  verified: true,
  profilePic: 'https://placehold.co/200x200/000000/d4af37?text=JD',
  totalSales: 150,
  totalRevenue: 2500,
  authorRank: 'Master Storyteller',
  achievements: [
    {
      id: 1,
      title: 'Bestselling Author',
      description: 'Reached 100+ book sales',
      icon: '🏆',
      unlockedAt: '2024-02-15'
    },
    {
      id: 2,
      title: 'Rising Star',
      description: 'First book sold out',
      icon: '⭐',
      unlockedAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'Community Favorite',
      description: 'Received 50+ positive reviews',
      icon: '❤️',
      unlockedAt: '2024-02-01'
    }
  ],
  publishedBooks: [
    {
      id: 1,
      title: 'The Great Adventure',
      cover: 'https://placehold.co/400x600/000000/d4af37?text=Book+1',
      sales: 75,
      revenue: 1500
    },
    {
      id: 2,
      title: 'Mystery of the Night',
      cover: 'https://placehold.co/400x600/000000/d4af37?text=Book+2',
      sales: 50,
      revenue: 750
    },
    {
      id: 3,
      title: 'Future World',
      cover: 'https://placehold.co/400x600/000000/d4af37?text=Book+3',
      sales: 25,
      revenue: 250
    }
  ]
};

export default function ProfilePage() {
  const [isOwner, setIsOwner] = useState(true); // Mock owner state
  const [showSoldOut, setShowSoldOut] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Animation variants
  const profileVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const soldOutVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { 
      scale: 0, 
      rotate: 180,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-[#d4af37] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop header */}
          <div className="hidden md:flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-2xl font-bold text-[#d4af37]">
                Quillify
              </a>
              <div className="flex space-x-6">
                <a href="/library" className="text-[#d4af37] hover:text-[#d4af37]/80">
                  Library
                </a>
                <a href="/shelf" className="text-[#d4af37] hover:text-[#d4af37]/80">
                  Shelf
                </a>
                <a href="/profile" className="text-[#d4af37] hover:text-[#d4af37]/80">
                  Profile
                </a>
              </div>
            </div>
            <button className="bg-[#d4af37] text-black px-4 py-2 rounded">
              Connect Wallet
            </button>
          </div>

          {/* Mobile header */}
          <div className="md:hidden flex items-center h-16">
            <a href="/" className="text-xl font-bold text-[#d4af37]">
              Quillify
            </a>
            <div className="flex items-center ml-4 space-x-6">
              <button className="bg-[#d4af37] text-black px-2 py-1 rounded text-sm">
                Connect
              </button>
            </div>
          </div>
        </div>
      </header>

      <Sidebar />

      {/* Main content */}
      <main className="pt-16 pb-16 md:pb-0 md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="bg-black border border-[#d4af37] rounded-lg p-6 relative"
            variants={profileVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Three-dot menu */}
            <div className="absolute top-4 right-4" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-[#d4af37] p-2 hover:bg-[#d4af37]/10 rounded-full transition-colors"
              >
                <FiMoreVertical size={20} />
              </button>
              
              {/* Dropdown menu */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-black border border-[#d4af37] rounded-lg shadow-lg z-50"
                  >
                    <div className="py-1">
                      <button
                        className="w-full px-4 py-2 text-left text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-2"
                        onClick={() => {
                          // Share profile logic
                          setShowMenu(false);
                        }}
                      >
                        <FiShare2 size={16} />
                        Share Profile
                      </button>
                      {isOwner && (
                        <>
                          <button
                            className="w-full px-4 py-2 text-left text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-2"
                            onClick={() => {
                              // Edit profile logic
                              setShowMenu(false);
                            }}
                          >
                            <FiEdit2 size={16} />
                            Edit Profile
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-2"
                            onClick={() => {
                              // Profile settings logic
                              setShowMenu(false);
                            }}
                          >
                            <FiSettings size={16} />
                            Profile Settings
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              {/* Profile Picture and Level */}
              <div className="relative">
                <motion.div 
                  className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#d4af37]"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={mockUser.profilePic}
                    alt={mockUser.displayName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-2 -right-2 bg-[#d4af37] text-black rounded-full p-2"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <FiAward size={24} />
                </motion.div>
                <motion.div 
                  className="absolute -top-2 -right-2 bg-[#d4af37] text-black rounded-full px-2 py-1 text-sm font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  #{mockUser.rank}
                </motion.div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-[#d4af37]">{mockUser.displayName}</h1>
                  {mockUser.verified && (
                    <motion.div
                      className="relative"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="absolute -inset-1 bg-[#d4af37] rounded-full blur-sm opacity-50"></div>
                      <div className="relative bg-[#d4af37] text-black rounded-full p-1">
                        <FiShield size={16} />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-4 text-gray-400">
                  <span>@{mockUser.username}</span>
                  <a 
                    href={`https://twitter.com/${mockUser.xHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#d4af37]"
                  >
                    <FiTwitter />
                    {mockUser.xHandle}
                  </a>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4"
                >
                  <div className="flex items-center gap-2">
                    <FiBook className="text-[#d4af37] flex-shrink-0" />
                    <span className="text-gray-300 whitespace-nowrap">{mockUser.publishedBooks.length} Books</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiAward className="text-[#d4af37] flex-shrink-0" />
                    <span className="text-gray-300 whitespace-nowrap">Rank {mockUser.rank} • {mockUser.authorRank}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Owner Stats */}
            {isOwner && (
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
              >
                <div className="bg-black border border-[#d4af37] rounded p-4">
                  <h3 className="text-lg font-bold text-[#d4af37] mb-2">Total Sales</h3>
                  <p className={`text-2xl text-white ${cinzel.className} font-medium`}>
                    {mockUser.totalSales}
                  </p>
                </div>
                <div className="bg-black border border-[#d4af37] rounded p-4">
                  <h3 className="text-lg font-bold text-[#d4af37] mb-2">Total Revenue</h3>
                  <p className={`text-2xl text-white ${cinzel.className} font-medium`}>
                    {mockUser.totalRevenue} <span className="text-sm font-medium text-[#d4af37]">USDC</span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Published Books */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-bold text-[#d4af37] mb-4">Published Books</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockUser.publishedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    className="relative bg-black border border-[#d4af37] rounded overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {book.sales >= 100 && (
                        <AnimatePresence>
                          {showSoldOut && (
                            <motion.div
                              className="absolute inset-0 bg-black/80 flex items-center justify-center"
                              variants={soldOutVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                            >
                              <span className="text-[#d4af37] font-bold text-lg">SOLD OUT!</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="text-sm font-bold text-[#d4af37] mb-1 line-clamp-1">{book.title}</h3>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{book.sales} sold</span>
                        <span>{book.revenue} USDC</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={itemVariants} className="mt-8">
              <h2 className="text-xl font-bold text-[#d4af37] mb-4">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockUser.achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    className="bg-black border border-[#d4af37] rounded-lg p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3 className="text-[#d4af37] font-bold">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                        <p className="text-gray-500 text-xs mt-1">Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#d4af37]">
        <div className="flex justify-around items-center h-14">
          <a href="/library" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiBook size={18} />
            <span className="mt-0.5">Library</span>
          </a>
          <a href="/shelf" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiBookOpen size={18} />
            <span className="mt-0.5">Shelf</span>
          </a>
          <a href="/profile" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiUser size={18} />
            <span className="mt-0.5">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
} 