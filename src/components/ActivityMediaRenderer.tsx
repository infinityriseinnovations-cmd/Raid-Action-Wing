import React, { useState } from 'react';
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl, isYouTubeUrl } from '../utils/videoUtils';

interface ActivityMediaRendererProps {
  mediaType?: 'image' | 'video';
  image?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'upload';
  title: string;
  mode?: 'card' | 'hero' | 'preview' | 'inline';
  className?: string;
  autoPlay?: boolean;
}

export const ActivityMediaRenderer: React.FC<ActivityMediaRendererProps> = ({
  mediaType = 'image',
  image,
  videoUrl,
  videoType,
  title,
  mode = 'hero',
  className = '',
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [videoError, setVideoError] = useState(false);

  const effectiveVideoType = videoType || (videoUrl && isYouTubeUrl(videoUrl) ? 'youtube' : 'upload');
  const ytEmbedUrl = videoUrl && effectiveVideoType === 'youtube' ? getYouTubeEmbedUrl(videoUrl) : null;
  const posterImage = image || (videoUrl && effectiveVideoType === 'youtube' ? (getYouTubeThumbnailUrl(videoUrl) || undefined) : undefined);

  // If card mode and has video, we can show thumbnail with video badge and play button
  if (mode === 'card') {
    const hasVideo = Boolean(videoUrl && videoUrl.trim());

    return (
      <div className={`relative w-full h-full overflow-hidden bg-slate-950 ${className}`}>
        {posterImage ? (
          <img
            src={posterImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-4">
            <span className="material-symbols-outlined text-4xl text-slate-500 mb-1">
              {hasVideo ? 'smart_display' : 'article'}
            </span>
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {hasVideo ? 'Field Video Dispatch' : 'RAWF Dispatch'}
            </span>
          </div>
        )}

        {/* Video Overlay Badge if Video Exists */}
        {hasVideo && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-red-600/90 text-white text-[10px] font-bold uppercase rounded-md shadow-md backdrop-blur-xs">
            <span className="material-symbols-outlined text-[14px]">
              {effectiveVideoType === 'youtube' ? 'smart_display' : 'videocam'}
            </span>
            <span>
              {mediaType === 'video' ? 'Featured Video' : 'Video Attached'}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Hero / Preview / Inline Player
  if (mediaType === 'video' && videoUrl && !videoError) {
    if (effectiveVideoType === 'youtube' && ytEmbedUrl) {
      return (
        <div className={`relative w-full aspect-video bg-black overflow-hidden rounded-lg shadow-md ${className}`}>
          <iframe
            src={ytEmbedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }

    if (effectiveVideoType === 'upload' && videoUrl) {
      return (
        <div className={`relative w-full aspect-video bg-black overflow-hidden rounded-lg shadow-md ${className}`}>
          <video
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            poster={posterImage}
            onError={() => setVideoError(true)}
            className="w-full h-full object-contain bg-black"
          >
            Your browser does not support HTML5 video playback.
          </video>
        </div>
      );
    }
  }

  // Fallback to Image
  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-900 ${className}`}>
      {posterImage ? (
        <img
          src={posterImage}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6">
          <span className="material-symbols-outlined text-5xl text-slate-600 mb-2">article</span>
          <span className="text-xs font-mono text-slate-400">RAWF Official Dispatch</span>
        </div>
      )}
    </div>
  );
};
