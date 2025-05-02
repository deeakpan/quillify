'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  price: string;
  description: string;
  copies?: number;
  sold?: number;
}

export default function BookCard({ id, title, author, coverImage, price, description, copies = 0, sold = 0 }: BookCardProps) {
  return (
    <Link href={`/books/${id}`}>
      <motion.div 
        className="bg-black border border-[#d4af37] rounded overflow-hidden hover:border-[#d4af37]/80 h-[280px] flex flex-col"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)"
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        <div className="relative h-32 w-full flex-shrink-0">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        
        <div className="p-2 flex flex-col flex-grow">
          <motion.h3 
            className="text-sm font-bold text-[#d4af37] mb-1 line-clamp-1"
            whileHover={{ color: "#f0d78c" }}
          >
            {title}
          </motion.h3>
          
          <div className="mb-1">
            <motion.span 
              className="text-xs font-light text-gray-500"
              whileHover={{ color: "#9ca3af" }}
            >
              By: 
            </motion.span>
            <motion.span 
              className="text-xs font-medium text-gray-400 line-clamp-1"
              whileHover={{ color: "#e5e7eb" }}
            >
              {author}
            </motion.span>
          </div>
          
          <motion.p 
            className="text-xs text-gray-300 mb-2 line-clamp-2 flex-grow"
            whileHover={{ color: "#6b7280" }}
          >
            {description}
          </motion.p>
          
          <div className="flex justify-between items-center mb-2">
            <div>
              <motion.span 
                className="text-xs font-light text-gray-500"
                whileHover={{ color: "#9ca3af" }}
              >
                Copies: 
              </motion.span>
              <motion.span 
                className="text-xs font-medium text-gray-400"
                whileHover={{ color: "#e5e7eb" }}
              >
                {copies}
              </motion.span>
            </div>
            <div>
              <motion.span 
                className="text-xs font-light text-gray-500"
                whileHover={{ color: "#9ca3af" }}
              >
                Sold: 
              </motion.span>
              <motion.span 
                className="text-xs font-medium text-gray-400"
                whileHover={{ color: "#e5e7eb" }}
              >
                {sold}
              </motion.span>
            </div>
          </div>
          
          <motion.button
            className="bg-[#d4af37] text-black text-xs font-medium px-2 py-1 rounded hover:bg-[#d4af37]/80 w-fit"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#f0d78c"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {price}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
} 