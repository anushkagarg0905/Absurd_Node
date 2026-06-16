import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InvestigationProvider } from "@/lib/context/InvestigationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Absurd Node - AI-Powered OSINT Knowledge Graph",
  description: "Discover connections and resolve entities with our advanced AI-driven OSINT relationship mapping platform.",
  keywords: ["OSINT", "Knowledge Graph", "Entity Resolution", "AI Intelligence", "Network Graph"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <InvestigationProvider>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </InvestigationProvider>
      </body>
    </html>
  );
}

