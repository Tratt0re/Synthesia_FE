'use client'

import { usePageTitle } from "@/src/contexts/page-title-provider"
import { getUserId } from "@/src/contexts/user-provider"
import { UserService } from "@/src/services/user.service"
import { ProcessedResult } from "@/src/types/processed-result.type"
import { useEffect, useState } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/src/components/ui/pagination"
import { ArchiveSummaryCard } from "@/src/components/archive/archived-summary-card"
import { ArchiveSummaryDetail } from "@/src/components/archive/archive-summary-detail"

export default function Archive() {
  const { setTitle } = usePageTitle()
  const [loading, setLoading] = useState(false)
  const [skip, setSkip] = useState(0)
  const [limit] = useState(10)
  const [archivedSummaries, setArchivedSummaries] = useState<ProcessedResult[]>([])
  const [selectedSummaryId, setSelectedSummaryId] = useState<string>("")

  useEffect(() => {
    async function fetchArchive() {
      try {
        const userId = getUserId()!
        setLoading(true)
        const archivedSummaries = await UserService.getUserResults(userId, skip, limit)
        setArchivedSummaries(archivedSummaries)
      } catch (err) {
        console.error("Failed to load archive", err)
        setArchivedSummaries([])
      } finally {
        setLoading(false)
      }
    }

    fetchArchive()
    setTitle("Archive")
  }, [setTitle, skip, limit])

  const handlePrevious = () => {
    setSkip((prev) => Math.max(prev - limit, 0))
  }

  const handleNext = () => {
    if (archivedSummaries.length === limit) {
      setSkip((prev) => prev + limit)
    }
  }

  const handleDelete = async (entryId: string) => {
    const userId = getUserId()!

    try {
      const result = await UserService.deleteUserResult(userId, entryId)

      if (result) {
        setArchivedSummaries(prev =>
          prev.filter(entry => entry.id !== entryId)
        )
        setSelectedSummaryId("")
      }

    } catch (err) {
      console.error("Failed to delete result", err)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-1 items-start justify-center overflow-hidden px-2 py-12">
          <div className="w-full mx-auto grid lg:grid-cols-2 items-start justify-center gap-6">

            {/* List of cards Container */}
            <div className="h-full w-full p-4">
              <div className="flex flex-col gap-4">
                {archivedSummaries.map((summary) => (
                  <ArchiveSummaryCard
                    key={summary.id}
                    entry={summary}
                    selected={summary.id == selectedSummaryId}
                    onSelect={(entryId) => setSelectedSummaryId(entryId)}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={handlePrevious} />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext onClick={handleNext} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

            </div>

            {/* Card detail Container */}
            <div className="w-full max-w-3xl mx-auto lg:h-[calc(100vh-8rem)] bg-sidebar rounded-xl">
              {
                selectedSummaryId.length > 0 &&
                <ArchiveSummaryDetail
                  entry={archivedSummaries.find(e => e.id! == selectedSummaryId)!}
                  onDelete={(entryId) => handleDelete(entryId)}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
