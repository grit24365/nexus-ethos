import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function ArchivePage() {
  const allPosts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <header className="py-12 border-b border-gray-100 text-center">
        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-blue-600 mb-4">INTELLIGENCE</h1>
        <h2 className="text-5xl font-serif font-bold">전체 아카이브</h2>
        <p className="mt-4 text-gray-400 font-serif italic">과거로부터 축적된 기술과 시대의 성찰</p>
      </header>
      
      <div className="space-y-12">
        {allPosts.map((post) => (
          <article key={post.slug} className="group grid md:grid-cols-4 gap-8 items-start">
            <div className="text-sm font-bold text-gray-300 font-serif md:text-right pt-2">
              {format(new Date(post.date), "yyyy. MM. dd")}
            </div>
            <div className="md:col-span-3 space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
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
    </div>
  );
}
