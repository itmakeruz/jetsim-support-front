import { LazyLoadImage } from "react-lazy-load-image-component";
import type { LazyLoadImageProps } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface LazyImageProps extends Omit<LazyLoadImageProps, "src" | "alt"> {
  src: string;
  alt: string;
  effect?: "blur" | "opacity" | "black-and-white";
  threshold?: number;
  onLoad?: () => void;
}

export default function LazyImage({
  src,
  alt,
  effect = "blur",
  threshold = 100,
  className = "",
  onLoad,
  ...props
}: LazyImageProps) {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      className={className}
      effect={effect}
      threshold={threshold}
      onLoad={onLoad}
      {...props}
    />
  );
}
