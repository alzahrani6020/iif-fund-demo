'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/966567566616"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl shadow-green-500/30 flex items-center justify-center border-2 border-white/20"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle size={26} fill="white" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-afaq-bg" />
    </motion.a>
  );
}
