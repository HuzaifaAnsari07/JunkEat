
"use client";

import { motion } from "framer-motion";

interface AnimatedHeadingProps {
  text: string;
  subtext?: string;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
    }
  },
};

const underlineVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
        scaleX: 1,
        originX: 0,
        transition: {
            duration: 0.8,
            ease: [0.6, 0.01, -0.05, 0.95],
            delay: 1,
        }
    }
}

const subtextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            delay: 1.2,
        }
    }
}

export default function AnimatedHeading({ text, subtext, className }: AnimatedHeadingProps) {
  const letters = Array.from(text);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <motion.h1
        className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold flex flex-wrap justify-center items-center glassy-text"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        data-text={text}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block"
            whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>

      <motion.div
        className="mt-2 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 w-3/5 rounded-full"
        variants={underlineVariants}
        initial="hidden"
        animate="visible"
      />

      {subtext && (
          <motion.p 
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
            variants={subtextVariants}
            initial="hidden"
            animate="visible"
          >
              {subtext}
          </motion.p>
      )}
    </div>
  );
}
