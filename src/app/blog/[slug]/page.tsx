import { getPostData, getSortedPostsData } from "@/lib/posts";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import SmartImage from "@/components/SmartImage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  const defaultImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop";

  return (
    <article className="max-w-4xl mx-auto space-y-12">
      <header className="space-y-8 text-center">
        <div className="flex justify-center items-center space-x-2 text-sm text-blue-600 uppercase tracking-[0.2em] font-black">
          <span>{post.category}</span>
          <span className="text-gray-300">•</span>
          <time dateTime={post.date}>
            {format(new Date(post.date), "yyyy년 M월 d일", { locale: ko })}
          </time>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
          {post.title}
        </h1>
        
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-2xl">
          <SmartImage 
            src={post.coverImage || defaultImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="pt-4 flex items-center justify-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-serif">N</div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">By Nexthos, Nexus Ethos Editor</p>
        </div>
      </header>

      {/* Ad Slot: Above the Fold (ATF) */}
      <div className="max-w-3xl mx-auto w-full h-[100px] md:h-[250px] bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 text-xs tracking-widest uppercase mb-12 overflow-hidden">
        Premium Leaderboard Placement
      </div>

      <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl border border-gray-100 shadow-sm italic text-xl text-gray-700 leading-relaxed">
        {post.excerpt}
      </div>

      {/* Main Content with Ad Injector Strategy */}
      <div className="max-w-3xl mx-auto prose prose-xl prose-serif prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-li:mb-2 prose-img:rounded-2xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Ad Slot: In-Content (Bottom of Article) */}
      <div className="max-w-3xl mx-auto mt-24 py-16 border-y border-gray-100 flex flex-col items-center space-y-6">
        <p className="text-xs text-gray-400 uppercase tracking-[0.3em] font-bold">Recommended for You</p>
        <div className="w-full h-64 bg-gray-50 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-3xl group hover:bg-white transition-colors cursor-pointer">
          <span className="text-gray-300 text-sm font-bold tracking-widest uppercase text-center px-6 leading-relaxed">
            AI-Driven Strategic Recommendations<br/>(AdSense Matched Content)
          </span>
        </div>
      </div>

      <footer className="max-w-3xl mx-auto pt-12 pb-24">
        <a href="/" className="group flex items-center space-x-2 text-sm font-black uppercase tracking-widest">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to All Insights</span>
        </a>
      </footer>
    </article>
  );
}
