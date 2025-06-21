'use client'

import { usePageTitle } from "@/src/contexts/page-title-provider";
import { useEffect } from "react";

export default function Archive() {
  const { setTitle } = usePageTitle()
  
    useEffect(() => {
      setTitle("Archive")
    }, [setTitle])

  return (
    <div>
      <p>Archive</p>
    </div>
  );
}