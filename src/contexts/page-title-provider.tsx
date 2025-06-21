"use client"

import { createContext, useContext, useState } from "react"

const PageTitleContext = createContext<{
    title: string
    setTitle: (title: string) => void
}>({
    title: "",
    setTitle: () => { },
})

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState("")
    return (
        <PageTitleContext.Provider value={{ title, setTitle }}>
            {children}
        </PageTitleContext.Provider>
    )
}

export function usePageTitle() {
    const ctx = useContext(PageTitleContext)
    if (!ctx) throw new Error("usePageTitle must be used within PageTitleProvider")
    return ctx  // returns { title, setTitle }
}

export function useCurrentPageTitle() {
    const ctx = useContext(PageTitleContext)
    if (!ctx) throw new Error("useCurrentPageTitle must be used within PageTitleProvider")
    return ctx.title
}
