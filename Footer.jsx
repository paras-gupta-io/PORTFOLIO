export default function Footer({ profile }) {
  return (
    <footer className="hairline-t py-10" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="mono text-[10px] tracking-[0.2em] uppercase text-bone-dim">
          © {new Date().getFullYear()} {profile.name} — designed & built in {profile.location}.
        </div>
        <div className="mono text-[10px] tracking-[0.2em] uppercase text-amber-brand">
          ◆ Always shipping
        </div>
      </div>
    </footer>
  );
}
