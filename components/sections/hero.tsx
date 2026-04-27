"use client";

import { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
    useScroll,
    useTransform,
    motion,
    useMotionTemplate,
} from "framer-motion";
import { BackgroundEffects } from "@/components/background-effects";
import { ArrowRight, Mail, Mouse } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { ContactModal } from "@/components/contact-modal";

const HeroScene = dynamic(() => import("@/components/3d/object-1"), {
    ssr: false,
});

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

export default function Hero() {
    const { content } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const [contactOpen, setContactOpen] = useState(false);

    const opacity = useTransform(scrollY, [0, 800], [1, 0]);
    const scale = useTransform(scrollY, [0, 800], [1, 0.9]);
    const y = useTransform(scrollY, [0, 800], [0, 100]);
    const blurValue = useTransform(scrollY, [0, 800], [0, 10]);
    const filter = useMotionTemplate`blur(${blurValue}px)`;

    const scrollToProjects = useCallback(() => {
        const sections = document.querySelectorAll("main > div.relative section");
        for (const section of sections) {
            if (section.querySelector("[data-slot='projects']") ||
                section.textContent?.includes(content.projects?.title)) {
                section.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }
        const allSections = document.querySelectorAll("section");
        const projectsSection = Array.from(allSections).find(s =>
            s.textContent?.includes(content.projects?.title || "PROJECTS")
        );
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: "smooth" });
        }
    }, [content.projects?.title]);

    return (
        <section
            ref={containerRef}
            className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background"
        >

            <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ opacity }}
            >
                <HeroScene />
            </motion.div>

            <BackgroundEffects className="md:hidden" />

            <motion.div
                style={{ opacity, scale, y, filter }}
                className="relative z-20 flex flex-col items-center text-center px-4 max-w-2xl mx-auto will-change-[opacity,transform,filter]"
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-background/40 blur-[100px] rounded-full pointer-events-none -z-10" />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center"
                >
                    <motion.div variants={fadeUp} className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-4 px-5 py-2.5 rounded-full border border-border/50 bg-secondary/20 backdrop-blur-md shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase pt-0.5">
                                Kintarowwwards
                            </span>
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl font-bold sm:font-black tracking-tighter leading-[1.1] sm:leading-[0.95] uppercase mb-6 sm:mb-8"
                    >
                        {content.hero.title}
                    </motion.h1>

                    <motion.div
                        variants={fadeUp}
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <button
                            onClick={() => setContactOpen(true)}
                            className="group relative flex h-14 lg:h-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-8 lg:px-10 text-background transition-all duration-500 ease-out hover:bg-background hover:border-foreground/30 hover:text-foreground shadow-2xl hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-13 group-hover:duration-1000 group-hover:translate-x-full">
                                <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
                            </div>
                            <span className="relative z-10 flex items-center gap-3 text-xs lg:text-sm font-medium tracking-[0.15em] uppercase">
                                {content.hero.cta_primary}
                                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                            </span>
                        </button>

                        <button
                            onClick={scrollToProjects}
                            className="group relative flex h-14 lg:h-16 cursor-pointer items-center justify-center px-8 text-muted-foreground transition-all duration-500 hover:text-foreground hover:bg-secondary/20 rounded-full border border-transparent hover:border-border/50 backdrop-blur-sm max-sm:hidden"
                        >
                            <span className="relative z-10 text-xs lg:text-sm font-medium tracking-[0.15em] uppercase flex items-center gap-2">
                                <Mouse className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                {content.hero.cta_secondary}
                            </span>
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>

            <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
        </section>
    );
}