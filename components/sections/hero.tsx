"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

import { useLanguage } from "@/providers/language-provider";
import { ContactModal } from "@/components/modals/contact-modal";
import { InteractiveParticles } from "@/components/effects/interactive-particles";
const heroPhotos = [
  "Darren Sketch.png",
  "IMG_0531.jpeg",
  "IMG_1993.jpeg",
  "IMG_4632.jpeg",
  "IMG_5115.jpeg",
  "/hero/hero-6.jpg",
];

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

      <div className="container mx-auto px-container relative z-10 py-28">
        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.05fr] gap-14 xl:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border/60 bg-secondary/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              medicine · neuroscience · research · data
            </div>

            <h1 className="font-black tracking-[-0.085em] leading-[0.86] text-[18vw] sm:text-[15vw] md:text-[11vw] xl:text-[8.2vw] text-foreground">
              Darren
              <br />
              <span className="text-foreground/70 font-serif italic font-semibold tracking-[-0.06em]">
                Oommen
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg md:text-xl xl:text-2xl leading-relaxed text-muted-foreground font-medium">
              {content.about.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground">
              <span>New Jersey</span>
              <span>·</span>
              <span>Biomedical Science</span>
              <span>·</span>
              <span>Class of 2028</span>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="group relative flex h-12 xl:h-16 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-6 xl:px-10 text-background transition-all duration-500 ease-out hover:bg-background hover:border-foreground/30 hover:text-foreground shadow-2xl hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2 font-medium">
                  Contact Me
                  <Mail className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>

              <button
                type="button"
                onClick={scrollToProfile}
                className="group relative flex h-12 xl:h-16 w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/60 bg-secondary/10 px-6 xl:px-10 text-foreground transition-all duration-500 ease-out hover:bg-secondary/30 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2 font-medium">
                  View Profile
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            className="relative min-h-[520px] hidden md:block"
          >
            <div className="absolute inset-0 opacity-90">
              <div className="grid grid-cols-3 grid-rows-3 gap-3 h-full">
                <PhotoTile src={heroPhotos[0]} className="col-span-1 row-span-1 translate-y-8" />
                <PhotoTile src={heroPhotos[1]} className="col-span-2 row-span-1" />
                <PhotoTile src={heroPhotos[2]} className="col-span-2 row-span-1" />
                <PhotoTile src={heroPhotos[3]} className="col-span-1 row-span-2 -translate-y-10" />
                <PhotoTile src={heroPhotos[4]} className="col-span-1 row-span-1 translate-y-4" />
                <PhotoTile src={heroPhotos[5]} className="col-span-1 row-span-1" />
              </div>
            </div>

            <div className="absolute inset-0 bg-background/35 backdrop-blur-[1px]" />

            <div className="absolute left-8 bottom-8 right-8 border border-border/60 bg-background/70 backdrop-blur-xl p-6 shadow-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
                current focus
              </p>

              <h2 className="text-3xl xl:text-4xl font-serif italic tracking-tight text-foreground">
                medicine meets data
              </h2>

              <p className="mt-4 text-muted-foreground leading-relaxed">
                Building toward neuroscience and biomedical research through
                healthcare volunteering, Python, statistics, and service.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {["Python", "NumPy", "Matplotlib", "Neuroscience", "Medicine"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border/40 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </section>
  );
}

function PhotoTile({ src, className }: { src: string; className?: string }) {
  return (
    <div
      className={[
        "relative overflow-hidden border border-border/60 bg-secondary/20 shadow-xl",
        className || "",
      ].join(" ")}
    >
      <div
        className="absolute inset-0 bg-cover bg-center grayscale opacity-80"
        style={{ backgroundImage: `url('${src}')` }}
      />
      <div className="absolute inset-0 bg-background/15" />
    </div>
  );
}
