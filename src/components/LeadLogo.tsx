/**
 * Reliable lead logo component with proxy and fallback
 * Implements 3-stage loading: original → proxy → initials
 */

import { useMemo, useState, useCallback } from 'react';
import { toProxyUrl, initials } from '@/lib/images';

type Props = {
  title?: string | null;
  imageUrl?: string | null;
  size?: number;      // px, default 56
  rounded?: 'full' | 'lg' | 'md';
  className?: string;
};

type Stage = 'orig' | 'proxy' | 'fail';

export default function LeadLogo({ 
  title, 
  imageUrl, 
  size = 56, 
  rounded = 'lg',
  className = ''
}: Props) {
  const [stage, setStage] = useState<Stage>('orig');
  
  const proxyUrl = useMemo(() => toProxyUrl(imageUrl), [imageUrl]);
  
  const handleError = useCallback(() => {
    if (stage === 'orig' && proxyUrl) {
      setStage('proxy');
    } else {
      setStage('fail');
    }
  }, [stage, proxyUrl]);

  const radius = rounded === 'full' ? 'rounded-full' : rounded === 'md' ? 'rounded-md' : 'rounded-lg';
  const sizeStyle = { width: size, height: size };

  // Show placeholder if no image or failed
  if (!imageUrl || stage === 'fail') {
    return (
      <div
        className={`flex items-center justify-center ${radius} bg-muted text-muted-foreground object-cover ${className}`}
        style={sizeStyle}
        aria-label={title || 'Logo'}
        title={title || ''}
      >
        <span className="text-xs font-medium">{initials(title)}</span>
      </div>
    );
  }

  // Determine which URL to use based on stage
  const currentUrl = stage === 'orig' ? imageUrl : (proxyUrl ?? imageUrl);

  return (
    <img
      src={currentUrl}
      alt={title || 'Logo'}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleError}
      className={`${radius} object-cover ${className}`}
      style={sizeStyle}
    />
  );
}
