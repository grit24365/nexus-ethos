import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "넥서스 에토스 (Nexus Ethos) | AI 시대의 지혜와 성찰",
  description: "데이터와 세대를 연결하는 통찰. 4060 세대를 위한 고품격 AI 트렌드 및 생존 전략 매거진.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased bg-[#f8f9fa] text-[#1a1a1a]">
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
                  <a href="/" className="hover:opacity-80 transition">NEXUS ETHOS</a>
                </h1>
              </div>
              <nav className="hidden md:flex space-x-10 text-sm font-bold uppercase tracking-widest text-gray-500">
                <a href="/category/trends" className="hover:text-black transition py-2 border-b-2 border-transparent hover:border-black">Trends</a>
                <a href="/category/opportunity" className="hover:text-black transition py-2 border-b-2 border-transparent hover:border-black">Opportunity</a>
                <a href="/category/insight" className="hover:text-black transition py-2 border-b-2 border-transparent hover:border-black">Insight</a>
              </nav>
              <button className="md:hidden p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
            </div>
          </header>
          
          <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
            {children}
          </main>
          
          <footer className="bg-[#1a1a1a] text-white py-16 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold">NEXUS ETHOS</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Connecting Data, Wisdom, and Generations. 우리는 기술의 진보 속에서 인간다운 가치를 찾아냅니다.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Categories</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">AI 기술 동향</a></li>
                  <li><a href="#" className="hover:text-white transition">위기와 기회</a></li>
                  <li><a href="#" className="hover:text-white transition">4060 통찰</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Legal & About</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                  <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
                  <li><a href="/privacy" className="hover:text-white transition">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Nexus Ethos. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
