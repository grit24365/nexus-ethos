"use client";

import { Share2, Link, Facebook, Twitter, MessageCircle } from "lucide-react";

interface SocialShareProps {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다.");
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
          <button 
            onClick={shareFacebook}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
            aria-label="Share on Facebook"
          >
            <Facebook size={20} />
          </button>
          <button 
            onClick={shareTwitter}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
            aria-label="Share on X (Twitter)"
          >
            <Twitter size={20} />
          </button>
          <button 
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#FEE500] hover:text-black hover:border-[#FEE500] transition-all shadow-sm"
            aria-label="Share on KakaoTalk"
            onClick={() => alert("카카오톡 공유 기능은 카카오 SDK 설정 후 활성화됩니다.")}
          >
            <MessageCircle size={20} />
          </button>
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
