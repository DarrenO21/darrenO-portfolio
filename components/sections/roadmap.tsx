"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowUpRight, FileText } from "lucide-react";

import { BlurReveal } from "@/components/effects/blur-reveal";
import { useLanguage } from "@/providers/language-provider";
import type { RoadmapItem } from "@/types/roadmap";

type ProfileItem = Omit<RoadmapItem, "description"> & {
  description: ReactNode;
};

export default function Roadmap() {
  const { content, dict } = useLanguage();
  const profileItems: ProfileItem[] = content.roadmap || [];

  const featuredCoursework = profileItems[0];
  const remainingItems = profileItems.slice(1);

  return (
    <section
      id="profile"
      className="relative container-void overflow-hidden py-28 xl:py-40 border-t border-border/50"
    >
      <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-container max-w-7xl relative z-10">
        <div className="flex flex-col md:items-center mb-14 md:mb-20 gap-4 text-center">
          <BlurReveal>
            <span className="title-counter">[004]</span>
          </BlurReveal>

          <BlurReveal>
            <h2 className="title">{dict.roadmapTitle}</h2>
          </BlurReveal>

          <BlurReveal>
            <p className="text-lg mt-3 max-w-3xl italic font-medium tracking-tight text-foreground/60">
              {dict.roadmapDescription}
            </p>
          </BlurReveal>
        </div>

        {featuredCoursework && (
          <BlurReveal>
            <section className="mb-8 md:mb-10 border border-border/70 bg-secondary/10 backdrop-blur-md p-7 md:p-10 xl:p-12 shadow-2xl">
              <div className="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-8 xl:gap-12 items-start">
                <div>
                  <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-primary">
                    academic focus
                  </p>

                  <h3 className="text-4xl md:text-5xl xl:text-6xl font-serif italic font-semibold tracking-tight text-foreground">
                    {featuredCoursework.year}
                  </h3>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {featuredCoursework.stack.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/40 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:bg-background hover:text-foreground"
                    >
                      Resume
                      <FileText className="h-4 w-4" />
                    </a>

                    <a
                      href="https://docs.google.com/document/d/1jf8SMKqzXJ1jMvl4jAzimdjGvIyOkF4xQ7l5BEmqEHM/edit?usp=sharing"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-background/60 px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary/30"
                    >
                      Transcript
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  <SafeDescription description={featuredCoursework.description} />
                </div>
              </div>
            </section>
          </BlurReveal>
        )}

        <div className="space-y-5 md:space-y-6">
          {remainingItems.map((item, index) => (
            <ProfileCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfileCard({ item, index }: { item: ProfileItem; index: number }) {
  return (
    <BlurReveal>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative overflow-hidden border border-border/60 bg-secondary/5 backdrop-blur-md p-6 md:p-8 xl:p-10 transition-all duration-500 hover:bg-secondary/20 hover:border-border hover:shadow-2xl"
      >
        <div className="absolute right-5 top-5 font-mono text-xs tracking-[0.35em] text-muted-foreground/50">
          {item.id}
        </div>

        <div className="absolute -right-8 -bottom-14 text-[8rem] md:text-[12rem] font-black italic tracking-tighter text-foreground/[0.03] select-none pointer-events-none">
          {item.id}
        </div>

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[0.75fr_1.25fr] gap-6 xl:gap-12 items-start">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>

            <h3 className="max-w-2xl text-3xl md:text-4xl xl:text-5xl font-serif italic font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-500">
              {item.year}
            </h3>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/40 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="text-sm md:text-base leading-relaxed text-muted-foreground xl:pt-10">
            <SafeDescription description={item.description} />
          </div>
        </div>
      </motion.article>
    </BlurReveal>
  );
}

function SafeDescription({ description }: { description: ReactNode }) {
  if (typeof description === "string") {
    return (
      <div className="space-y-4">
        {description.split("\n").map((paragraph, index) => {
          if (!paragraph.trim()) return null;
          return <p key={index}>{paragraph}</p>;
        })}
      </div>
    );
  }

  return <div className="space-y-4">{description}</div>;
}
