"use client"
import { ThemeToggle } from "@/component/theme-toggle";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="w-full relative min-h-screen bg-background text-foreground">
      <div className="w-[90%] md:w-[80%] xl:w-[70%] max-w-6xl mx-auto min-h-screen relative flex justify-center">
        <div className="absolute left-4 md:left-0 h-full flex gap-4">
          <div className="w-[3px] h-full bg-yellow"></div>
          <div className="w-[3px] h-full bg-red"></div>
        </div>
        <div className="w-[80%] md:w-[75%] xl:w-[70%] max-w-4xl h-full flex flex-col gap-10 pt-20 px-4">
          <h2 className="text-base">hi, i am bhavesh choudhary and i&apos;m</h2>
          <h1 className="text-3xl md:text-4xl font-normal leading-relaxed md:leading-relaxed">on a mission to craft exceptional digital experiences</h1>
          <Projects />
        </div>
        <div className="absolute right-4 top-4 md:right-0">
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}


function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);
  const projects = [
    {
      "name": "tasks with cli",
      "description": "manage your daily tasks in cli",
      "href": ""
    },
    {
      "name": "codestats",
      "description": "view all your wakatime stats",
      "href": ""
    }
  ]
  return (
    <div className="relative flex flex-col gap-4 my-10">
      <h2 className="text-base">projects</h2>
      <div className="relative flex flex-col">
        {projects.map((project, i) => {
          return (
            <>
              <div
                onMouseOver={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`relative group flex flex-col gap-2 max-w-96 rounded-sm text-foreground hover:text-background dark:hover:text-foreground p-4 cursor-pointer`}>
                <h3 className="text-lg font-medium z-20">{project.name}</h3>
                <p className="text-xs text-foreground/50 group-hover:text-white/50 z-20">{project.description}</p>
                {i === hovered && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-full bg-black rounded-md z-10"
                    aria-hidden="true"
                    style={{
                      width: "100%",
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.25,
                      stiffness: 130,
                      damping: 9,
                      duration: 0.3,
                    }}
                  />
                )}
              </div>

            </>
          )}
        )}
      </div>
    </div>
  )
}