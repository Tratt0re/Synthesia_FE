'use client'

import { UserService } from "@/src/services/user.service"
import { ArchiveSummaryDetail } from "@/src/components/archive/archive-summary-detail"
import { getUserId } from "@/src/contexts/user-provider"
import { ProcessedResult } from "@/src/types/processed-result.type"
import { use, useEffect, useState } from "react"
import { usePageTitle } from "@/src/contexts/page-title-provider"
import { DocumentSkeleton } from "@/src/components/ui/skeleton-elements"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { ChevronLeftIcon } from "lucide-react"
import { HistoryDialog } from "@/src/components/archive/history-dialog"

interface PageProps {
    params: Promise<{ id: string }>
}

export default function ArchiveDetailPage(props: PageProps) {

    const router = useRouter()
    const { id } = use(props.params)
    const { setTitle } = usePageTitle()
    const [loading, setLoading] = useState(false)
    const [selectedResult, setSelectedResult] = useState<ProcessedResult>()
    const [showHistory, setShowHistory] = useState(false)

    useEffect(() => {
        async function fetchArchivedResult() {
            try {
                const userId = getUserId()!
                setLoading(true)
                const selectedResult = await UserService.getUserResult(userId!, id)

                console.log(selectedResult)
                if (!selectedResult) {
                    setSelectedResult(undefined)
                } else {
                    setSelectedResult(selectedResult)
                }
            } catch (err) {
                console.error("Failed to load detail", err)
                setSelectedResult(undefined) // fallback to undefined
            } finally {
                setLoading(false)
            }
        }

        fetchArchivedResult()
        setTitle("Summary detail")
    }, [setTitle, id])


    const handleDelete = async (entryId: string) => {
        const userId = getUserId()!

        try {
            const result = await UserService.deleteUserResult(userId, entryId)

            if (result) {
                router.back()
            }

        } catch (err) {
            console.error("Failed to delete result", err)
        }
    }

    return (
        <>
            {
                showHistory && <HistoryDialog
                    isOpen={showHistory}
                    onOpenChange={setShowHistory}
                    result={selectedResult!}
                />
            }
            <div className="p-6 flex flex-col gap-6">
                <Button variant="secondary" size="sm" className="w-fit" onClick={() => router.back()}>
                    <ChevronLeftIcon className="mr-1 h-4 w-4" /> Back
                </Button>
                {loading && <DocumentSkeleton />}
                {!loading && !selectedResult && <p>Summary not found.</p>}
                {selectedResult && (
                    <ArchiveSummaryDetail
                        entry={selectedResult}
                        onDelete={(entryId) => handleDelete(entryId)}
                        onHistory={() => setShowHistory(true)}
                    />
                )}
            </div>
        </>

    )

}
