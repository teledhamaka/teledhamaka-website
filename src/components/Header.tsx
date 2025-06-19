// src/components/Header.tsx
'use client';


import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-90 transition-opacity">
          Tele Dhamaka
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
          <Link href="/broadband" className="hover:text-blue-200 transition-colors">broadband</Link>
          <Link href="/mobile" className="hover:text-blue-200 transition-colors">mobile</Link>
          <Link href="/blog" className="hover:text-blue-200 transition-colors">blog</Link>
          <Link href="/coverage" className="hover:text-blue-200 transition-colors">coverage</Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            aria-label="Open menu" 
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-blue-800 shadow-lg z-50">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
              <Link href="/" className="hover:text-blue-200 transition-colors py-2" onClick={toggleMenu}>Home</Link>
              <Link href="/broadband" className="hover:text-blue-200 transition-colors py-2" onClick={toggleMenu}>broadband</Link>
              <Link href="/mobile" className="hover:text-blue-200 transition-colors py-2" onClick={toggleMenu}>mobile</Link>
              <Link href="/blog" className="hover:text-blue-200 transition-colors py-2" onClick={toggleMenu}>blog</Link>
              <Link href="/coverage" className="hover:text-blue-200 transition-colors py-2" onClick={toggleMenu}>coverage</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}