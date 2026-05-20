import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page } = await searchParams;
  
  const allPosts = getSortedPostsData();
  const filteredPosts = allPosts.filter(post => post.category === id);

  const POSTS_PER_PAGE = 10;
  const currentPage = parseInt(page || "1");
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const categoryMap: Record<string, { en: string; ko: string }> = {
    trends: { en: "Trend", ko: "AI 기술 동향" },
    opportunity: { en: "Opportunity", ko: "AI 시대의 새로운 지평" },
    insight: { en: "Insight", ko: "에토스의 지혜와 성찰" }
  };

  const currentCategory = categoryMap[id] || { en: id, ko: id };

  return (
    <div className="space-y-12">
      <header className="py-16 border-b border-gray-100 text-center space-y-4">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600">CATEGORY</h1>
        <div className="space-y-2">
          <h2 className="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tight">{currentCategory.en}</h2>
          <p className="text-lg md:text-xl font-medium text-gray-400 italic font-serif">{currentCategory.ko}</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
        {paginatedPosts.map((post) => (
          <article key={post.slug} className="flex flex-col space-y-4 group">
            <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
              <SmartImage 
                src={post.coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop"} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </Link>
            <div className="space-y-3">
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-xl font-serif font-bold leading-tight group-hover:text-gray-600 transition">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <p className="text-center py-24 text-gray-400 font-serif italic">아직 이 카테고리에 발행된 통찰이 없습니다.</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-12 border-t border-gray-100">
          <Link
            href={`/category/${id}?page=${Math.max(1, currentPage - 1)}`}
            className={`p-2 rounded-full border transition ${currentPage === 1 ? "text-gray-200 border-gray-100 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            <ChevronLeft size={20} />
          </Link>
          
          <div className="text-sm font-bold text-gray-400">
            <span className="text-black">{currentPage}</span> / {totalPages}
          </div>

          <Link
            href={`/category/${id}?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`p-2 rounded-full border transition ${currentPage === totalPages ? "text-gray-200 border-gray-100 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      )}
    </div>
  );
}
