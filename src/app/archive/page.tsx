'use client'

import { usePageTitle } from "@/src/contexts/page-title-provider"
import { getUserId } from "@/src/contexts/user-provider"
import { UserService } from "@/src/services/user.service"
import { ProcessedResult } from "@/src/types/processed-result.type"
import { useEffect, useState } from "react"
import { ArchiveSummaryCard } from "@/src/components/archive/archived-summary-card"
import { ArchiveSummaryDetail } from "@/src/components/archive/archive-summary-detail"
import { PaginationControls } from "@/src/components/archive/pagination-control"
import { useIsMobile } from "@/src/hooks/use-mobile"
import { useRouter } from "next/navigation"
import { SkeletonCard } from "@/src/components/ui/skeleton-elements"
import { HistoryDialog } from "@/src/components/archive/history-dialog"

export default function Archive() {

  const isMobile = useIsMobile()
  const router = useRouter()

  const { setTitle } = usePageTitle()
  const [loading, setLoading] = useState(false)
  const [skip, setSkip] = useState(0)
  const [limit] = useState(3)
  const [archivedSummaries, setArchivedSummaries] = useState<ProcessedResult[]>([])
  const [selectedSummaryId, setSelectedSummaryId] = useState<string>("")
  const [totalPages, setTotalPages] = useState(1)
  const [showHistory, setShowHistory] = useState(false)


  useEffect(() => {
    async function fetchArchive() {
      try {
        const userId = getUserId()!
        setLoading(true)
        const paginatedResponse = await UserService.getUserResults(userId, skip, limit)
        const archivedResults = paginatedResponse.results
        const totalDocuments = paginatedResponse.total
        setTotalPages(Math.ceil(totalDocuments / limit))
        setArchivedSummaries(archivedResults)
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

  const goToDetail = (entryId: string) => {
    router.push(`/archive/${entryId}`)
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
    <>
      {
        showHistory && <HistoryDialog
          isOpen={showHistory}
          onOpenChange={setShowHistory}
          result={archivedSummaries.find(s => s.id! === selectedSummaryId)!}
        />
      }

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          <div className="flex flex-1 items-start justify-center overflow-hidden px-2 py-12">
            <div className="w-full mx-auto grid lg:grid-cols-2 items-start justify-center gap-6">

              {/* List of cards Container */}
              <div className="h-full w-full p-4">
                <div className="flex flex-col gap-4">

                  {
                    loading && [0, 1, 2].map((e, idx) => {
                      return <SkeletonCard key={`skeleton-${idx}`} />
                    })
                  }

                  {archivedSummaries.map((summary) => (
                    <ArchiveSummaryCard
                      key={summary.id}
                      entry={summary}
                      selected={summary.id == selectedSummaryId}
                      onSelect={(entryId) => {
                        if (isMobile) {
                          goToDetail(entryId)
                        }
                        setSelectedSummaryId(entryId)
                      }}
                    />
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <PaginationControls
                    currentPage={Math.floor(skip / limit) + 1}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setSelectedSummaryId("")
                      setSkip((page - 1) * limit)
                    }}
                  />
                </div>
              </div>

              {/* Card detail Container */}

              {
                !isMobile &&
                <div className="w-full max-w-3xl mx-auto h-auto sm:h-[calc(100vh-8rem)] bg-sidebar rounded-xl overflow-auto">
                  {
                    selectedSummaryId.length > 0 &&
                    <ArchiveSummaryDetail
                      entry={archivedSummaries.find(e => e.id! == selectedSummaryId)!}
                      onDelete={(entryId) => handleDelete(entryId)}
                      onHistory={() => setShowHistory(true)}
                    />
                  }
                </div>
              }

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
