import { ArrowDownRight, Download } from "lucide-react";

export default function Hero({ profile }) {
  return (
    <section id="top" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden" data-testid="hero-section">
      {/* faint hero background image */}
      <div className="pointer-events-none absolute -right-32 top-24 w-[720px] h-[720px] opacity-30 hidden md:block" aria-hidden>
        <img src={profile.hero_image_url} alt="" className="w-full h-full object-cover mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#161514] via-[#161514]/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 md:col-span-8 reveal">
            <div className="flex items-center gap-4 mb-8">
              <span className="overline">Portfolio / N° 01</span>
              <span className="hairline-t flex-1 max-w-[120px]" />
              <span className="mono text-[11px] text-bone-dim tracking-[0.2em]">JAIPUR · IN</span>
            </div>

            <h1 className="editorial text-[14vw] md:text-[10vw] lg:text-[9vw] text-bone" data-testid="hero-name">
              {profile.name.split(" ")[0]}
              <span className="block text-amber-brand italic">{profile.name.split(" ").slice(1).join(" ")}</span>
            </h1>

            <div className="mt-8 max-w-xl">
              <p className="mono text-xs tracking-[0.2em] uppercase text-amber-brand mb-3">{profile.title}</p>
              <p className="font-editorial text-2xl md:text-3xl text-bone leading-snug" data-testid="hero-tagline">
                {profile.tagline}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#contact" className="btn-primary" data-testid="hero-cta-contact">
                Get in touch <ArrowDownRight size={16} />
              </a>
              {profile.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noreferrer" className="btn-ghost" data-testid="hero-cta-resume">
                  <Download size={14} /> Résumé
                </a>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 hidden md:block">
            <div className="hairline p-6 bg-ink-surface" data-testid="hero-stats-card">
              <div className="overline mb-4">Stat Block</div>
              <div className="space-y-4">
                <Stat label="CGPA" value="8.0 / 10" />
                <Stat label="Focus" value="Data Analytics" />
                <Stat label="Cloud" value="AWS Associate" />
                <Stat label="Status" value="Open to Internships" pulse />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, pulse }) {
  return (
    <div className="flex items-baseline justify-between gap-4 hairline-b pb-3">
      <span className="mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">{label}</span>
      <span className="font-editorial text-xl text-bone flex items-center gap-2">
        {pulse && <span className="w-1.5 h-1.5 bg-amber-brand rounded-full animate-pulse-dot" />}
        {value}
      </span>
    </div>
  );
}
