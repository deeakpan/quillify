'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBook, FiBookOpen, FiUser, FiX, FiChevronLeft, FiChevronRight, FiSearch, FiVolume2, FiVolumeX, FiType, FiMinus, FiPlus } from 'react-icons/fi';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';


interface Book {
  id: number;
  title: string;
  description: string;
  cover: string;
  file: string;
  price: number;
  copies: number;
  author: string;
}

export default function ShelfPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookContent, setBookContent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [showSearch, setShowSearch] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isReading, setIsReading] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    if (searchQuery && bookContent) {
      const searchText = searchQuery.toLowerCase();
      const content = bookContent.toLowerCase();
      const results: number[] = [];
      let index = content.indexOf(searchText);
      
      while (index !== -1) {
        results.push(index);
        index = content.indexOf(searchText, index + 1);
      }

      setSearchResults(results);
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  }, [searchQuery, bookContent]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .or('title.ilike.%joy%,title.ilike.%gold%')
        .limit(2);

      if (error) throw error;
      setBooks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleReadBook = async (book: Book) => {
    setSelectedBook(book);
    setCurrentPage(1);
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSearchIndex(-1);
    setIsReading(false);
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    try {
      const response = await fetch(book.file);
      const text = await response.text();
      setBookContent(text);
      setTotalPages(Math.ceil(text.length / 1000));
    } catch (err) {
      console.error('Error loading book:', err);
    }
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
    setBookContent('');
    setCurrentPage(1);
    setSearchQuery('');
    setSearchResults([]);
    setCurrentSearchIndex(-1);
    setIsReading(false);
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    setCurrentUtterance(null);
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      // Find the start of the next word
      const currentEnd = currentPage * 1000;
      const nextWordStart = bookContent.indexOf(' ', currentEnd);
      if (nextWordStart !== -1) {
        setCurrentPage(prev => prev + 1);
      }
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextSearch = () => {
    if (searchResults.length === 0) return;
    setCurrentSearchIndex(prev => (prev + 1) % searchResults.length);
    const pageNumber = Math.floor(searchResults[currentSearchIndex] / 1000) + 1;
    setCurrentPage(pageNumber);
  };

  const handlePrevSearch = () => {
    if (searchResults.length === 0) return;
    setCurrentSearchIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    const pageNumber = Math.floor(searchResults[currentSearchIndex] / 1000) + 1;
    setCurrentPage(pageNumber);
  };

  const getTextForSpeech = (text: string) => {
    // Only process text for speech, keeping original text intact for display
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Skip emojis in speech
      .replace(/[-]/g, ' ') // Replace dashes with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const getCurrentPageContent = () => {
    if (!bookContent) return '';
    const start = (currentPage - 1) * 1000;
    const end = start + 1000;
    
    // Find the last complete word before the end
    let adjustedEnd = end;
    if (end < bookContent.length) {
      const nextSpace = bookContent.indexOf(' ', end);
      if (nextSpace !== -1) {
        adjustedEnd = nextSpace;
      }
    }
    
    let content = bookContent.slice(start, adjustedEnd);

    if (searchQuery && searchResults.length > 0) {
      const searchText = searchQuery.toLowerCase();
      const regex = new RegExp(searchText, 'gi');
      content = content.replace(regex, match => `<mark class="bg-[#d4af37] text-black">${match}</mark>`);
    }

    return content;
  };

  const toggleReading = () => {
    if (!speechSynthesis) return;

    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      setCurrentUtterance(null);
    } else {
      const currentContent = getCurrentPageContent();
      const cleanText = getTextForSpeech(currentContent);
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => {
        setIsReading(false);
        setCurrentUtterance(null);
        // Auto move to next page if not on last page
        if (currentPage < totalPages) {
          handlePageChange('next');
          // Start reading the next page
          setTimeout(() => {
            const nextContent = getCurrentPageContent();
            const nextCleanText = getTextForSpeech(nextContent);
            const nextUtterance = new SpeechSynthesisUtterance(nextCleanText);
            nextUtterance.onend = () => {
              setIsReading(false);
              setCurrentUtterance(null);
            };
            speechSynthesis.speak(nextUtterance);
            setCurrentUtterance(nextUtterance);
            setIsReading(true);
          }, 500);
        }
      };

      // Set voice properties
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Get available voices and set a good one
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') || 
        voice.name.includes('Samantha')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
      setCurrentUtterance(utterance);
      setIsReading(true);
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border border-[#d4af37] rounded-lg p-6"
          >
            <h1 className="text-2xl font-bold text-[#d4af37] mb-6">My Shelf</h1>

            {loading ? (
              <div className="text-[#d4af37]">Loading your books...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {books.map((book) => (
                  <motion.div
                    key={book.id}
                    className="bg-black border border-[#d4af37] rounded-lg overflow-hidden flex flex-col h-[280px]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative h-[150px]">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-2 flex flex-col flex-1 overflow-hidden">
                      <h3 className="text-sm font-bold text-[#d4af37] mb-1 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-1 line-clamp-1">
                        by {book.author}
                      </p>
                      <p className="text-gray-400 text-xs mb-2 line-clamp-1">
                        {book.description}
                      </p>
                      <div className="mt-auto">
                        <button
                          onClick={() => handleReadBook(book)}
                          className="w-full bg-[#d4af37] text-black py-1 rounded-md flex items-center justify-center gap-1 text-xs sm:text-sm hover:bg-[#d4af37]/80 transition-colors"
                        >
                          <FiBookOpen size={12} />
                          Read
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Enhanced Book Reader Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border border-[#d4af37] rounded-lg w-full max-w-4xl h-[80vh] flex flex-col"
            >
              {/* Reader Header */}
              <div className="p-4 border-b border-[#d4af37] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#d4af37]">{selectedBook.title}</h2>
                  <p className="text-sm text-gray-400">by {selectedBook.author}</p>
                </div>
                <button
                  onClick={handleCloseReader}
                  className="text-[#d4af37] hover:text-[#d4af37]/80"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Search and Controls Bar */}
              <div className="p-4 border-b border-[#d4af37] flex flex-wrap gap-2">
                <div className="flex-1 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="bg-[#d4af37] text-black px-3 py-2 rounded-md hover:bg-[#d4af37]/80"
                  >
                    <FiSearch size={20} />
                  </button>
                  {showSearch && (
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isMobile ? "Search..." : "Search in book..."}
                      className={`${
                        isMobile ? 'w-24' : 'flex-1'
                      } bg-gray-900 text-white px-3 py-2 rounded-md border border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]`}
                    />
                  )}
                  <button
                    onClick={toggleReading}
                    className={`px-3 py-2 rounded-md hover:bg-[#d4af37]/80 transition-colors ${
                      isReading ? 'bg-red-500 text-white' : 'bg-[#d4af37] text-black'
                    }`}
                  >
                    {isReading ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                  </button>
                  <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-md border border-[#d4af37]">
                    <FiType className="text-[#d4af37]" />
                    <button
                      onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                      className="text-[#d4af37] hover:text-[#d4af37]/80"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="text-white text-sm">{fontSize}px</span>
                    <button
                      onClick={() => setFontSize(prev => Math.min(32, prev + 2))}
                      className="text-[#d4af37] hover:text-[#d4af37]/80"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>
                {showSearch && searchResults.length > 0 && (
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <button onClick={handlePrevSearch} disabled={currentSearchIndex === 0}>
                      <FiChevronLeft size={20} />
                    </button>
                    <span>{currentSearchIndex + 1} of {searchResults.length}</span>
                    <button onClick={handleNextSearch} disabled={currentSearchIndex === searchResults.length - 1}>
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Reader Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div 
                  className="max-w-2xl mx-auto text-white leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: getCurrentPageContent() }}
                />
              </div>

              {/* Reader Footer */}
              <div className="p-4 border-t border-[#d4af37] flex justify-between items-center">
                <button
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                  className="text-[#d4af37] disabled:opacity-50"
                >
                  <FiChevronLeft size={24} />
                </button>
                <span className="text-[#d4af37]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages}
                  className="text-[#d4af37] disabled:opacity-50"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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