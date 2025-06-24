import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { PageTitleProvider } from "../contexts/page-title-provider";
import { ThemeProvider } from "../components/theme-provider";
import { UserProvider } from "../contexts/user-provider";

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
          <UserProvider>
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
                  {children}
                  <SiteFooter />
                </SidebarInset>
              </SidebarProvider>
            </PageTitleProvider>
          </UserProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
