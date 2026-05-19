"use client";

import { useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function SmartImage({ src, alt, className }: SmartImageProps) {
  const defaultImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop";
  const [imgSrc, setImgSrc] = useState(src || defaultImage);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(defaultImage)}
    />
  );
}
