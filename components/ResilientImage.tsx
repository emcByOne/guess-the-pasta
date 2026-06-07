"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Added "png" to the fallback chain as you requested!
type ImageFormat = "avif" | "webp" | "png" | "jpg";

interface ResilientImageProps {
  imageName: string; 
  alt: string;
  className?: string; 
  style?: React.CSSProperties; // <-- Added this line to accept inline styles
}

export function ResilientImage({ imageName, alt, className = "", style }: ResilientImageProps) {
  const [format, setFormat] = useState<ImageFormat>("avif");

  // Reset to 'avif' whenever the imageName changes
  useEffect(() => {
    setFormat("avif");
  }, [imageName]);

  const handleError = () => {
    // The fallback chain: avif -> webp -> png -> jpg
    if (format === "avif") {
      setFormat("webp");
    } else if (format === "webp") {
      setFormat("png");
    } else if (format === "png") {
      setFormat("jpg");
    }
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-muted ${className}`}>
      <Image
        src={`/images/${imageName}.${format}`}
        alt={alt}
        width={500}
        height={500}
        className="aspect-square w-full object-cover transition-all duration-500"
        style={style} // <-- Pass the style prop (containing the blur filter) directly to the image
        onError={handleError}
        unoptimized // Required for static export
        priority 
      />
    </div>
  );
}