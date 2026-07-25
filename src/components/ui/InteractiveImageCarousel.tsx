'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveImageCarousel({ photos, productName }: { photos: string[], productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="bg-white/80 backdrop-blur-2xl p-4 md:p-10 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] aspect-square flex items-center justify-center relative overflow-hidden group">
        
        {/* Glow behind the image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Image Display */}
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={photos[currentIndex]} 
            alt={`${productName} - Vista ${currentIndex + 1}`} 
            className="w-full h-full object-contain relative z-10 drop-shadow-2xl" 
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md border border-white shadow-lg text-slate-700 hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md border border-white shadow-lg text-slate-700 hover:bg-white hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
              aria-label="Siguiente imagen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {photos.map((photo, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`bg-white/60 backdrop-blur-md p-2 rounded-xl border ${currentIndex === i ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/50 hover:border-blue-300'} aspect-square flex items-center justify-center transition-all shadow-sm focus:outline-none`}
            >
              <img src={photo} alt={`${productName} thumbnail ${i+1}`} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
