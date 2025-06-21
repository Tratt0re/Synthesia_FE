'use client'

import { usePageTitle } from "@/src/contexts/page-title-provider";
import { useEffect } from "react";

export default function Settings() {
  const { setTitle } = usePageTitle()
  
    useEffect(() => {
      setTitle("Settings")
    }, [setTitle])

  return (
    <div>
      <p>Settings</p>
    </div>
  );
}