import React from "react";

// Storybook mock for next/image — avoids 'process is not defined' error in Vite
const NextImage = ({
  src,
  alt = "",
  width,
  height,
  className,
  style,
}: {
  src: string | { src: string };
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const resolvedSrc = typeof src === "string" ? src : src?.src ?? "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
};

export default NextImage;
