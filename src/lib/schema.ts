// Structured data for SEO - Schema.org JSON-LD

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Best Game Account Store",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://game-account-shop-next-js.vercel.app",
  logo: `${
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://game-account-shop-next-js.vercel.app"
  }/logo.png`,
  description:
    "Premium gaming accounts marketplace specializing in League of Legends, Genshin Impact, Arknights, Mobile Legends, and more popular games.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: ["English", "Vietnamese"],
  },
  sameAs: [
    // Add your social media links here
    "https://facebook.com/bestgameaccounts",
    "https://twitter.com/bestgameaccounts",
    "https://discord.com/invite/v2DfZ5tm9",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Best Game Account Store",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://game-account-shop-next-js.vercel.app",
  description:
    "Buy premium game accounts for all popular games with instant delivery and secure transactions.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://game-account-shop-next-js.vercel.app"
      }/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const productSchema = (product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: "InStock" | "OutOfStock";
  condition: "NewCondition" | "UsedCondition";
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.image,
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: product.currency,
    availability: `https://schema.org/${product.availability}`,
    itemCondition: `https://schema.org/${product.condition}`,
  },
  brand: {
    "@type": "Brand",
    name: "Best Game Account Store",
  },
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const reviewSchema = (review: {
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  author: {
    "@type": "Person",
    name: review.author,
  },
  reviewRating: {
    "@type": "Rating",
    ratingValue: review.rating,
    bestRating: 5,
  },
  reviewBody: review.reviewBody,
  datePublished: review.datePublished,
});

export const aggregateRatingSchema = (rating: {
  ratingValue: number;
  reviewCount: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  ratingValue: rating.ratingValue,
  bestRating: 5,
  ratingCount: rating.reviewCount,
  reviewCount: rating.reviewCount,
});
