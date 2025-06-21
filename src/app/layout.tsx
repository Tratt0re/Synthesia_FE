import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { PageTitleProvider } from "../contexts/page-title-provider";
import { ThemeProvider } from "../components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synthesia",
  description: "A document intelligence platform powered by LLMs and modern web technologies.",
  // metadataBase: new URL("https://synthesia.app"),
  keywords: ["LLM", "document intelligence", "summarization", "AI", "Next.js", "ShadCN"],
  authors: [{ name: "Salvatore De Luca", url: "https://github.com/Tratt0re" }],
  creator: "Salvatore De Luca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageTitleProvider>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              <AppSidebar variant="inset" />
              <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                        {children}
                      </main>
                    </div>
                  </div>
                </div>
                <SiteFooter />
              </SidebarInset>
            </SidebarProvider>
          </PageTitleProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
