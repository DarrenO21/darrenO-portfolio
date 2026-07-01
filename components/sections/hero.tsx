"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Mouse } from "lucide-react";

import { useLanguage } from "@/providers/language-provider";
import { ContactModal } from "@/components/modals/contact-modal";

export default function Hero() {
  const { content, dict } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);

  const scrollToProfile = useCallback(() => {
    const profileSection = document.getElementById("profile");

    if (profileSection) {
      profileSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-background flex items-center border-b border-border/50"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />
      </div>

      <div className="container mx-auto px-container relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-20 items-center">
          <div className="max-w-5xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border/60 bg-secondary/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              medicine · neuroscience · data
            </div>

            <h1 className="font-black tracking-[-0.08em] leading-[0.86] text-[18vw] sm:text-[15vw] md:text-[12vw] xl:text-[8.5vw] text-foreground">
              Darren
              <br />
              <span className="text-foreground/70 font-serif italic font-semibold tracking-[-0.06em]">
                Oommen
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg md:text-xl xl:text-2xl leading-relaxed text-muted-foreground font-medium">
              {content.about.description}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="group relative flex h-12 xl:h-16 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-6 xl:px-10 text-background transition-all duration-500 ease-out hover:bg-background hover:border-foreground/30 hover:text-foreground shadow-2xl hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2 font-medium">
                  {dict.contactMe}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>

              <button
                type="button"
                onClick={scrollToProfile}
                className="group relative flex h-12 xl:h-16 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/60 bg-secondary/10 px-6 xl:px-10 text-foreground transition-all duration-500 ease-out hover:bg-secondary/30 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2 font-medium">
                  {dict.exploreProjects}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </div>

          <div className="relative hidden xl:block">
            <div className="relative min-h-[520px] overflow-hidden border border-border/60 bg-secondary/10 backdrop-blur-md p-8">
              <div className="absolute right-6 top-6 font-mono text-xs tracking-[0.35em] text-muted-foreground">
                2026
              </div>

              <div className="absolute -right-10 -bottom-16 text-[15rem] font-black italic tracking-tighter text-foreground/[0.035] select-none">
                bio
              </div>

              <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-5">
                    current focus
                  </p>

                  <h2 className="text-4xl font-serif italic tracking-tight text-foreground">
                    biomedical research direction
                  </h2>

                  <p className="mt-6 text-muted-foreground leading-relaxed">
                    Building toward medicine and neuroscience through healthcare
                    volunteering, research skills, programming, statistics, and
                    service.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Python",
                    "NumPy",
                    "Matplotlib",
                    "Neuroscience",
                    "Medicine",
                    "Public Health",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-border/40 bg-background/50 px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-container hidden md:flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
          <Mouse className="h-4 w-4" />
          {dict.scrollDown}
        </div>
      </div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </section>
  );
}
