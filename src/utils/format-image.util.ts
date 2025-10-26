export function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  return url.toLowerCase().endsWith(".mp4");
}

export function isImageUrl(url?: string): boolean {
  if (!url) return false;
  return !isVideoUrl(url);
}

export function getMediaType(url?: string): "video" | "image" | "unknown" {
  if (!url) return "unknown";
  if (isVideoUrl(url)) return "video";
  return "image";
}
