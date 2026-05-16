import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Fluxa | Ad-Free Internet Speed Test & Network Health",
  description: "Learn more about Fluxa, the most beautiful and accurate ad-free internet speed test visualizer. Built for designers, gamers, and remote workers.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#02030A] text-white/40 font-sans p-8 md:p-20 max-w-4xl mx-auto">
      <section className="space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extralight text-white tracking-tight">About Fluxa</h1>
          <p className="text-xl font-light text-[#00f0ff]">The intersection of precision and atmospheric design.</p>
        </header>

        <article className="space-y-8 text-lg font-light leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">The Mission</h2>
            <p>Fluxa was created by <strong>Aura Labs</strong> to solve a simple problem: traditional <strong>internet speed tests</strong> are cluttered with ads, popups, and distracting elements. We believe that testing your <strong>wifi speed</strong> or <strong>network health</strong> should be a calm, cinematic experience that matches your modern workflow.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Professional Grade Accuracy</h2>
            <p>Behind the atmospheric visualization lies a high-performance <strong>speed test engine</strong>. Fluxa utilizes a globally distributed network of nodes to measure your <strong>download speed</strong>, <strong>upload speed</strong>, and <strong>ping latency</strong> with micro-second precision. Whether you are on fiber, satellite, or 5G, Fluxa provides the most accurate <strong>bandwidth monitoring</strong> available.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Why Ad-Free?</h2>
            <p>Most <strong>speed test</strong> tools use a significant portion of your bandwidth just to load ads and trackers. Fluxa is 100% <strong>ad-free</strong> and tracking-free, ensuring that every bit of your connection is dedicated to the test. This results in faster load times and more reliable <strong>network stability</strong> metrics.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Atmospheric Visualization</h2>
            <p>Our unique "Aura" engine visualizes your network data as a flowing energy field. The <strong>analog mode</strong> provides an emotional interpretation of your resonance, while the digital mode offers raw precision. It's more than a <strong>wifi check</strong>; it's a window into your digital connectivity.</p>
          </div>
        </article>

        <footer className="pt-20 border-t border-white/5 text-sm text-white/20">
          <p>© 2026 Aura Labs. Part of the Aura360Studio Ecosystem.</p>
        </footer>
      </section>
    </main>
  );
}
