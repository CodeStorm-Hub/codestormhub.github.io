import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeStorm Hub",
  description: "Portfolio website for CodeStorm Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
