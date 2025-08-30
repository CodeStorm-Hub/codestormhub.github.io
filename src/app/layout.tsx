import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import VSCodeLayout from "@/components/VSCodeLayout";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { A11yAnnouncer, SkipLink } from "@/components/ui/Accessibility";
import { PerformanceMonitor, PreloadCriticalResources } from "@/components/ui/Performance";

export const metadata: Metadata = {
  metadataBase: new URL("https://codestormhub.github.io"),
  title: "CodeStorm Hub - Full-Stack Development Portfolio",
  description: "Professional portfolio showcasing modern web development, React, TypeScript, and full-stack solutions. Expert developers creating exceptional digital experiences.",
  keywords: [
    "portfolio",
    "web development", 
    "full-stack developer",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "UI/UX design",
    "mobile development",
    "CodeStorm Hub"
  ],
  authors: [{ name: "CodeStorm Hub Team" }],
  creator: "CodeStorm Hub",
  openGraph: {
    title: "CodeStorm Hub - Full-Stack Development Portfolio",
    description: "Professional portfolio showcasing modern web development expertise",
    url: "https://codestormhub.github.io",
    siteName: "CodeStorm Hub",
    images: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&crop=entropy&auto=format",
        width: 1200,
        height: 630,
        alt: "CodeStorm Hub Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeStorm Hub - Full-Stack Development Portfolio",
    description: "Professional portfolio showcasing modern web development expertise",
    images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&crop=entropy&auto=format"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <SkipLink href="#main-content">Skip to main content</SkipLink>
              <A11yAnnouncer />
              <PerformanceMonitor />
              <PreloadCriticalResources />
              <VSCodeLayout>
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
              </VSCodeLayout>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
