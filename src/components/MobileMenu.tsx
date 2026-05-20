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
        className="p-2 text-gray-500 hover:text-black transition-colors relative z-[110]"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Full Opaque Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
          <nav className="flex flex-col space-y-12 text-center">
            <a 
              href="/category/trends" 
              className="text-4xl font-black uppercase tracking-[0.2em] text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Trend
            </a>
            <a 
              href="/category/opportunity" 
              className="text-4xl font-black uppercase tracking-[0.2em] text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Opportunity
            </a>
            <a 
              href="/category/insight" 
              className="text-4xl font-black uppercase tracking-[0.2em] text-gray-900 hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Insight
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
