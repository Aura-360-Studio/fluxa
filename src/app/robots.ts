import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow private or API routes here if any exist later
      // disallow: '/private/',
    },
    sitemap: 'https://fluxa.aura360studio.com/sitemap.xml',
  };
}
