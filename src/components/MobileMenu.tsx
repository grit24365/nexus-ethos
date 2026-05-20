"use client";

import { useState } from "react";
import { X, Menu } from "lucide-react";
import Link from "next/link";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden relative">
      <button 
        onClick={toggleMenu}
        className="p-2 text-gray-500 hover:text-black transition-colors"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Boxy Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[110] animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col py-2">
            <Link 
              href="/" 
              className="px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-gray-900 hover:bg-gray-50 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              HOME
            </Link>
            <Link 
              href="/category/trends" 
              className="px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-gray-900 hover:bg-gray-50 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              TREND
            </Link>
            <Link 
              href="/category/opportunity" 
              className="px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-gray-900 hover:bg-gray-50 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              OPPORTUNITY
            </Link>
            <Link 
              href="/category/insight" 
              className="px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              INSIGHT
            </Link>
          </nav>
        </div>
      )}
      
      {/* Invisible backdrop to close when clicking outside, but not a dark overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
