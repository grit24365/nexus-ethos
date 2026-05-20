"use client";

import { Share2, Link } from "lucide-react";

interface SocialShareProps {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다.");
    }
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <div className="py-12 border-t border-gray-100 mt-16">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-2 text-sm font-black uppercase tracking-[0.2em] text-gray-400">
          <Share2 size={16} />
          <span>Share this Insight</span>
        </div>
        
        <div className="flex space-x-6">
          {/* Facebook Icon (SVG) */}
          <button 
            onClick={shareFacebook}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
            aria-label="Share on Facebook"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </button>

          {/* X (Twitter) Icon (SVG) */}
          <button 
            onClick={shareTwitter}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
            aria-label="Share on X (Twitter)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 7.719 8.502 11.25h-6.657l-5.203-6.817-5.962 6.817H1.841l7.737-8.85L1.254 2.25h6.826l4.704 6.221 5.464-6.221z"/></svg>
          </button>

          {/* KakaoTalk Icon (SVG) */}
          <button 
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#FEE500] hover:text-black hover:border-[#FEE500] transition-all shadow-sm"
            aria-label="Share on KakaoTalk"
            onClick={() => alert("모바일에서 카카오톡 앱을 통해 공유하실 수 있습니다.")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.315 6.055-.188.702-.68 2.541-.778 2.94-.123.494.182.488.383.351.158-.107 2.518-1.71 3.54-2.408.497.054 1.01.082 1.54.082 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/></svg>
          </button>

          {/* Link Copy Icon */}
          <button 
            onClick={copyLink}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all shadow-sm"
            aria-label="Copy Link"
          >
            <Link size={20} />
          </button>
        </div>
        
        <p className="text-xs text-gray-400 font-serif italic text-center max-w-xs">
          가치 있는 통찰은 나누었을 때 더 큰 지혜가 됩니다.<br/>주변의 소중한 분들에게 이 통찰을 전해주세요.
        </p>
      </div>
    </div>
  );
}
