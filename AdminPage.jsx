import { useEffect, useState } from "react";
import { api, setToken, getToken } from "@/lib/api";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Edit3, Save, X, Inbox, CheckCircle2 } from "lucide-react";

const TABS = ["profile", "skills", "projects", "experiences", "education", "certifications", "messages"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = checking
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    (async () => {
      if (!getToken()) { setAuthed(false); return; }
      try {
        await api.get("/auth/me");
        setAuthed(true);
      } catch {
        setToken(null);
        setAuthed(false);
      }
    })();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const { data } = await api.post("/auth/login", loginForm);
      setToken(data.access_token);
      setAuthed(true);
      toast.success("Welcome back.");
    } catch (err) {
      const msg = typeof err?.response?.data?.detail === "string" ? err.response.data.detail : "Login failed";
      toast.error(msg);
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAuthed(false);
    toast.success("Signed out.");
  };

  if (authed === null) {
    return <div className="min-h-screen flex items-center justify-center bg-[#161514] text-amber-brand overline">Checking session…</div>;
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161514] px-6">
        <form onSubmit={login} className="w-full max-w-md hairline bg-ink-surface p-8 md:p-10" data-testid="admin-login-form">
          <div className="overline mb-4">◆ Admin / Restricted</div>
          <h1 className="editorial text-4xl text-bone mb-8">Sign in.</h1>
          <div className="space-y-4">
            <Field label="Email" value={loginForm.email} type="email" onChange={(v) => setLoginForm({ ...loginForm, email: v })} testid="admin-login-email" />
            <Field label="Password" value={loginForm.password} type="password" onChange={(v) => setLoginForm({ ...loginForm, password: v })} testid="admin-login-password" />
          </div>
          <button type="submit" disabled={loggingIn} className="btn-primary w-full justify-center mt-8 disabled:opacity-60" data-testid="admin-login-submit">
            {loggingIn ? "Signing in…" : "Enter"}
          </button>
          <a href="/" className="mono text-[10px] uppercase tracking-[0.2em] text-bone-dim hover:text-amber-brand mt-6 block text-center" data-testid="admin-back-home">← Back to portfolio</a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161514] text-bone" data-testid="admin-dashboard">
      <header className="hairline-b sticky top-0 bg-[#161514]/80 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-amber-brand animate-pulse-dot" />
            <span className="mono text-xs tracking-[0.25em] uppercase">Admin Console</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="mono text-[11px] tracking-[0.2em] uppercase text-bone-dim hover:text-amber-brand" data-testid="admin-view-site">View site →</a>
            <button onClick={logout} className="mono text-[11px] tracking-[0.2em] uppercase text-amber-brand inline-flex items-center gap-2" data-testid="admin-logout">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex gap-6 overflow-x-auto hairline-t">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`mono text-[11px] tracking-[0.2em] uppercase py-4 whitespace-nowrap transition-colors ${tab === t ? "text-amber-brand border-b border-amber-brand -mb-px" : "text-bone-dim hover:text-bone"}`} data-testid={`admin-tab-${t}`}>
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {tab === "profile" && <ProfilePanel />}
        {tab === "skills" && <SkillsPanel />}
        {tab === "projects" && <ProjectsPanel />}
        {tab === "experiences" && <ExperiencesPanel />}
        {tab === "education" && <EducationPanel />}
        {tab === "certifications" && <CertsPanel />}
        {tab === "messages" && <MessagesPanel />}
      </main>
    </div>
  );
}

// ----------------- Sub-panels -----------------
function ProfilePanel() {
  const [p, setP] = useState(null);
  useEffect(() => { api.get("/profile").then((r) => setP(r.data)); }, []);
  if (!p) return <Loading />;
  const save = async () => {
    try { await api.put("/profile", p); toast.success("Profile updated."); }
    catch { toast.error("Update failed."); }
  };
  const fields = [
    ["name", "Name"], ["title", "Title"], ["tagline", "Tagline"], ["bio", "Bio", true],
    ["about_heading", "About — Big Heading (one phrase per line; even lines = amber italic)", true],
    ["about_subhead", "About — Subhead (italic line above bio)", true],
    ["location", "Location"], ["email", "Email"], ["phone", "Phone"], ["whatsapp", "WhatsApp"],
    ["github", "GitHub URL"], ["linkedin", "LinkedIn URL"], ["resume_url", "Resume URL"],
    ["avatar_url", "Avatar URL"], ["hero_image_url", "Hero Image URL"],
  ];
  return (
    <div data-testid="admin-profile-panel">
      <PanelHeader title="Profile" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([k, label, multi]) => (
          multi ? (
            <div key={k} className="md:col-span-2">
              <label className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">{label}</label>
              <textarea value={p[k] || ""} onChange={(e) => setP({ ...p, [k]: e.target.value })} rows={4} className="mt-2 w-full bg-transparent hairline px-4 py-3 text-bone outline-none focus:border-amber-brand resize-none" data-testid={`admin-profile-${k}`} />
            </div>
          ) : (
            <Field key={k} label={label} value={p[k] || ""} onChange={(v) => setP({ ...p, [k]: v })} testid={`admin-profile-${k}`} />
          )
        ))}
      </div>
      <button onClick={save} className="btn-primary mt-6" data-testid="admin-profile-save"><Save size={14} /> Save profile</button>
    </div>
  );
}

function SkillsPanel() {
  return <CrudPanel
    title="Skills"
    endpoint="/skills"
    blank={{ category: "", name: "", order: 0 }}
    fields={[["category", "Category"], ["name", "Name"], ["order", "Order", "number"]]}
    render={(s) => <span><strong className="text-amber-brand">{s.category}</strong> · {s.name}</span>}
    testidPrefix="admin-skill"
  />;
}

function ProjectsPanel() {
  return <CrudPanel
    title="Projects"
    endpoint="/projects"
    blank={{ title: "", description: "", tech_stack: [], image_url: "", github_url: "", live_url: "", featured: false, order: 0 }}
    fields={[
      ["title", "Title"], ["description", "Description", "textarea"],
      ["tech_stack", "Tech (comma-sep)", "list"],
      ["image_url", "Image URL"], ["github_url", "GitHub URL"], ["live_url", "Live URL"],
      ["featured", "Featured", "bool"], ["order", "Order", "number"],
    ]}
    render={(p) => <span>{p.featured ? "★ " : ""}<strong className="text-amber-brand">{p.title}</strong> — {(p.tech_stack || []).join(", ")}</span>}
    testidPrefix="admin-project"
  />;
}

function ExperiencesPanel() {
  return <CrudPanel
    title="Experiences"
    endpoint="/experiences"
    blank={{ role: "", company: "", location: "", duration: "", description: "", order: 0 }}
    fields={[["role", "Role"], ["company", "Company"], ["location", "Location"], ["duration", "Duration"], ["description", "Description", "textarea"], ["order", "Order", "number"]]}
    render={(e) => <span><strong className="text-amber-brand">{e.role}</strong> @ {e.company}</span>}
    testidPrefix="admin-exp"
  />;
}

function EducationPanel() {
  return <CrudPanel
    title="Education"
    endpoint="/education"
    blank={{ degree: "", institution: "", location: "", duration: "", grade: "", order: 0 }}
    fields={[["degree", "Degree"], ["institution", "Institution"], ["location", "Location"], ["duration", "Duration"], ["grade", "Grade"], ["order", "Order", "number"]]}
    render={(e) => <span><strong className="text-amber-brand">{e.degree}</strong> · {e.institution}</span>}
    testidPrefix="admin-edu"
  />;
}

function CertsPanel() {
  return <CrudPanel
    title="Certifications"
    endpoint="/certifications"
    blank={{ title: "", issuer: "", date: "", order: 0 }}
    fields={[["title", "Title"], ["issuer", "Issuer"], ["date", "Date"], ["order", "Order", "number"]]}
    render={(c) => <span><strong className="text-amber-brand">{c.title}</strong> · {c.issuer}</span>}
    testidPrefix="admin-cert"
  />;
}

function MessagesPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try { const { data } = await api.get("/messages"); setItems(data); }
    catch { toast.error("Could not load messages."); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const markRead = async (id) => {
    try { await api.put(`/messages/${id}/read`); refresh(); }
    catch { toast.error("Action failed."); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try { await api.delete(`/messages/${id}`); refresh(); toast.success("Deleted."); }
    catch { toast.error("Delete failed."); }
  };

  return (
    <div data-testid="admin-messages-panel">
      <PanelHeader title="Messages" subtitle={`${items.length} total`} />
      {loading && <Loading />}
      {!loading && items.length === 0 && (
        <div className="hairline p-10 bg-ink-surface text-center">
          <Inbox size={32} className="text-amber-brand mx-auto mb-4" />
          <p className="text-bone-dim">Inbox empty.</p>
        </div>
      )}
      <div className="space-y-3">
        {items.map((m, i) => (
          <div key={m.id} className={`hairline p-5 bg-ink-surface ${m.read ? "opacity-70" : ""}`} data-testid={`admin-message-${i}`}>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="font-editorial text-xl text-bone">{m.name} <span className="text-bone-dim text-sm">· {m.email}</span></div>
                {m.subject && <div className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand mt-1">{m.subject}</div>}
              </div>
              <div className="flex items-center gap-2">
                {!m.read && (
                  <button onClick={() => markRead(m.id)} className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand inline-flex items-center gap-1" data-testid={`admin-message-read-${i}`}>
                    <CheckCircle2 size={14} /> Mark read
                  </button>
                )}
                <button onClick={() => remove(m.id)} className="mono text-[10px] uppercase tracking-[0.2em] text-red-400 inline-flex items-center gap-1" data-testid={`admin-message-delete-${i}`}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
            <p className="text-bone-dim whitespace-pre-wrap mt-2">{m.body}</p>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-bone-dim mt-3">{new Date(m.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------- Generic CRUD panel -----------------
function CrudPanel({ title, endpoint, blank, fields, render, testidPrefix }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null); // {id?, data}
  const [adding, setAdding] = useState(false);

  const refresh = async () => {
    try { const { data } = await api.get(endpoint); setItems(data); }
    catch { toast.error("Load failed."); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, [endpoint]);

  const submit = async () => {
    const payload = { ...draft.data };
    // Convert list fields
    fields.forEach(([k, , type]) => {
      if (type === "list" && typeof payload[k] === "string") {
        payload[k] = payload[k].split(",").map((s) => s.trim()).filter(Boolean);
      }
      if (type === "number") payload[k] = Number(payload[k] || 0);
    });
    try {
      if (draft.id) await api.put(`${endpoint}/${draft.id}`, payload);
      else await api.post(endpoint, payload);
      toast.success("Saved.");
      setDraft(null); setAdding(false); refresh();
    } catch {
      toast.error("Save failed.");
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try { await api.delete(`${endpoint}/${id}`); refresh(); toast.success("Deleted."); }
    catch { toast.error("Delete failed."); }
  };

  return (
    <div data-testid={`${testidPrefix}-panel`}>
      <PanelHeader title={title} subtitle={`${items.length} entries`} action={
        <button onClick={() => { setAdding(true); setDraft({ data: { ...blank } }); }} className="btn-ghost" data-testid={`${testidPrefix}-add`}>
          <Plus size={14} /> Add new
        </button>
      } />
      {loading && <Loading />}

      {(adding || draft?.id) && draft && (
        <div className="hairline p-6 bg-ink-surface mb-6" data-testid={`${testidPrefix}-form`}>
          <div className="overline mb-4">{draft.id ? "Edit" : "New entry"}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(([k, label, type]) => {
              const value = type === "list" ? (Array.isArray(draft.data[k]) ? draft.data[k].join(", ") : (draft.data[k] || "")) : (draft.data[k] ?? "");
              if (type === "textarea") {
                return (
                  <div key={k} className="md:col-span-2">
                    <label className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand">{label}</label>
                    <textarea value={value} onChange={(e) => setDraft({ ...draft, data: { ...draft.data, [k]: e.target.value } })} rows={4} className="mt-2 w-full bg-transparent hairline px-4 py-3 text-bone outline-none focus:border-amber-brand resize-none" />
                  </div>
                );
              }
              if (type === "bool") {
                return (
                  <label key={k} className="flex items-center gap-3 mono text-xs uppercase tracking-[0.2em] text-bone">
                    <input type="checkbox" checked={!!draft.data[k]} onChange={(e) => setDraft({ ...draft, data: { ...draft.data, [k]: e.target.checked } })} />
                    {label}
                  </label>
                );
              }
              return (
                <Field key={k} label={label} type={type === "number" ? "number" : "text"} value={value} onChange={(v) => setDraft({ ...draft, data: { ...draft.data, [k]: v } })} />
              );
            })}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={submit} className="btn-primary" data-testid={`${testidPrefix}-save`}><Save size={14} /> Save</button>
            <button onClick={() => { setDraft(null); setAdding(false); }} className="btn-ghost"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={it.id} className="hairline p-4 bg-ink-surface flex items-center justify-between gap-4" data-testid={`${testidPrefix}-row-${i}`}>
            <div className="text-bone text-sm">{render(it)}</div>
            <div className="flex gap-2">
              <button onClick={() => { setDraft({ id: it.id, data: { ...it } }); setAdding(false); }} className="mono text-[10px] uppercase tracking-[0.2em] text-amber-brand inline-flex items-center gap-1" data-testid={`${testidPrefix}-edit-${i}`}>
                <Edit3 size={14} /> Edit
              </button>
              <button onClick={() => remove(it.id)} className="mono text-[10px] uppercase tracking-[0.2em] text-red-400 inline-flex items-center gap-1" data-testid={`${testidPrefix}-delete-${i}`}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------- Shared bits -----------------
function PanelHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
      <div>
        <div className="overline mb-2">Section</div>
        <h2 className="font-editorial text-4xl text-bone">{title}</h2>
        {subtitle && <div className="mono text-[10px] uppercase tracking-[0.2em] text-bone-dim mt-2">{subtitle}</div>}
      </div>
      {action}
    </div>
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

function Loading() { return <div className="overline" data-testid="admin-loading">Loading…</div>; }
