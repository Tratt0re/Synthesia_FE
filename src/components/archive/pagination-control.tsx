// components/ui/pagination-controls.tsx

"use client"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/src/components/ui/pagination"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationControlsProps) {
    if (totalPages <= 1) return null

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() =>
                            currentPage > 1 && onPageChange(currentPage - 1)
                        }
                        aria-disabled={currentPage === 1}
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1
                    return (
                        <PaginationItem key={page}>
                            <button
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                    }`}
                            >
                                {page}
                            </button>
                        </PaginationItem>
                    )
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            currentPage < totalPages && onPageChange(currentPage + 1)
                        }
                        aria-disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    )
}
