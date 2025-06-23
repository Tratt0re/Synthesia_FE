"use client"

import React from "react"
import { Download, History, TrashIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { ProcessedResult } from "@/src/types/processed-result.type"
import { formatDate } from "date-fns"

interface ArchiveSummaryDetailProps {
    entry: ProcessedResult
    onDelete: (entryId: string) => void
}

export function ArchiveSummaryDetail({ entry, onDelete }: ArchiveSummaryDetailProps) {

    const createdAt = formatDate(new Date(entry.created_at), "dd/MM/yyyy")

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(entry, null, 2)], {
            type: "application/json",
        })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `synthesia_result_${entry.id}.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="w-full h-full p-6 overflow-y-auto flex flex-col gap-8">
            {/* Header actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">
                        Summary Versions: {entry.summary_history?.length ?? 0}
                    </Badge>
                    <Badge variant="outline">
                        Entity Versions: {entry.entities_history?.length ?? 0}
                    </Badge>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download JSON">
                        <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                        <History className="w-4 h-4 mr-1" />
                        View History
                    </Button>
                </div>
            </div>

            {/* Summary */}
            <div>

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold mb-2">Summary</h2>
                    <div className="flex gap-2 mb-2 flex-wrap">
                        <Badge variant="default">{entry.model}</Badge>
                        <Badge variant="default">{entry.language?.toUpperCase() ?? "N/A"}</Badge>
                        <Badge variant="default">{createdAt}</Badge>
                    </div>
                </div>

                <p className="text-sm whitespace-pre-wrap">
                    {entry.summary || "No summary available."}
                </p>
            </div>

            {/* Entities */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Extracted Entities</h2>
                <pre className="bg-muted p-4 rounded-xl text-sm whitespace-pre-wrap">
                    {JSON.stringify(entry.extracted_entities ?? {}, null, 2)}
                </pre>
            </div>

            <div className="flex justify-end">
                <Button variant="destructive" size="sm" onClick={() => onDelete(entry.id!)}>
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete archived summary
                </Button>
            </div>
        </div>
    )
}
