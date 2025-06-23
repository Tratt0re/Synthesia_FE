"use client"

import { AnalyzeResponse } from "@/src/types/summarize.type"
import React from "react"
import { Download } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface AnalyzeResultProps {
    result: AnalyzeResponse
}

export function SummaryWindow({ result }: AnalyzeResultProps) {

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(result, null, 2)], {
            type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `synthesia_result_${result.result_id}.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full h-full p-6 overflow-y-auto flex flex-col gap-8">
            {/* Summary Section */}
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Summary</h2>
                    <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download JSON">
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
                <p>{result.summary}</p>
            </div>

            {/* Entities Section */}
            <div>
                <h2 className="text-lg font-semibold">Extracted Entities</h2>
                <pre className="bg-background p-4 rounded-xl text-sm whitespace-pre-wrap">
                    {JSON.stringify(result.entities, null, 2)}
                </pre>
            </div>
        </div>
    )
}
