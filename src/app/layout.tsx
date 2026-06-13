import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CV Builder — Create Professional CVs in Minutes",
  description: "Build a stunning CV with AI-powered suggestions, beautiful templates, and one-click PDF export.",
  keywords: ["CV builder", "resume builder", "AI resume", "professional CV"],
  openGraph: {
    title: "CV Builder",
    description: "Build a stunning CV with AI-powered suggestions",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 antialiased`}>{children}</body>
    </html>
  );
}
