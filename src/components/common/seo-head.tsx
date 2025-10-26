/**
 * SEO Head Component
 * This component provides easy-to-use SEO functionality for any page
 *
 * Usage:
 * import { SEOHead } from '@/components/common/seo-head';
 *
 * <SEOHead
 *   title="Page Title"
 *   description="Page description"
 *   keywords={["keyword1", "keyword2"]}
 * />
 */

import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/seo.constants";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = "/logo.jpg",
  url = "/",
  type = "website",
  noIndex = false,
  author,
  publishedTime,
  modifiedTime,
}: SEOHeadProps): Metadata {
  const fullTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;

  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_CONFIG.url}${image}`;

  const pageUrl = `${SITE_CONFIG.url}${url}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type,
      locale: SITE_CONFIG.locale,
      url: pageUrl,
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
      ...(publishedTime && type === "article" && { publishedTime }),
      ...(modifiedTime && type === "article" && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@BestGameAccounts",
    },
  };

  return metadata;
}

// Preset metadata generators for common pages
export const homePageSEO = (): Metadata =>
  generateSEOMetadata({
    title: "Best Game Account Store - Buy Premium Gaming Accounts",
    description:
      "Buy premium game accounts for League of Legends, Genshin Impact, Arknights, Mobile Legends, Honkai Star Rail & more. Instant delivery, secure transactions, trusted by 50,000+ gamers worldwide.",
    keywords: [
      "buy game accounts",
      "gaming accounts for sale",
      "League of Legends accounts",
      "Genshin Impact accounts",
      "premium gaming accounts",
    ],
    url: "/",
  });

export const aboutPageSEO = (): Metadata =>
  generateSEOMetadata({
    title: "About Us - Trusted Gaming Accounts Marketplace",
    description:
      "Learn about Best Game Account Store, the most trusted marketplace for premium gaming accounts. Serving 50,000+ gamers worldwide with secure transactions and instant delivery.",
    keywords: [
      "about us",
      "gaming marketplace",
      "trusted seller",
      "game accounts",
    ],
    url: "/about",
  });

export const contactPageSEO = (): Metadata =>
  generateSEOMetadata({
    title: "Contact Us - 24/7 Customer Support",
    description:
      "Get in touch with our customer support team. We're available 24/7 to help you with your gaming account purchase. Fast response guaranteed.",
    keywords: ["contact", "customer support", "help", "support"],
    url: "/contact",
  });

export const faqPageSEO = (): Metadata =>
  generateSEOMetadata({
    title: "FAQ - Frequently Asked Questions",
    description:
      "Find answers to common questions about buying game accounts, payment methods, delivery time, account security, and more.",
    keywords: ["faq", "questions", "help", "guide", "how to buy"],
    url: "/faq",
  });
