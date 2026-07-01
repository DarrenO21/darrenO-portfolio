"use client";

import { motion } from "framer-motion";

import { BlurReveal } from "@/components/effects/blur-reveal";
import { useLanguage } from "@/providers/language-provider";
import type { RoadmapItem } from "@/types/roadmap";

export default function Roadmap() {
  const { content, dict } = useLanguage();
  const roadmapItems: RoadmapItem[] = content.roadmap || [];

  return (
    <section className="relative container-void overflow-hidden py-28 xl:py-40 border-t border-border/50">
      <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-container max-w-7xl relative z-10">
        <div className="flex flex-col md:items-center mb-16 md:mb-24 gap-4 text-center">
          <BlurReveal>
            <span className="title-counter">[004]</span>
          </BlurReveal>

          <BlurReveal>
            <h2 className="title">{dict.roadmapTitle}</h2>
          </BlurReveal>

          <BlurReveal>
            <p className="text-lg mt-3 max-w-2xl italic font-medium tracking-tight text-foreground/60">
              {dict.roadmapDescription}
            </p>
          </BlurReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {roadmapItems.map((item, index) => (
            <ExperienceCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({
  item,
  index,
}: {
  item: RoadmapItem;
  index: number;
}) {
  const isFeatureCard = index === 0 || index === 3 || index === 6;

  return (
    <BlurReveal>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={[
          "group relative min-h-[320px] overflow-hidden border border-border/60 bg-secondary/5 backdrop-blur-md p-7 md:p-8 transition-all duration-500",
          "hover:bg-secondary/20 hover:border-border hover:shadow-2xl",
          isFeatureCard ? "xl:col-span-2" : "",
        ].join(" ")}
      >
        <div className="absolute right-5 top-5 font-mono text-xs tracking-[0.35em] text-muted-foreground/60">
          {item.id}
        </div>

        <div className="absolute -right-8 -bottom-10 text-[9rem] md:text-[11rem] font-black italic tracking-tighter text-foreground/[0.035] select-none pointer-events-none">
          {item.id}
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            profile card
          </p>

          <h3 className="max-w-2xl text-3xl md:text-4xl lg:text-5xl font-serif italic font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-500">
            {item.year}
          </h3>

          <div className="mt-5 space-y-4 text-sm md:text-base leading-relaxed text-muted-foreground">
            {item.description.split("\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-auto pt-8 flex flex-wrap gap-2">
            {item.stack.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/40 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </BlurReveal>
  );
}
