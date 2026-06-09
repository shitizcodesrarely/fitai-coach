import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f9fafb" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5" style={{ borderBottom: "1px solid #1f2937" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🏋️</span>
          <span className="font-bold text-lg">FitAI Coach</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium" style={{ color: "#9ca3af" }}>
            Sign in
          </Link>
          <Link href="/signup"
            className="text-sm px-4 py-2 rounded-lg font-bold"
            style={{ background: "#16a34a", color: "#fff" }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-8 py-28 text-center">
        <div className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-6"
          style={{ background: "#052e16", color: "#4ade80", border: "1px solid #14532d" }}>
          Powered by Claude AI · Warhammer 40K Rank System
        </div>
        <h1 className="text-5xl font-black mb-6 leading-tight">
          Train like a{" "}
          <span style={{ color: "#16a34a" }}>Space Marine</span>
          <br />Rise to{" "}
          <span style={{ color: "#fbbf24" }}>The Emperor</span>
        </h1>
        <p className="text-lg mb-10" style={{ color: "#9ca3af" }}>
          AI-powered workout plans. Lore-based rank titles. Pixel art avatar that grows with you.
          Master Yoda guides your journey. The iron forges legends.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/signup"
            className="px-8 py-3.5 rounded-xl font-bold text-white text-base"
            style={{ background: "#16a34a" }}>
            Begin your ascent ⚔️
          </Link>
          <Link href="/login"
            className="px-8 py-3.5 rounded-xl font-bold text-base"
            style={{ border: "1px solid #374151", color: "#d1d5db" }}>
            Sign in
          </Link>
        </div>
      </section>

      {/* Rank preview */}
      <section className="max-w-4xl mx-auto px-8 pb-16">
        <p className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: "#6b7280" }}>
          Your rank grows as you lift
        </p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { title: "Initiate",    sub: "0–300 kg",    icon: "🐺", universe: "Warhammer 40K" },
            { title: "Colossus",    sub: "2,000+ kg",   icon: "🐘", universe: "X-Men"         },
            { title: "Kratos",      sub: "5,000+ kg",   icon: "🐋", universe: "God of War"    },
            { title: "One Above All", sub: "50,000+ kg",icon: "🌌", universe: "Marvel"        },
          ].map((r) => (
            <div key={r.title} className="rounded-xl p-4 text-center"
              style={{ background: "#111827", border: "1px solid #1f2937" }}>
              <div className="text-3xl mb-2">{r.icon}</div>
              <div className="font-bold text-sm mb-1">{r.title}</div>
              <div className="text-xs mb-1" style={{ color: "#16a34a" }}>{r.sub}</div>
              <div className="text-xs" style={{ color: "#6b7280" }}>{r.universe}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-8 pb-24 grid grid-cols-3 gap-4">
        {[
          { icon: "🤖", title: "AI workout plans",       desc: "Claude AI builds your personalised 4-week progressive plan based on your goals and equipment." },
          { icon: "⚔️", title: "Lore rank system",       desc: "Lift more, rise higher. From Warhammer Initiate to Marvel's One Above All." },
          { icon: "🎮", title: "Roblox-style avatar",    desc: "Build your pixel art warrior. Customise everything. Avatar grows as you level up." },
          { icon: "🧙", title: "Master Yoda guides you", desc: "Pixel art Yoda with Star Wars personality guides your onboarding and celebrates your wins." },
          { icon: "📊", title: "Progress tracking",      desc: "Volume charts, strength graphs, LeetCode-style heatmap. See your gains visualised." },
          { icon: "☁️", title: "AWS powered",            desc: "S3, CloudFront, ECS, RDS. Built to production standards." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="rounded-xl p-5"
            style={{ background: "#111827", border: "1px solid #1f2937" }}>
            <span className="text-2xl mb-3 block">{icon}</span>
            <h3 className="font-bold mb-2 text-sm">{title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>{desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
