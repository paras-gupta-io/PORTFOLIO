export default function Education({ education }) {
  return (
    <section id="education" className="py-24 md:py-32 hairline-t" data-testid="education-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="overline mb-4">§ 05 · Education</div>
        <h2 className="editorial text-4xl md:text-6xl text-bone mb-12">
          The <span className="italic text-amber-brand">foundation</span>.
        </h2>
        <div className="space-y-4">
          {education.map((e, i) => (
            <div key={e.id} className="hairline p-6 md:p-8 bg-ink-surface flex flex-col md:flex-row md:items-center justify-between gap-4" data-testid={`education-item-${i}`}>
              <div>
                <h3 className="font-editorial text-2xl md:text-3xl text-bone">{e.degree}</h3>
                <div className="mono text-xs tracking-[0.2em] uppercase text-bone-dim mt-2">
                  {e.institution} · {e.location}
                </div>
              </div>
              <div className="text-right">
                <div className="mono text-xs text-amber-brand">{e.duration}</div>
                {e.grade && <div className="font-editorial text-xl text-bone mt-1">{e.grade}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
