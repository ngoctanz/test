import { Metadata } from "next";
import { SITE_CONFIG, META_DEFAULTS } from "./seo.constants";

interface GenerateMetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  ogImage = "/logo.jpg",
  canonical = "/",
  noIndex = false,
  type = "website",
}: GenerateMetadataProps): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const imageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${SITE_CONFIG.url}${ogImage}`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: `${SITE_CONFIG.url}${canonical}`,
    },
    openGraph: {
      type,
      locale: SITE_CONFIG.locale,
      url: `${SITE_CONFIG.url}${canonical}`,
      title: fullTitle,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: META_DEFAULTS.twitterCard as "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: META_DEFAULTS.twitterCreator,
    },
  };
}

export function generateGamePageMetadata(
  gameName: string,
  gameSlug: string,
  description: string,
  keywords: string[] = []
): Metadata {
  return generatePageMetadata({
    title: `Buy ${gameName} Accounts - Premium & Verified`,
    description: `${description}. Instant delivery, secure transactions, and lifetime support. Shop now!`,
    keywords: [
      ...keywords,
      `buy ${gameName} accounts`,
      `${gameName} accounts for sale`,
      "secure game accounts",
      "instant delivery",
    ],
    ogImage: `/images/games/${gameSlug}.jpg`,
    canonical: `/games/${gameSlug}`,
    type: "website",
  });
}

export function generateAccountPageMetadata(
  accountName: string,
  gameName: string,
  price: number,
  description: string,
  imageUrl: string
): Metadata {
  return generatePageMetadata({
    title: `${accountName} - ${gameName} Account`,
    description: `${description.substring(0, 155)}... Buy now for $${price}!`,
    keywords: [
      gameName,
      "gaming account",
      "buy account",
      accountName,
      "verified account",
    ],
    ogImage: imageUrl,
    type: "article",
  });
}

export function getCanonicalUrl(path: string): string {
  return `${SITE_CONFIG.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function generateBreadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

// Helper to strip HTML tags from description
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "");
}

// Helper to truncate text for meta descriptions
export function truncateText(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

// Generate meta tags for social sharing
export function generateSocialMeta(
  title: string,
  description: string,
  imageUrl: string,
  url: string
) {
  return {
    "og:title": title,
    "og:description": description,
    "og:image": imageUrl,
    "og:url": url,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": imageUrl,
    "twitter:card": "summary_large_image",
  };
}
