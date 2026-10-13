/**
 * Video Utilities for Activities & Field Operations Dispatches
 * Handles YouTube URL parsing, embed conversion, thumbnail generation, and video validation.
 */

/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://m.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://www.youtube.com/live/dQw4w9WgXcQ
 * - Raw video ID (11 chars alphanumeric + - _)
 */
export function getYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

/**
 * Converts a YouTube URL or Video ID into a privacy-respecting YouTube Embed URL
 */
export function getYouTubeEmbedUrl(input: string): string | null {
  const videoId = getYouTubeVideoId(input);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

/**
 * Gets high-quality video poster thumbnail from YouTube
 */
export function getYouTubeThumbnailUrl(input: string, quality: 'hq' | 'maxres' = 'hq'): string | null {
  const videoId = getYouTubeVideoId(input);
  if (!videoId) return null;
  return quality === 'maxres'
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Checks if a given string is a valid YouTube link or ID
 */
export function isYouTubeUrl(input: string): boolean {
  return getYouTubeVideoId(input) !== null;
}

/**
 * Detects if a URL points to a hosted video or base64 video data URL
 */
export function isUploadedVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  if (lower.startsWith('data:video/')) return true;
  if (lower.startsWith('/uploads/videos/')) return true;
  if (lower.includes('/uploads/')) return true;
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(lower);
}
