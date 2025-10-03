/**
 * Lead image preview component with dialog
 * Shows large image preview with title and Maps link
 */

import { useState } from "react";
import { ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LeadImagePreviewProps {
  src?: string | null;
  title?: string | null;
  mapsUrl?: string | null;
  trigger: React.ReactNode;
}

export default function LeadImagePreview({ 
  src, 
  title, 
  mapsUrl, 
  trigger 
}: LeadImagePreviewProps) {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>
      
      <DialogContent className="max-w-[min(90vw,920px)] max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold truncate pr-4">
              {title || "Business Image"}
            </span>
            {mapsUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-shrink-0"
              >
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Maps
                </a>
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
            {src && !imageError ? (
              <>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                <img
                  src={src}
                  alt={title || "Business image"}
                  className="max-w-full max-h-[60vh] object-contain"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                <ImageIcon className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">No image available</p>
                <p className="text-sm">This business doesn't have a preview image</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
