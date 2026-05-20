import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import SmartImage from "@/components/SmartImage";
import FeaturedCarousel from "@/components/FeaturedCarousel";

export default function Home() {
  const allPosts = getSortedPostsData();
  
  // Latest 3 posts for the Carousel
  const featuredPosts = allPosts.slice(0, 3);
  // Remaining posts for the Grid (Limit to 9)
  const remainingPosts = allPosts.slice(3, 12);

  const defaultGridImage = "https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="space-y-24">
      {/* Hero Section: Dynamic Carousel for top 3 posts */}
      <FeaturedCarousel posts={featuredPosts} />

      {/* Grid Section for Regular Posts */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-gray-400">Latest Intelligence</h2>
          <Link href="/archive" className="text-sm font-bold hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {remainingPosts.map((post) => (
            <article key={post.slug} className="flex flex-col space-y-4 group">
              <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                <SmartImage 
                  src={post.coverImage || defaultGridImage} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {post.category}
                </span>
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
      </section>

      {/* Subscription/Ad Highlighting Box */}
      <section className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-serif font-bold">Nexus Ethos Intelligence</h3>
          <p className="text-gray-500">지혜로운 세대를 위한 가장 깊이 있는 AI 인사이트를 매일 아침 전해드립니다.</p>
        </div>
        <button className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-800 transition shadow-lg shadow-black/10">
          SUBSCRIBE FREE
        </button>
      </section>
    </div>
  );
}
