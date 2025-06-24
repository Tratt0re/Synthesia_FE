import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/src/components/ui/card"
import { ProcessedResult } from "@/src/types/processed-result.type"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/src/lib/utils"

interface ArchiveSummaryCardProps {
    entry: ProcessedResult
    selected: boolean
    onSelect: (entryId: string) => void
}

export function ArchiveSummaryCard({
    entry,
    selected,
    onSelect,
}: ArchiveSummaryCardProps) {
    const createdAt = formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })

    return (
        <Card
            className={cn(
                "w-full cursor-pointer border",
                selected && "border-primary ring-1 ring-primary"
            )}
            onClick={() => onSelect(entry.id!)}
        >
            <CardHeader>
                <CardTitle className="text-base">{entry.filename ?? "Text Input"}</CardTitle>
                <CardDescription className="text-xs">
                    {entry.model} • {entry.language?.toUpperCase() ?? "N/A"} • {createdAt}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-6">
                    {entry.summary ?? "No summary available."}
                </p>
            </CardContent>

            <CardFooter />
        </Card>
    )
}
