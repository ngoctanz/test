import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vn"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/policies": "/policies",
    "/deposit": "/deposit",
    "/login": "/login",
    "/register": "/register",
    "/histories": "/histories",
    "/games/[slug]": "/games/[slug]",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
