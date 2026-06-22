import { Github, ExternalLink } from "lucide-react";

export default function Projects({ projects }) {
  return (
    <section id="projects" className="py-24 md:py-32 hairline-t" data-testid="projects-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="overline mb-4">§ 04 · Projects</div>
            <h2 className="editorial text-4xl md:text-6xl text-bone">
              Selected <span className="italic text-amber-brand">work</span>.
            </h2>
          </div>
          <div className="mono text-[11px] tracking-[0.2em] uppercase text-bone-dim">{projects.length} pieces</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <article key={p.id} className={`hairline bg-ink-surface group overflow-hidden hover:-translate-y-1 transition-transform duration-300 ${p.featured ? "md:col-span-2" : ""}`} data-testid={`project-card-${i}`}>
              {p.image_url && (
                <div className={`overflow-hidden ${p.featured ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">Project / 0{i + 1}</span>
                  {p.featured && <span className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">★ Featured</span>}
                </div>
                <h3 className="font-editorial text-3xl md:text-4xl text-bone mb-3">{p.title}</h3>
                <p className="text-bone-dim leading-relaxed mb-5">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {(p.tech_stack || []).map((t) => (
                    <span key={t} className="mono text-[10px] uppercase tracking-[0.15em] hairline px-3 py-1 text-bone">{t}</span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noreferrer" className="mono text-[11px] tracking-[0.2em] uppercase text-amber-brand hover:text-amber-glow inline-flex items-center gap-2" data-testid={`project-github-${i}`}>
                      <Github size={14} /> Code
                    </a>
                  )}
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noreferrer" className="mono text-[11px] tracking-[0.2em] uppercase text-amber-brand hover:text-amber-glow inline-flex items-center gap-2" data-testid={`project-live-${i}`}>
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
