# Fluxa
*Instant Internet Health Checker*

**"Technology should feel like flowing energy, not machinery."**

Fluxa is a calm, atmospheric internet connectivity checker. It visualizes network health as an organic, flowing energy field (Aura) rather than mechanical dashboards or aggressive gauges.

## Project Structure (Feature-Based Modular Architecture)
- `/src/app`: Next.js App Router (Pages, Layout, SEO).
- `/src/features`: Business logic domains (e.g., `speed-test` engine and interpreter).
- `/src/canvas`: The visual rendering engine (`AuraCanvas`).
- `/src/store`: Global state management (`zustand`).

## Tech Stack
- Next.js 15
- Tailwind CSS v4
- Zustand
- HTML5 Canvas + requestAnimationFrame
- Framer Motion & CSS Animations

## Getting Started
1. Run `npm install`
2. Run `npm run dev`
3. Visit `http://localhost:3000`

## Architecture Philosophy
- **Zero Friction**: The test starts instantly. No buttons.
- **Emotional Minimalism**: Remove unnecessary details. Visual feedback over numerical clutter.
- **Duration-Based Engine**: Handles slow mobile networks gracefully by capping test phase times.
- **Progressive Disclosure**: Only the current relevant metric is highlighted. Secondary metrics fade in gracefully.
