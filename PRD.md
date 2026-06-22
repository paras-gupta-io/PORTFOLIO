# Paras Gupta — Portfolio (PRD)

## Original Problem Statement
> "create a unique and intresting website for my portfolio diffrent from others and add backend also like if someone wants go go on my github,linkedin profile they can and also they can send message by on message /whatsapp and also choose a good color combo for my portfolio and if a want to make changes like adding projects,skills and whatever so i can do that, and also add suitable pictures and make it"

## Stack
- React (CRA + craco) + Tailwind + shadcn/ui + framer / sonner + lucide-react
- FastAPI + Motor (MongoDB) + bcrypt + PyJWT
- Single-page portfolio at `/` and admin console at `/admin`

## Design System (from design_agent)
- Theme: Editorial Dark — `#161514` background, `#22201F` surface, `#D4AF37` amber accent
- Typography: Cormorant Garamond (headings, italic accent), Manrope (body), JetBrains Mono (overline/labels)
- Grain texture overlay, hairline 1px amber-tinted borders, flat surfaces, no soft shadows
- Asymmetric grid with overline labels (`§ 01 · About`, `01 / About`)

## User Persona
- **Owner / Admin**: Paras Gupta — edits portfolio content via `/admin`
- **Visitor / Recruiter**: views portfolio, contacts via form/email/WhatsApp/socials

## Architecture
- `GET /api/profile|skills|projects|experiences|education|certifications` — public
- `POST /api/messages` — public (contact form)
- `POST /api/auth/login` → JWT bearer, `GET /api/auth/me`
- `PUT/POST/DELETE` on the above + `GET /api/messages` — admin-only (Bearer JWT)
- Mongo collections: `profile`, `skills`, `projects`, `experiences`, `education`, `certifications`, `messages`, `admins`
- Admin seeded on startup from `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`). Idempotent re-hash on password change.

## What's Implemented (2026-12)
- Hero with stat block, About w/ avatar grayscale-to-color hover, Skills marquee + 4 category cards, Experience timeline, Projects grid (featured spans full width), Education list, Certifications grid, Contact form + WhatsApp/Email/GitHub/LinkedIn channel cards, Footer
- Admin panel with tabs for profile, skills, projects, experiences, education, certifications, messages — full CRUD + mark-read
- Seed data populated from Paras's resume (F1 Pit Wall project, 24 skills, 1 internship, 1 education, 3 certifications)
- Resume download button (links to uploaded `.docx`)
- WhatsApp deep link `https://wa.me/919783750052` with pre-filled text
- All interactive elements carry `data-testid`
- craco shim added to handle webpack-dev-server v5 / react-scripts v5 incompatibility

## Test Status
- Backend: 27/27 pytest (100%)
- Frontend: All critical flows pass via testing agent (100%)

## Backlog (P0 → P2)
- **P1** — Pass `testid` from CrudPanel to inline form `<Field>`s in `AdminPage.jsx`
- **P1** — Email notification (Resend) when a new contact message arrives
- **P2** — Return HTTP 201 from POST endpoints for REST consistency
- **P2** — Basic rate limit on `/api/auth/login`
- **P2** — Lifespan context replacing `@app.on_event`
- **P2** — Image upload to admin (currently URL-only); could integrate object storage
- **P2** — Public-side filtering / search of projects, dark/light toggle, share buttons on project cards
