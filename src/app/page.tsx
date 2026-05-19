import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import SmartImage from "@/components/SmartImage";

export default function Home() {
  const allPosts = getSortedPostsData();
  // allPosts is already sorted by getSortedPostsData descending (newest first)
  const featuredPost = allPosts[0];
  const remainingPosts = allPosts.slice(1);

  const defaultHeroImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop";
  const defaultGridImage = "https://images.unsplash.com/photo-1620712943543-bcc4628c6757?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="space-y-24">
      {/* Hero Section: Featured Post */}
      {featuredPost && (
        <section className="relative group">
          <Link href={`/blog/${featuredPost.slug}`} className="grid md:grid-cols-2 gap-0 bg-white overflow-hidden rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-500">
            <div className="relative h-64 md:h-auto bg-gray-900 overflow-hidden">
              <SmartImage 
                src={featuredPost.coverImage || defaultHeroImage} 
                alt={featuredPost.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
              <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-blue-600">
                <span>Featured Insight</span>
                <span className="w-8 h-px bg-blue-600" />
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight group-hover:text-blue-900 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 text-lg line-clamp-3 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-serif font-bold text-gray-500">N</div>
                <div className="text-sm">
                  <p className="font-bold text-gray-900">Nexthos</p>
                  <p className="text-gray-500">{format(new Date(featuredPost.date), "yyyy년 M월 d일", { locale: ko })}</p>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

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
        <div className="space-y-2">
          <h3 className="text-2xl font-serif font-bold">Nexus Ethos Intelligence</h3>
          <p className="text-gray-500">4060 세대를 위한 가장 깊이 있는 AI 인사이트를 매일 아침 전해드립니다.</p>
        </div>
        <button className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-800 transition shadow-lg shadow-black/10">
          SUBSCRIBE FREE
        </button>
      </section>
    </div>
  );
}
