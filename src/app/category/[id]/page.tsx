import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const allPosts = getSortedPostsData();
  const filteredPosts = allPosts.filter(post => post.category === id);

  const categoryNames: Record<string, string> = {
    trends: "AI 기술 동향",
    opportunity: "AI 시대의 새로운 지평",
    insight: "에토스의 지혜와 성찰"
  };

  return (
    <div className="space-y-12">
      <header className="py-12 border-b border-gray-100">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600 mb-4 text-center">CATEGORY</h1>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center capitalize">{categoryNames[id] || id}</h2>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="flex flex-col space-y-4 group">
            <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
              <img 
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
    </div>
  );
}
