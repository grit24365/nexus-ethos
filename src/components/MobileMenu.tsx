"use client";

import { useState } from "react";
import { X, Menu } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <button 
        onClick={toggleMenu}
        className="p-2 text-gray-500 hover:text-black transition-colors"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white pt-20 px-6 animate-in slide-in-from-top duration-300">
          <button 
            onClick={toggleMenu}
            className="absolute top-6 right-6 p-2 text-gray-500"
          >
            <X size={32} />
          </button>
          
          <nav className="flex flex-col space-y-8 text-center mt-12">
            <a 
              href="/category/trends" 
              className="text-2xl font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Trend
              <span className="block text-xs font-medium lowercase tracking-normal mt-1 italic text-gray-400">AI 기술 동향</span>
            </a>
            <a 
              href="/category/opportunity" 
              className="text-2xl font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Opportunity
              <span className="block text-xs font-medium lowercase tracking-normal mt-1 italic text-gray-400">AI 시대의 새로운 지평</span>
            </a>
            <a 
              href="/category/insight" 
              className="text-2xl font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Insight
              <span className="block text-xs font-medium lowercase tracking-normal mt-1 italic text-gray-400">에토스의 지혜와 성찰</span>
            </a>
            
            <div className="pt-12 border-t border-gray-100 flex flex-col space-y-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <a href="/about" onClick={() => setIsOpen(false)}>About</a>
              <a href="/archive" onClick={() => setIsOpen(false)}>Archive</a>
              <a href="/contact" onClick={() => setIsOpen(false)}>Contact</a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
