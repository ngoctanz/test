/**
 * SEO Module - Central Export
 *
 * Import everything you need for SEO in one place:
 * import { generatePageMetadata, SITE_CONFIG, organizationSchema } from '@/lib/seo';
 */

// Constants
export {
  SITE_CONFIG,
  GAME_CATEGORIES,
  SEO_KEYWORDS,
  SOCIAL_LINKS,
  TRUST_INDICATORS,
  META_DEFAULTS,
} from "./seo.constants";

// Utilities
export {
  generatePageMetadata,
  generateGamePageMetadata,
  generateAccountPageMetadata,
  getCanonicalUrl,
  generateBreadcrumbSchema,
  stripHtml,
  truncateText,
  generateSocialMeta,
} from "./seo.utils";

// Schemas
export {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  productSchema,
  faqSchema,
  reviewSchema,
  aggregateRatingSchema,
} from "./schema";

// Re-export for convenience
export type { Metadata } from "next";
