import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArchivePage({ searchParams }: Props) {
  const { page } = await searchParams;
  const allPosts = getSortedPostsData();
  
  const POSTS_PER_PAGE = 10;
  const currentPage = parseInt(page || "1");
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <header className="py-12 border-b border-gray-100 text-center">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600 mb-4">INTELLIGENCE</h1>
        <h2 className="text-5xl font-serif font-bold">전체 아카이브</h2>
        <p className="mt-4 text-gray-400 font-serif italic">과거로부터 축적된 기술과 시대의 성찰</p>
      </header>
      
      <div className="space-y-12 min-h-[600px]">
        {paginatedPosts.map((post) => (
          <article key={post.slug} className="group grid md:grid-cols-4 gap-8 items-start">
            <div className="text-sm font-bold text-gray-300 font-serif md:text-right pt-2">
              {format(new Date(post.date), "yyyy. MM. dd")}
            </div>
            <div className="md:col-span-3 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit inline-block">
                {post.category}
              </span>
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-2xl font-serif font-bold group-hover:text-gray-600 transition">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-12 border-t border-gray-100">
          <Link
            href={`/archive?page=${Math.max(1, currentPage - 1)}`}
            className={`p-2 rounded-full border transition ${currentPage === 1 ? "text-gray-200 border-gray-100 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            <ChevronLeft size={20} />
          </Link>
          
          <div className="text-sm font-bold text-gray-400">
            <span className="text-black">{currentPage}</span> / {totalPages}
          </div>

          <Link
            href={`/archive?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`p-2 rounded-full border transition ${currentPage === totalPages ? "text-gray-200 border-gray-100 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      )}
    </div>
  );
}
