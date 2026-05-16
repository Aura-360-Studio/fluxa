import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#05050a", // cosmic-black
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Prevents zooming on mobile to maintain app-like feel
};

export const metadata: Metadata = {
  title: {
    default: "Fluxa | Ad-Free Internet Speed Test & Health Checker",
    template: "%s | Fluxa"
  },
  description: "Experience the fastest, most beautiful ad-free internet speed test. Check your wifi speed, latency, and stability instantly with a calm, atmospheric visualizer. No ads, no clutter.",
  applicationName: "Fluxa",
  authors: [{ name: "Fluxa Team" }],
  keywords: [
    "ad-free speed test", 
    "internet speed test", 
    "wifi speed test", 
    "network health checker", 
    "latency test", 
    "ping test", 
    "no ads speed test",
    "clean speed test",
    "fastest speed test",
    "best internet speed test 2026",
    "speed test for designers",
    "cinematic network visualizer",
    "accurate bandwidth test",
    "5g speed test ad-free"
  ],
  creator: "Fluxa",
  publisher: "Fluxa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://fluxa.aura360studio.com"),
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Fluxa | Ad-Free Internet Speed Test",
    description: "Instantly check your internet speed and network resonance through a calm, atmospheric, and completely ad-free visualizer.",
    url: "https://fluxa.aura360studio.com",
    siteName: "Fluxa",
    images: [
      {
        url: "/logo.png", // We will replace this with a proper OG image later
        width: 800,
        height: 600,
        alt: "Fluxa Atmospheric Visualizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluxa | Ad-Free Internet Speed Test",
    description: "Visualize your internet connectivity as flowing energy with zero ads.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Fluxa Speed Test",
    "url": "https://fluxa.aura360studio.com",
    "description": "A calm, ad-free internet speed test visualizer.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Ad-free experience",
      "Real-time download speed",
      "Real-time upload speed",
      "Latency/Ping monitoring",
      "Atmospheric visualization"
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} antialiased dark`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HPT8MW3GK7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HPT8MW3GK7');
          `}
        </Script>
        <script defer data-domain="fluxa.aura360studio.com" src="https://plausible.io/js/script.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-cosmic-black text-white font-sans overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
