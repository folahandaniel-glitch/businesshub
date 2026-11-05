import type { MetadataRoute } from "next";
import { siteBaseUrl } from "@/lib/seo-kit";

const ROUTES = ["/", "/shop", "/categories", "/deals", "/about", "/contact", "/shipping", "/returns", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteBaseUrl();
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${base}${r === "/" ? "" : r}`,
    lastModified: now,
    changeFrequency: r === "/" ? "daily" : "weekly",
    priority: r === "/" ? 1 : 0.7,
  }));
}
