'use client';
import { motion } from 'framer-motion';

export default function NfcClientsMarquee() {
  // Mock company names instead of images to avoid broken links
  const clients = [
    'Marriott Hotels',
    'Gold\'s Gym',
    'Toyota',
    'KFC',
    'Hilton',
    'Hard Rock Cafe',
    'RE/MAX',
    'WeWork'
  ];

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">La tecnología detrás de las marcas más grandes</p>
      </div>
      
      <div className="relative w-full flex overflow-hidden">
        {/* Gradient Masks for fade effect at edges */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
        
        <motion.div 
          className="flex whitespace-nowrap gap-16 items-center px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
        >
          {/* Double array to create seamless loop */}
          {[...clients, ...clients].map((client, idx) => (
            <div key={idx} className="text-2xl md:text-3xl font-black text-slate-300 uppercase tracking-tighter">
              {client}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
