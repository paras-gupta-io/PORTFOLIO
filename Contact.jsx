import { useState } from "react";
import { Github, Linkedin, Mail, MessageCircle, Send } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.body) {
      toast.error("Please fill in name, email and message.");
      return;
    }
    setSending(true);
    try {
      await api.post("/messages", form);
      toast.success("Message sent. I'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", body: "" });
    } catch (err) {
      toast.error("Could not send. Please try email or WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const wa = (profile.whatsapp || "").replace(/[^0-9]/g, "");
  const waLink = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent("Hey Paras, I came across your portfolio…")}`
    : null;

  return (
    <section id="contact" className="py-24 md:py-32 hairline-t" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-5">
          <div className="overline mb-4">§ 07 · Contact</div>
          <h2 className="editorial text-5xl md:text-7xl text-bone mb-6">
            Let&apos;s <span className="italic text-amber-brand">connect</span>.
          </h2>
          <p className="text-bone-dim leading-relaxed max-w-md mb-10">
            Always interested in analytics, cloud technologies, and meaningful collaborations.
          </p>

          <div className="space-y-3">
            <ChannelLink testid="contact-email" href={`mailto:${profile.email}`} icon={<Mail size={16} />} label="Email" value={profile.email} />
            <ChannelLink testid="contact-github" href={profile.github} target="_blank" icon={<Github size={16} />} label="GitHub" value={profile.github.replace(/https?:\/\//, "")} />
            <ChannelLink testid="contact-linkedin" href={profile.linkedin} target="_blank" icon={<Linkedin size={16} />} label="LinkedIn" value={profile.linkedin.replace(/https?:\/\//, "")} />
          </div>
        </div>

        <div className="col-span-12 md:col-span-7">
          <form onSubmit={submit} className="hairline p-6 md:p-10 bg-ink-surface" data-testid="contact-form">
            <div className="overline mb-6">Direct line / form</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} testid="contact-input-name" />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} testid="contact-input-email" />
            </div>
            <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} testid="contact-input-subject" />
            <div className="mt-4">
              <label className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">Message</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={6}
                className="mt-2 w-full bg-transparent hairline px-4 py-3 text-bone outline-none focus:border-amber-brand resize-none"
                placeholder="Tell me about your project, role, or just say hi…"
                data-testid="contact-input-body"
              />
            </div>
            <button type="submit" disabled={sending} className="btn-primary mt-6 disabled:opacity-60" data-testid="contact-submit-button">
              {sending ? "Sending…" : "Send message"} <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ChannelLink({ href, target, icon, label, value, accent, testid }) {
  return (
    <a href={href} target={target} rel="noreferrer" className={`hairline p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-transform duration-300 ${accent ? "bg-amber-brand/5" : "bg-ink-surface"}`} data-testid={testid}>
      <span className={`w-10 h-10 hairline flex items-center justify-center ${accent ? "text-amber-brand" : "text-bone"}`}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">{label}</div>
        <div className="text-bone truncate">{value}</div>
      </div>
      <span className="mono text-amber-brand opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </a>
  );
}

function Field({ label, value, onChange, type = "text", testid }) {
  return (
    <div>
      <label className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent hairline px-4 py-3 text-bone outline-none focus:border-amber-brand"
        data-testid={testid}
      />
    </div>
  );
}
