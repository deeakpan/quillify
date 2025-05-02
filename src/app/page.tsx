'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FiBook, FiBookOpen, FiUser } from 'react-icons/fi';
import Sidebar from '@/components/layout/Sidebar';
import BookCard from '@/components/books/BookCard';

interface Book {
  id: number;
  title: string;
  description: string;
  price: number;
  copies: number;
  cover: string;
  file: string;
  created_at: string;
  author: string;
  sold: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBooks(data || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

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

      {/* Sidebar */}
      <Sidebar />

      {/* Main content with padding for fixed header and bottom nav */}
      <main className="pt-16 pb-16 md:pb-0 md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-[#d4af37] mb-6">Library</h1>

          {loading ? (
            <div className="text-[#d4af37] text-center py-8">Loading books...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverImage={book.cover}
                  price={`${book.price} USDC`}
                  description={book.description}
                  copies={book.copies}
                  sold={book.sold}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#d4af37]">
        <div className="flex justify-around items-center h-16">
          <a href="/library" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiBook size={20} />
            <span className="mt-1">Library</span>
          </a>
          <a href="/shelf" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiBookOpen size={20} />
            <span className="mt-1">Shelf</span>
          </a>
          <a href="/profile" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiUser size={20} />
            <span className="mt-1">Profile</span>
          </a>
        </div>
      </div>
    </div>
  );
}
