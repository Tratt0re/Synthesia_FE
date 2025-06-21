'use client'

import { usePageTitle } from "@/src/contexts/page-title-provider";
import { useEffect } from "react";

export default function Summarize() {
  const { setTitle } = usePageTitle()
  
    useEffect(() => {
      setTitle("Summarize")
    }, [setTitle])

  return (
    <div>
      <p>Summarize</p>
    </div>
  );
}
