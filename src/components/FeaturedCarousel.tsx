"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import SmartImage from "@/components/SmartImage";
import { Post } from "@/lib/posts";

interface FeaturedCarouselProps {
  posts: Post[];
}

export default function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentState] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % posts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [posts.length, isPaused]);

  const prevSlide = () => {
    setCurrentState((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentState((prev) => (prev + 1) % posts.length);
  };

  if (!posts.length) return null;

  return (
    <section 
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden rounded-3xl shadow-xl border border-gray-100 bg-white">
        <div 
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {posts.map((post) => (
            <div key={post.slug} className="w-full flex-shrink-0">
              <Link href={`/blog/${post.slug}`} className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-[450px] bg-gray-900 overflow-hidden text-white">
                  <SmartImage 
                    src={post.coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop"} 
                    alt={post.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden" />
                </div>
                <div className="p-8 md:p-16 flex flex-col justify-center space-y-6">
                  <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-[0.3em] text-blue-600">
                    <span>Featured Insight</span>
                    <span className="w-8 h-px bg-blue-600" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight group-hover:text-blue-900 transition-colors line-clamp-2 md:line-clamp-none">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-lg line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-50">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-serif font-bold text-gray-400 border border-gray-100">N</div>
                    <div className="text-sm">
                      <p className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Editor Nexthos</p>
                      <p className="text-gray-400">{format(new Date(post.date), "yyyy년 M월 d일", { locale: ko })}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white md:text-gray-400 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white md:text-gray-400 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentState(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-blue-600" : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
