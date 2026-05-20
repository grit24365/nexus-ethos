"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  // Add clones for infinite loop: [Last, Post1, Post2, Post3, First]
  const extendedPosts = posts.length > 1 
    ? [posts[posts.length - 1], ...posts, posts[0]] 
    : posts;

  const [currentIndex, setCurrentIndex] = useState(posts.length > 1 ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(posts.length);
    } else if (currentIndex === extendedPosts.length - 1) {
      setCurrentIndex(1);
    }
  }, [currentIndex, posts.length, extendedPosts.length]);

  const moveSlide = useCallback((direction: "next" | "prev") => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (direction === "next") {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (isPaused || posts.length <= 1) return;
    timerRef.current = setInterval(() => {
      moveSlide("next");
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [moveSlide, isPaused, posts.length]);

  if (!posts.length) return null;

  return (
    <section 
      className="relative group max-w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="rounded-[2.5rem] shadow-2xl border border-gray-100 bg-white overflow-hidden">
        <div 
          className={`flex ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedPosts.map((post, idx) => (
            <div key={`${post.slug}-${idx}`} className="w-full flex-shrink-0">
              <Link href={`/blog/${post.slug}`} className="grid md:grid-cols-2 gap-0 items-stretch">
                {/* Image Section */}
                <div className="relative h-64 md:h-[420px] bg-gray-900 overflow-hidden">
                  <SmartImage 
                    src={post.coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop"} 
                    alt={post.title}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-14 flex flex-col justify-center space-y-6 bg-white relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-[0.4em] text-blue-600">
                      <span>Featured Insight</span>
                      <span className="w-10 h-[1.5px] bg-blue-600/20" />
                    </div>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold leading-[1.2] tracking-tight text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2 md:line-clamp-3">
                      {post.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed font-serif italic line-clamp-2 md:line-clamp-3 border-l-4 border-gray-100 pl-5">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center space-x-4 pt-4">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-serif font-bold text-gray-400 border border-gray-100 shadow-inner text-xs">
                      N
                    </div>
                    <div className="space-y-0">
                      <p className="font-black text-gray-900 uppercase tracking-widest text-[10px]">Editor Nexthos</p>
                      <p className="text-gray-400 text-xs font-medium">
                        {format(new Date(post.date), "yyyy년 M월 d일", { locale: ko })}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls - Refined UI */}
      {posts.length > 1 && (
        <>
          <button 
            onClick={() => moveSlide("prev")}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-xl shadow-xl flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20 border border-gray-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => moveSlide("next")}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-xl shadow-xl flex items-center justify-center text-gray-400 hover:text-black hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20 border border-gray-100"
            aria-label="Next slide"
          >
            <ChevronRight size={28} strokeWidth={1.5} />
          </button>

          {/* Indicators - Refined */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-20">
            {posts.map((_, index) => {
              const isActive = (currentIndex === index + 1) || 
                               (currentIndex === 0 && index === posts.length - 1) ||
                               (currentIndex === extendedPosts.length - 1 && index === 0);
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (isTransitioning) return;
                    setIsTransitioning(true);
                    setCurrentIndex(index + 1);
                  }}
                  className={`transition-all duration-500 ease-out ${
                    isActive 
                      ? "w-10 h-1.5 bg-blue-600 rounded-full" 
                      : "w-2 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
