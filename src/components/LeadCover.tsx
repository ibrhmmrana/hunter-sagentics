/**
 * Cover image component for lead cards with aspect ratio and fallback
 */

import { useMemo, useState, useCallback } from 'react';
import { toProxyUrl } from '@/lib/images';
import LeadLogo from '@/components/LeadLogo';

type Props = {
  title?: string | null;
  imageUrl?: string | null;
  aspect?: '16/9' | '4/3' | '1/1';
  rounded?: 'lg' | 'md';
  className?: string;
};

type Stage = 'orig' | 'proxy' | 'fail';

export default function LeadCover({ 
  title, 
  imageUrl, 
  aspect = '16/9',
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

  const aspectClass = aspect === '1/1' ? 'aspect-square' : aspect === '4/3' ? 'aspect-[4/3]' : 'aspect-video';
  const radiusClass = rounded === 'md' ? 'rounded-md' : 'rounded-lg';

  // Show fallback if no image or failed
  if (!imageUrl || stage === 'fail') {
    return (
      <div className={`relative ${aspectClass} ${radiusClass} bg-muted overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <LeadLogo 
            title={title} 
            imageUrl={imageUrl} 
            size={96} 
            rounded="lg" 
          />
        </div>
      </div>
    );
  }

  // Determine which URL to use based on stage
  const currentUrl = stage === 'orig' ? imageUrl : (proxyUrl ?? imageUrl);

  return (
    <div className={`relative ${aspectClass} ${radiusClass} bg-muted overflow-hidden ${className}`}>
      <img
        src={currentUrl}
        alt={title || 'Business cover'}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={handleError}
      />
    </div>
  );
}
