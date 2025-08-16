"use client";
import React from "react";
import ChatMessage from "@/components/ChatMessage";
import Navbar from "@/components/Navbar";
import PromptInput from "@/components/PromptInput";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const { history } = useAppStore();
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="z-10 relative w-full h-full pointer-events-auto">
        <Navbar />
        <main className="flex flex-col justify-center items-center bg-[#141414] w-full h-[calc(100vh-4rem)]">
          <div className="flex flex-1 justify-center items-start p-10 w-full h-full">
            <div className="flex sm:flex-col items-center sm:items-stretch gap-2 sm:gap-4 w-full max-w-3xl h-full">
              {history.map((message, idx) => {
                return <ChatMessage key={idx} id={idx} />;
              })}
            </div>
          </div>
          <PromptInput />
        </main>
      </div>
    </div>
  );
}
