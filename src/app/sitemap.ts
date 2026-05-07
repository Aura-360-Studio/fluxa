import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://fluxa.aura360studio.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Future routes like /about or /settings would go here
  ];
}
