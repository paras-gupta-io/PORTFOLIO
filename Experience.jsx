export default function Experience({ experiences }) {
  return (
    <section id="experience" className="py-24 md:py-32 hairline-t" data-testid="experience-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="overline mb-4">§ 03 · Experience</div>
        <h2 className="editorial text-4xl md:text-6xl text-bone mb-16">
          Where the <span className="italic text-amber-brand">work</span> happens.
        </h2>

        <div className="space-y-0">
          {experiences.length === 0 && (
            <p className="text-bone-dim">No experience entries yet.</p>
          )}
          {experiences.map((e, i) => (
            <div key={e.id} className="grid grid-cols-12 gap-6 py-10 hairline-t group" data-testid={`experience-item-${i}`}>
              <div className="col-span-12 md:col-span-3">
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-amber-brand mb-2">{String(i + 1).padStart(2, "0")}</div>
                <div className="mono text-xs text-bone-dim">{e.duration}</div>
              </div>
              <div className="col-span-12 md:col-span-9">
                <h3 className="font-editorial text-3xl md:text-4xl text-bone mb-1">{e.role}</h3>
                <div className="mono text-xs tracking-[0.2em] uppercase text-bone-dim mb-4">
                  {e.company} · {e.location}
                </div>
                <p className="text-bone-dim leading-relaxed max-w-3xl">{e.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
