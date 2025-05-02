'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiX, FiMessageSquare, FiBook, FiBookOpen, FiUser } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';

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

interface Comment {
  id: number;
  user: string;
  text: string;
  timestamp: string;
}

export default function BookDetails({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    async function fetchBook() {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setBook(data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [params.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            book_id: params.id,
            text: comment,
            user: 'Anonymous', // This should be replaced with actual user data
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setComments(prev => [...prev, {
        id: data.id,
        user: data.user,
        text: data.text,
        timestamp: 'Just now'
      }]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#d4af37] text-xl">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#d4af37] text-xl">Book not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed header */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {/* Back button */}
          <Link 
            href="/"
            className="inline-flex items-center text-[#d4af37] hover:text-[#d4af37]/80 mb-4 md:mb-6 text-sm md:text-base"
          >
            <FiX className="mr-2 rotate-45" />
            Back to Books
          </Link>

          {/* Book details section */}
          <div className="bg-black border border-[#d4af37] rounded-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              {/* Book cover */}
              <div className="relative w-full md:w-1/3 aspect-[3/4] max-w-[200px] mx-auto md:max-w-none">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
              </div>

              {/* Book info */}
              <div className="flex-1">
                <h1 className="text-xl md:text-3xl font-bold text-[#d4af37] mb-1 md:mb-2">{book.title}</h1>
                <p className="text-sm md:text-base text-gray-400 mb-2 md:mb-4">by {book.author}</p>
                <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">{book.description}</p>
                
                {/* Book statistics */}
                <div className="flex items-center space-x-6 md:space-x-8 mb-4 md:mb-6">
                  <div>
                    <p className="text-xs md:text-sm text-gray-400">Copies</p>
                    <p className="text-lg md:text-xl font-bold text-[#d4af37]">{book.copies}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-400">Sold</p>
                    <p className="text-lg md:text-xl font-bold text-[#d4af37]">{book.sold}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl md:text-2xl font-bold text-[#d4af37]">{book.price} USDC</span>
                  <button className="bg-[#d4af37] text-black px-4 md:px-6 py-1.5 md:py-2 rounded text-sm md:text-base hover:bg-[#d4af37]/90">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Comments section */}
            <div className="mt-8 md:mt-12">
              <h2 className="text-xl md:text-2xl font-bold text-[#d4af37] mb-3 md:mb-4 flex items-center">
                <FiMessageSquare className="mr-2" />
                Comments
              </h2>
              
              {/* Comment form */}
              <div className="mb-4 md:mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-black border border-[#d4af37] text-[#d4af37] rounded p-3 md:p-4 focus:outline-none text-sm md:text-base"
                  rows={2}
                />
                <button 
                  onClick={handleCommentSubmit}
                  className="mt-2 bg-[#d4af37] text-black px-3 md:px-4 py-1.5 md:py-2 rounded text-sm md:text-base hover:bg-[#d4af37]/90"
                >
                  Post Comment
                </button>
              </div>

              {/* Comments list */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-black border border-[#d4af37] rounded p-3 md:p-4">
                    <div className="flex justify-between items-start mb-1 md:mb-2">
                      <span className="font-bold text-[#d4af37] text-sm md:text-base">{comment.user}</span>
                      <span className="text-xs md:text-sm text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-300">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-[#d4af37]">
        <div className="flex justify-around items-center h-14">
          <Link href="/library" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiBook size={18} />
            <span className="mt-0.5">Library</span>
          </Link>
          <Link href="/shelf" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiBookOpen size={18} />
            <span className="mt-0.5">Shelf</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-[#d4af37] text-xs">
            <FiUser size={18} />
            <span className="mt-0.5">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 