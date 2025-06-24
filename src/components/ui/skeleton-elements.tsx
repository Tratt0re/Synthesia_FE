'use client'

import { useEffect, useRef, useState } from "react"
import { Skeleton } from "./skeleton"

export function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[150px]  w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[70%]" />
                <Skeleton className="h-4 w-[35%]" />
            </div>
        </div>
    )
}

export function DocumentSkeleton() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [lineCount, setLineCount] = useState(0)

    useEffect(() => {
        const calculateLines = () => {
            if (!containerRef.current) return
            const containerHeight = containerRef.current.clientHeight
            const lineHeight = 25 // Approx height per line including margin
            const count = Math.floor(containerHeight / lineHeight) - 2
            setLineCount(count)
        }

        calculateLines()
        window.addEventListener("resize", calculateLines)
        return () => window.removeEventListener("resize", calculateLines)
    }, [])

    return (
        <div ref={containerRef} className="h-full w-full p-8 overflow-hidden">
            <Skeleton className="h-6 w-3/4 mb-4 bg-background" />
            <div className="flex flex-col gap-2">
                {Array.from({ length: lineCount }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className={`h-4 ${i % 4 === 0
                            ? "w-[90%]"
                            : i % 4 === 1
                                ? "w-[75%]"
                                : i % 4 === 2
                                    ? "w-[95%]"
                                    : "w-[60%]"
                            } bg-background`}
                    />
                ))}
            </div>
        </div>
    )
}