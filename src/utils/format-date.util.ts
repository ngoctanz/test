export function formatTimeAgo(isoDate: string): string {
  const now = new Date();
  const then = new Date(isoDate);
  const diff = (now.getTime() - then.getTime()) / 1000; // seconds

  if (diff < 60) return "just now";
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  const days = Math.floor(diff / 86400);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
