import { Award } from "lucide-react";

export default function Certifications({ certs }) {
  return (
    <section className="py-24 md:py-32 hairline-t" data-testid="certifications-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="overline mb-4">§ 06 · Certifications</div>
        <h2 className="editorial text-4xl md:text-6xl text-bone mb-12">
          Stamps of <span className="italic text-amber-brand">approval</span>.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certs.map((c, i) => (
            <div key={c.id} className="hairline p-6 bg-ink-surface hover:-translate-y-1 transition-transform duration-300" data-testid={`certification-${i}`}>
              <div className="flex items-center justify-between mb-6">
                <Award size={20} className="text-amber-brand" />
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">{c.date}</span>
              </div>
              <h3 className="font-editorial text-xl text-bone mb-2 leading-snug">{c.title}</h3>
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">{c.issuer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
