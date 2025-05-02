'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FiUpload, FiX, FiImage, FiFile, FiBook, FiBookOpen, FiUser } from 'react-icons/fi';
import Sidebar from '@/components/layout/Sidebar';

export default function PublishPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    copies: '1',
    coverImage: null as File | null,
    bookFile: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const bookInputRef = useRef<HTMLInputElement>(null);

  // Supported file formats for book uploads
  const supportedBookFormats = [
    'application/pdf', 
    'text/plain',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/epub+zip',
    'application/rtf',
    'text/markdown'
  ];
  
  const supportedBookExtensions = '.pdf, .txt, .doc, .docx, .epub, .rtf, .md';

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (supportedBookFormats.includes(file.type) || 
          supportedBookExtensions.split(', ').some(ext => file.name.toLowerCase().endsWith(ext.substring(1)))) {
        setFormData(prev => ({ ...prev, bookFile: file }));
        // Clear any previous error messages
        if (uploadStatus.type === 'error' && uploadStatus.message.includes('Please upload')) {
          setUploadStatus({ type: null, message: '' });
        }
      } else {
        setUploadStatus({
          type: 'error',
          message: `Please upload a supported format: ${supportedBookExtensions}`
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'copies') {
      const numValue = parseInt(value);
      if (numValue > 500) {
        setUploadStatus({
          type: 'error',
          message: 'Maximum number of copies is 500'
        });
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate copies before showing confirmation
    const copies = parseInt(formData.copies);
    if (copies > 500) {
      setUploadStatus({
        type: 'error',
        message: 'Maximum number of copies is 500'
      });
      return;
    }

    // Validate other required fields
    if (!formData.title || !formData.description || !formData.price || !formData.coverImage || !formData.bookFile) {
      setUploadStatus({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmPublish = async () => {
    setLoading(true);
    setShowConfirmation(false);
    setUploadStatus({ type: null, message: '' });

    try {
      // Upload cover image
      let coverImageUrl = '';
      if (formData.coverImage) {
        const fileExt = formData.coverImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: coverData, error: coverError } = await supabase.storage
          .from('cover')
          .upload(fileName, formData.coverImage);

        if (coverError) throw new Error(`Failed to upload cover image: ${coverError.message}`);

        const { data: { publicUrl } } = supabase.storage
          .from('cover')
          .getPublicUrl(fileName);

        coverImageUrl = publicUrl;
      }

      // Upload book file
      let bookFileUrl = '';
      if (formData.bookFile) {
        const fileExt = formData.bookFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: bookData, error: bookError } = await supabase.storage
          .from('file')
          .upload(fileName, formData.bookFile);

        if (bookError) throw new Error(`Failed to upload book file: ${bookError.message}`);

        const { data: { publicUrl } } = supabase.storage
          .from('file')
          .getPublicUrl(fileName);

        bookFileUrl = publicUrl;
      }

      // Create book record
      const { data: book, error: bookError } = await supabase
        .from('books')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            copies: parseInt(formData.copies),
            cover: coverImageUrl,
            file: bookFileUrl,
          }
        ])
        .select()
        .single();

      if (bookError) throw new Error(`Failed to create book: ${bookError.message}`);

      setUploadStatus({
        type: 'success',
        message: 'Book published successfully!'
      });

      // Clear form and redirect after success
      setFormData({
        title: '',
        description: '',
        price: '',
        copies: '1',
        coverImage: null,
        bookFile: null,
      });
      setPreviewUrl(null);

      // Redirect to library page after a short delay
      setTimeout(() => {
        router.push('/library');
      }, 2000);

    } catch (error) {
      console.error('Error publishing book:', error);
      setUploadStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error publishing book'
      });
    } finally {
      setLoading(false);
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

      {/* Sidebar */}
      <Sidebar />

      {/* Main content with padding for fixed header and bottom nav */}
      <main className="pt-16 pb-16 md:pb-0 md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-[#d4af37] mb-6">Publish a Book</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-medium text-[#d4af37] mb-2">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-[#d4af37] border-2 bg-gray-900 text-[#d4af37] text-lg p-4 shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37] placeholder-[#d4af37]/50"
                  placeholder="Enter your book title..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-[#d4af37] mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-[#d4af37] border-2 bg-gray-900 text-[#d4af37] text-lg p-4 shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37] placeholder-[#d4af37]/50"
                  placeholder="Describe your book..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-medium text-[#d4af37] mb-2">Price</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-[#d4af37] border-2 bg-gray-900 text-[#d4af37] text-lg p-4 shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37] placeholder-[#d4af37]/50"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-medium text-[#d4af37] mb-2">Copies (Max 500)</label>
                  <input 
                    type="number" 
                    name="copies" 
                    value={formData.copies} 
                    onChange={handleInputChange}
                    min="1"
                    max="500"
                    className="mt-1 block w-full rounded-md border-[#d4af37] border-2 bg-gray-900 text-[#d4af37] text-lg p-4 shadow-sm focus:border-[#d4af37] focus:ring-[#d4af37] placeholder-[#d4af37]/50"
                    placeholder="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-[#d4af37] mb-2">Cover Image</label>
                <div className="mt-1 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-6 py-3 border-2 border-[#d4af37] rounded-md shadow-sm text-lg font-medium text-[#d4af37] bg-gray-900 hover:bg-gray-800 transition-colors"
                  >
                    <FiImage className="inline-block mr-2" />
                    Choose Image
                  </button>
                  <input 
                    type="file" 
                    ref={coverInputRef}
                    onChange={handleCoverImageChange}
                    accept="image/*" 
                    className="hidden" 
                  />
                  {previewUrl && (
                    <div className="w-full">
                      <div className="w-full h-48 md:h-56 rounded-t-lg overflow-hidden border-b-2 border-[#d4af37]">
                        <img src={previewUrl} alt="Cover preview" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-lg font-medium text-[#d4af37] mb-2">
                  Book File
                </label>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => bookInputRef.current?.click()}
                    className="px-6 py-3 border-2 border-[#d4af37] rounded-md shadow-sm text-lg font-medium text-[#d4af37] bg-gray-900 hover:bg-gray-800 transition-colors"
                  >
                    <FiFile className="inline-block mr-2" />
                    Choose File
                  </button>
                  <input 
                    type="file" 
                    ref={bookInputRef}
                    onChange={handleBookFileChange}
                    accept={supportedBookExtensions}
                    className="hidden" 
                  />
                  {formData.bookFile && (
                    <div className="flex items-center bg-gray-800 px-3 py-2 rounded-md">
                      <span className="text-lg text-[#d4af37] truncate max-w-xs">{formData.bookFile.name}</span>
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bookFile: null }))}
                        className="ml-2 text-[#d4af37] hover:text-[#d4af37]/80"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-[#d4af37]/70">
                  Supported formats: PDF, TXT, DOC, DOCX, EPUB, RTF, Markdown
                </p>
              </div>

              {uploadStatus.message && (
                <div className={`p-6 rounded-md text-lg ${
                  uploadStatus.type === 'success' ? 'bg-green-900 text-green-200 border-2 border-green-500' : 'bg-red-900 text-red-200 border-2 border-red-500'
                }`}>
                  {uploadStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 border-2 border-[#d4af37] rounded-md shadow-sm text-xl font-medium text-black bg-[#d4af37] hover:bg-[#d4af37]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Publishing...' : 'Publish Book'}
              </button>
            </form>
          </div>
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg shadow-xl border-2 border-[#d4af37] w-full max-w-[320px] md:max-w-md mx-auto my-4">
            <div className="bg-black p-3 flex justify-between items-center border-b border-[#d4af37] sticky top-0">
              <h3 className="text-base md:text-lg font-bold text-[#d4af37]">Confirm Book Details</h3>
              <button 
                onClick={() => setShowConfirmation(false)}
                className="text-[#d4af37] hover:text-[#d4af37]/80"
              >
                <FiX />
              </button>
            </div>
            
            <div className="p-3 md:p-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-3 mb-3">
                {previewUrl && (
                  <div className="w-full">
                    <div className="w-full h-48 md:h-56 rounded-t-lg overflow-hidden border-b-2 border-[#d4af37]">
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">TITLE</p>
                    <p className="text-sm md:text-base font-bold text-white line-clamp-2">{formData.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 font-medium">DESCRIPTION</p>
                    <p className="text-xs md:text-sm text-gray-300 line-clamp-3">{formData.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-400 font-medium">COPIES</p>
                      <p className="text-sm font-semibold text-white">{formData.copies}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">PRICE</p>
                      <p className="text-sm font-semibold text-white">{formData.price} USDC</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 font-medium">FILE</p>
                    <p className="text-sm font-semibold text-white truncate">{formData.bookFile?.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-2 bg-gray-800 text-white text-sm font-bold border border-[#d4af37] rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPublish}
                  disabled={loading}
                  className="flex-1 py-2 bg-[#d4af37] text-black text-sm font-bold border border-[#d4af37] rounded-md hover:bg-[#d4af37]/80 flex justify-center items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-2" />
                      <span> Publish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}