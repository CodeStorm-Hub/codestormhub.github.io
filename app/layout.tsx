import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeStorm Hub",
  description: "CodeStorm Hub portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
