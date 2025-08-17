"use client";
import React from "react";
import ChatMessage from "@/components/ChatMessage";
import Navbar from "@/components/Navbar";
import PromptInput from "@/components/PromptInput";
import { useAppStore } from "@/store/useAppStore";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Cover } from "@/components/ui/cover";

export default function Home() {
  const { history } = useAppStore();
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <AuroraBackground>
        <div className="z-10 relative w-full h-full pointer-events-auto">
          <Navbar />
          <main className="flex flex-col justify-center items-center backdrop-blur-lg w-full h-[calc(100vh-8rem)]">
            <div className="flex flex-1 justify-center items-start p-10 w-full h-full">
              <div className="flex sm:flex-col items-center sm:items-stretch gap-2 sm:gap-4 pt-6 w-full max-w-3xl h-full overflow-auto custom-scrollbar">
                {history.length === 0 ? (
                  <GreetingText />
                ) : (
                  history.map((_, idx) => {
                    return <ChatMessage key={idx} id={idx} />;
                  })
                )}
              </div>
            </div>
            <PromptInput />
          </main>
        </div>
      </AuroraBackground>
    </div>
  );
}

function GreetingText() {
  return (
    <div>
      <h1 className="z-20 relative bg-clip-text bg-gradient-to-b from-neutral-800 dark:from-neutral-800 via-neutral-700 dark:via-white to-neutral-700 dark:to-white mx-auto mt-6 py-6 max-w-7xl font-semibold text-transparent text-4xl md:text-4xl lg:text-6xl text-center">
        Design powerful databases <br /> at <Cover>AI speed</Cover>
      </h1>
    </div>
  );
}
