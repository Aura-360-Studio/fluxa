# Fluxa | Ad-Free Internet Health Checker

> **"Technology should feel like flowing energy, not machinery."**

Fluxa is a calm, atmospheric internet connectivity checker designed to provide a frictionless user experience. It visualizes network health as an organic, flowing energy field (Aura) rather than mechanical dashboards or aggressive gauges.

[![Fluxa Preview](https://fluxa.aura360studio.com/logo.png)](https://fluxa.aura360studio.com)

## ✨ Core Experience
- **Ad-Free & Clutter-Free**: Zero distractions. Just you and your connection metrics.
- **Atmospheric Visualization**: Real-time Aura field that reacts to your network resonance.
- **Zero Friction**: The test starts instantly upon landing. No buttons required.
- **Emotional Minimalism**: Focus on what matters—your internet stability and speed—wrapped in a cosmic aesthetic.

## 🛠 Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Graphics**: HTML5 Canvas + procedural `requestAnimationFrame` engine
- **Animations**: Framer Motion & Native CSS Transitions
- **Analytics**: Privacy-focused [Plausible Analytics](https://plausible.io/)

## 🏗 Project Architecture
Fluxa follows a **Feature-Based Modular Architecture** for maximum scalability:
- `src/app`: Next.js App Router, global styles, and SEO configurations.
- `src/features`: Domain-specific logic (e.g., the speed-test engine and interpretation layer).
- `src/canvas`: The visual rendering engine (`AuraCanvas`) for the procedural aura field.
- `src/store`: Global reactive states for settings and test metrics.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm / yarn / pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Aura-360-Studio/fluxa.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to experience Fluxa locally.

## 🌐 SEO & Integration
Fluxa is fully optimized for search engines with:
- **Semantic Metadata**: Optimized for "Ad-Free Speed Test" queries.
- **JSON-LD Structured Data**: Identified as a `WebApplication` for better Google visibility.
- **Dynamic Social Sharing**: Custom Open Graph and Twitter cards.
- **Global Reach**: Robots and Sitemap configurations pointing to [fluxa.aura360studio.com](https://fluxa.aura360studio.com).

## 📄 License
Created by **Fluxa Team** at Aura 360 Studio. All rights reserved.
