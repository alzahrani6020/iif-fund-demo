'use client';

import { motion } from 'framer-motion';

interface Props {
  kicker?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({ kicker, title, description, centered = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className={centered ? 'text-center' : ''}
    >
      {kicker && <span className="section-kicker mb-4 inline-flex">{kicker}</span>}
      <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">{title}</h2>
      {description && (
        <p className="mt-4 max-w-2xl text-surface-500 leading-relaxed text-base sm:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
