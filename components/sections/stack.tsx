"use client";

import { Brain, BookOpen, Code2, Wrench } from "lucide-react";

import { BlurReveal } from "@/components/effects/blur-reveal";
import { useLanguage } from "@/providers/language-provider";
import type { StackItem } from "@/types/stack";

export default function Stack() {
  const { content, dict } = useLanguage();

  const categories = [
    {
      title: dict.frontendStack,
      subtitle: "Programming and quantitative tools I am building for research.",
      items: content.stack?.frontend || [],
      Icon: Code2,
    },
    {
      title: dict.backendStack,
      subtitle: "The main biomedical areas I want my work to point toward.",
      items: content.stack?.backend || [],
      Icon: Brain,
    },
    {
      title: dict.databaseStack,
      subtitle: "Coursework and self-study that support my medicine/research path.",
      items: content.stack?.database || [],
      Icon: BookOpen,
    },
    {
      title: dict.toolsStack,
      subtitle: "Tools, certifications, and platforms I use or manage.",
      items: content.stack?.tools || [],
      Icon: Wrench,
    },
  ];

  return (
    <section
      id="stack"
      className="relative container-void overflow-hidden py-28 xl:py-40 border-t border-border/50"
    >
      <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-container max-w-7xl relative z-10">
        <div className="mb-16 md:mb-20">
          <BlurReveal>
            <span className="title-counter">[002]</span>
          </BlurReveal>

          <BlurReveal>
            <h2 className="title mt-4">{dict.stackTitle}</h2>
          </BlurReveal>

          <BlurReveal>
            <p className="mt-5 max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              A cleaner view of the skills, coursework, and interests behind my
              medicine, neuroscience, and research direction.
            </p>
          </BlurReveal>
        </div>

        <div className="space-y-5 md:space-y-6">
          {categories.map((category, catIndex) => {
            const Icon = category.Icon;

            return (
              <BlurReveal key={category.title}>
                <section className="group border border-border/60 bg-secondary/5 backdrop-blur-md p-6 md:p-8 xl:p-10 transition-all duration-500 hover:bg-secondary/15 hover:border-border">
                  <div className="grid grid-cols-1 xl:grid-cols-[0.6fr_1.4fr] gap-8 xl:gap-12 items-start">
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background/60">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>

                        <span className="font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
                          0{catIndex + 1}
                        </span>
                      </div>

                      <h3 className="mt-6 text-2xl md:text-3xl xl:text-4xl font-serif italic font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-500">
                        {category.title}
                      </h3>

                      <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground">
                        {category.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.items.map((item: StackItem) => (
                        <SkillPill key={item.name} name={item.name} />
                      ))}
                    </div>
                  </div>
                </section>
              </BlurReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkillPill({ name }: { name: string }) {
  return (
    <div className="relative overflow-hidden rounded-full border border-border/50 bg-background/50 px-5 py-4 text-sm md:text-base font-medium text-foreground/80 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground hover:bg-background">
      <span>{name}</span>
    </div>
  );
}
