export default function Skills({ skills }) {
  const grouped = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});
  const cats = Object.keys(grouped);

  return (
    <section id="skills" className="py-24 md:py-32 hairline-t" data-testid="skills-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="overline mb-4">§ 02 · Skills</div>
            <h2 className="editorial text-4xl md:text-6xl text-bone">The <span className="italic text-amber-brand">stack</span>.</h2>
          </div>
          <div className="mono text-[11px] tracking-[0.2em] uppercase text-bone-dim">{skills.length} entries</div>
        </div>

        {/* Marquee strip */}
        <div className="hairline-t hairline-b py-4 overflow-hidden mb-12">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...skills, ...skills].map((s, i) => (
              <span key={i} className="mono text-xs tracking-[0.2em] uppercase text-bone-dim">
                <span className="text-amber-brand">◆</span> {s.name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cats.map((cat, idx) => (
            <div key={cat} className="hairline p-6 bg-ink-surface hover:-translate-y-1 transition-transform duration-300" data-testid={`skill-category-${idx}`}>
              <div className="flex items-center justify-between mb-4 hairline-b pb-3">
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">0{idx + 1}</span>
                <span className="mono text-[10px] uppercase tracking-[0.2em] text-bone-dim">{grouped[cat].length}</span>
              </div>
              <h3 className="font-editorial text-2xl text-bone mb-4">{cat}</h3>
              <ul className="space-y-2">
                {grouped[cat].map((s) => (
                  <li key={s.id} className="text-sm text-bone-dim flex items-center gap-2">
                    <span className="text-amber-brand">·</span> {s.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
