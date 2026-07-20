import React, { useState } from 'react';

const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect fill="#F5EDE4" width="400" height="300"/>
  <g fill="none" stroke="#C8956C" stroke-width="1.5" opacity="0.5">
    <rect x="160" y="110" width="80" height="80" rx="10"/>
    <path d="M180 145 h40 M200 125 v40"/>
  </g>
  <text x="200" y="220" text-anchor="middle" font-family="system-ui" font-size="13" fill="#A89888">
    Imagen no disponible
  </text>
</svg>
`)}`;

/**
 * ImageFallback – <img> wrapper that shows a placeholder SVG on error.
 *
 * Props:
 *   src         {string}  Image source URL
 *   alt         {string}  Alt text (required for accessibility)
 *   fallbackSrc {string}  Optional custom fallback image URL
 *   className   {string}  CSS class for the <img>
 *   ...rest               Any other <img> props (style, loading, etc.)
 */
const ImageFallback = ({ src, alt, fallbackSrc, className, style, ...rest }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const imgSrc = hasError ? (fallbackSrc || PLACEHOLDER_SVG) : src;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...rest}
    />
  );
};

export default ImageFallback;
