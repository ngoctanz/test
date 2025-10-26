import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Best Game Account Store - Premium Gaming Accounts",
    short_name: "Best Game Accounts",
    description:
      "Buy premium game accounts for League of Legends, Genshin Impact, Arknights, Mobile Legends, Honkai Star Rail, Wuthering Waves & more. Instant delivery, secure transactions.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#8b5cf6",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["games", "entertainment", "shopping"],
    lang: "en",
    dir: "ltr",
    scope: "/",
    prefer_related_applications: false,
  };
}
