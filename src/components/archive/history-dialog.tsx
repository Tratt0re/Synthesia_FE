"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs"
import { ScrollArea } from "@/src/components/ui/scroll-area"

import { ProcessedResult } from "@/src/types/processed-result.type"
import { format } from "date-fns"
import { useState } from "react"

interface HistoryDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    result: ProcessedResult
}

export function HistoryDialog({ isOpen, onOpenChange, result }: HistoryDialogProps) {
    const [tab, setTab] = useState<"entities" | "summaries">("entities")

    const entitiesHistory = result.entities_history ?? []
    const summariesHistory = result.summary_history ?? []

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>History Details</DialogTitle>
                </DialogHeader>

                <Tabs value={tab} onValueChange={(v) => setTab(v as "entities" | "summaries")} className="mt-4 flex flex-col flex-1">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="entities">Entities</TabsTrigger>
                        <TabsTrigger value="summaries">Summaries</TabsTrigger>
                    </TabsList>

                    <TabsContent value="entities" className="flex-1">
                        <ScrollArea className="h-[60vh] pr-2">
                            {entitiesHistory.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No entity history available.</p>
                            ) : (
                                <div className="flex flex-col gap-4 pr-2">
                                    {entitiesHistory.map((entry, idx) => (
                                        <div key={`entities-${idx}`} className="border p-4 rounded bg-muted/50">
                                            <div className="text-sm text-muted-foreground mb-2">
                                                {format(new Date(entry.timestamp), "PPpp")} • Model:{" "}
                                                <span className="font-medium">{entry.model}</span>
                                            </div>
                                            <pre className="text-sm bg-background p-2 rounded overflow-auto whitespace-pre-wrap">
                                                {JSON.stringify(entry.value, null, 2)}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="summaries" className="flex-1">
                        <ScrollArea className="h-[60vh] pr-2">
                            {summariesHistory.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No summary history available.</p>
                            ) : (
                                <div className="flex flex-col gap-4 pr-2">
                                    {summariesHistory.map((entry, idx) => (
                                        <div key={`summary-${idx}`} className="border p-4 rounded bg-muted/50">
                                            <div className="text-sm text-muted-foreground mb-2">
                                                {format(new Date(entry.timestamp), "PPpp")} • Model:{" "}
                                                <span className="font-medium">{entry.model}</span>
                                            </div>
                                            <p className="text-sm whitespace-pre-wrap">{String(entry.value)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
