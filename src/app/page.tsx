'use client'

import { usePageTitle } from "../contexts/page-title-provider";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { BackgroundPattern } from "../components/ui/background-pattern";


export default function Home() {
  const { setTitle } = usePageTitle()

  useEffect(() => {
    setTitle("Home")
  }, [setTitle])

  return (
    <div className="flex flex-1 flex-col relative overflow-hidden">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-12 gap-12 sm:px-12 sm:py-16 font-[family-name:var(--font-geist-sans)]">
          
          <BackgroundPattern />
          <main className="z-10 flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <div className="text-center max-w-3xl sm:text-left">
              <h1 className="text-center mt-6 text-4xl sm:text-5xl md:text-6xl md:leading-[1.2] font-bold">
                Synthesia: LLM-powered Summarization & Extraction
              </h1>
              
              <p className="text-center mt-6 text-[17px] md:text-lg text-muted-foreground">
                Synthesia is a university thesis project designed to demonstrate the power
                of modern Large Language Models (LLMs) in real-world tasks. It enables fast,
                automated summarization and entity extraction from unstructured documents.
                Whether you're dealing with raw text or PDF files, Synthesia turns complexity
                into clarity — in just a few clicks.
              </p>

              <p className="text-center mt-4 text-sm text-muted-foreground">
                Built using React, FastAPI, MongoDB and models like LLaMA 3 and Mixtral.
              </p>

              <div className="mt-12 flex items-center justify-center gap-4">
                <Button size="lg" className="rounded-full text-base">
                  <Link href="/summarize" className="flex items-center gap-2">
                    <ArrowUpRight className="!h-5 !w-5" />
                    <span>Get Started</span>
                  </Link>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

  );
}
