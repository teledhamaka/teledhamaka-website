// src/fonts.ts
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Use swap for better perceived performance
  variable: '--font-inter', // Optional: Define a CSS variable
});