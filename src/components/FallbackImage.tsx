"use client";

import Image, { ImageProps } from "next/image";
import { FC, useEffect, useState } from "react";

export const fallbackImage = "/user.png";

interface Props {
  fallback?: string;
  alt: string;
  src: string;
}

export const ImageWithFallback: FC<Props & ImageProps> = ({
  fallback = fallbackImage,
  alt,
  src,
  ...props
}) => {
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={(event) => setError(event)}
      src={error ? fallback : src}
      placeholder={"blur"}
      blurDataURL={fallback}
      {...props}
    />
  );
};
