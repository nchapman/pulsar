import { memo, ReactNode, useLayoutEffect } from 'preact/compat';
import { useState } from 'preact/hooks';

interface AppImgProps {
  className?: string;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  alt?: string;
  src: string;
}

export const AppImg = memo((props: any | AppImgProps) => {
  const { className, fallback, errorFallback, alt = 'image', src, ...otherProps } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useLayoutEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src ?? '';

    img.onload = () => {
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
  }, [src]);

  if (isLoading && fallback) {
    return fallback;
  }

  if (hasError && errorFallback) {
    return errorFallback;
  }

  return <img alt={alt} src={src} className={className} {...otherProps} />;
});
