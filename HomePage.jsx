import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Nav from "@/components/portfolio/Nav";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Education from "@/components/portfolio/Education";
import Certifications from "@/components/portfolio/Certifications";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [p, s, pr, ex, ed, c] = await Promise.all([
          api.get("/profile"),
          api.get("/skills"),
          api.get("/projects"),
          api.get("/experiences"),
          api.get("/education"),
          api.get("/certifications"),
        ]);
        setProfile(p.data);
        setSkills(s.data);
        setProjects(pr.data);
        setExperiences(ex.data);
        setEducation(ed.data);
        setCerts(c.data);
      } catch (e) {
        console.error("load failed", e);
      }
    })();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161514] text-amber-brand">
        <div className="overline" data-testid="home-loading">Loading portfolio…</div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#161514] text-bone min-h-screen" data-testid="home-page">
      <Nav profile={profile} />
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Education education={education} />
      <Certifications certs={certs} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </div>
  );
}
