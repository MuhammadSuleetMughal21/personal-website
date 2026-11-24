import { getContent } from "@/lib/content";
import SmoothScroll from "@/components/site/SmoothScroll";
import Preloader from "@/components/site/Preloader";
import Cursor from "@/components/site/Cursor";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import TechMarquee from "@/components/site/TechMarquee";
import About from "@/components/site/About";
import Showcase from "@/components/site/Showcase";
import MoreApps from "@/components/site/MoreApps";
import Services from "@/components/site/Services";
import Process from "@/components/site/Process";
import Experience from "@/components/site/Experience";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import BackToTop from "@/components/site/BackToTop";

export default async function Home() {
  // Cached ("use cache" + tag) — refreshed when the admin panel saves.
  const { profile, projects, skills, services, process, experience } = await getContent();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <div className="grain" aria-hidden />
      <Navbar name={profile.name} available={profile.available} />
      <main className="overflow-x-clip">
        <Hero profile={profile} apps={featured.length ? featured : projects} />
        <TechMarquee skills={skills} />
        <About profile={profile} />
        <Showcase apps={featured} />
        <MoreApps apps={rest} />
        <Services services={services} />
        <Process steps={process} />
        <Experience jobs={experience} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
      <BackToTop />
    </>
  );
}
