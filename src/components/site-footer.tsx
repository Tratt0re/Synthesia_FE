import { Separator } from "./ui/separator";
import Link from "next/link";


export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <div className="mt-auto w-full">
            <footer >
                <Separator />
                <div className="mx-auto px-6 xl:px-4 py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-y-4">
                    <span className="text-sm text-muted-foreground">
                        &copy; {year}{" "}
                        <Link href="/" className="hover:underline" aria-label="Home">
                            Salvatore De Luca
                        </Link>
                    </span>
                </div>
            </footer>
        </div>
    );
};

