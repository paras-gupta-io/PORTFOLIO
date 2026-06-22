import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { id: "about", label: "01 / About" },
  { id: "skills", label: "02 / Skills" },
  { id: "experience", label: "03 / Experience" },
  { id: "projects", label: "04 / Projects" },
  { id: "education", label: "05 / Education" },
  { id: "contact", label: "06 / Contact" },
];

export default function Nav({ profile }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#161514]/70 hairline-b" data-testid="nav-header">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group" data-testid="nav-logo">
          <span className="w-2 h-2 bg-amber-brand animate-pulse-dot" />
          <span className="mono text-xs tracking-[0.25em] text-bone uppercase">
            {profile.name.split(" ").map(n => n[0]).join("")} / Portfolio
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="mono text-[11px] tracking-[0.2em] uppercase text-bone-dim hover:text-amber-brand transition-colors" data-testid={`nav-link-${l.id}`}>
              {l.label}
            </a>
          ))}
          <a href="/admin" className="mono text-[11px] tracking-[0.2em] uppercase text-amber-brand hover:text-amber-glow" data-testid="nav-link-admin">
            ◆ Admin
          </a>
        </nav>
        <button className="md:hidden text-amber-brand" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle" aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden hairline-t bg-[#161514]">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} className="mono text-xs tracking-[0.2em] uppercase text-bone-dim" data-testid={`nav-mobile-link-${l.id}`}>
                {l.label}
              </a>
            ))}
            <a href="/admin" onClick={() => setOpen(false)} className="mono text-xs tracking-[0.2em] uppercase text-amber-brand" data-testid="nav-mobile-link-admin">
              ◆ Admin
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
