export default function About({ profile }) {
  const headingLines = (profile.about_heading || "Reading\ndatasets\nlike race\ntelemetry.")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-20 md:py-28 hairline-t overflow-hidden" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="overline mb-10 text-center">§ 01 · About</div>

        {/* Stacked: photo on top, heading cleanly below — no overlap */}
        <div className="flex flex-col items-center">
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="w-[78%] sm:w-[55%] md:w-[42%] lg:w-[34%] max-w-[440px] object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.75)]"
            data-testid="about-avatar"
          />

          <h2
            className="editorial text-[14vw] md:text-[10vw] lg:text-[8vw] text-bone/95 leading-[0.9] text-center mt-2 md:mt-4"
            data-testid="about-heading"
          >
            {headingLines.map((line, i) => {
              const accent = i % 2 === 1;
              return (
                <span key={i} className={accent ? "block italic text-amber-brand" : "block"}>
                  {line}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Subhead + bio below */}
        <div className="relative z-10 grid grid-cols-12 gap-8 mt-14 md:mt-20">
          <div className="col-span-12 md:col-span-5">
            <p className="font-editorial text-xl md:text-2xl text-bone leading-snug">
              {profile.about_subhead || "For the gaps, the trends, and the story underneath the rows."}
            </p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <p className="text-bone-dim text-base md:text-lg leading-relaxed" data-testid="about-bio">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Meta strip */}
        <div className="relative z-10 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Tag k="Based" v={profile.location} />
          <Tag k="Email" v={profile.email} />
          <Tag k="Role" v="Data Analytics & Cloud" />
        </div>
      </div>
    </section>
  );
}

function Tag({ k, v }) {
  return (
    <div className="hairline-t pt-4">
      <div className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand mb-2">{k}</div>
      <div className="text-bone text-sm break-words">{v}</div>
    </div>
  );
}
