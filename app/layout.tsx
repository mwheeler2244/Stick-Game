import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stick Hero Game",
  description: "A fun stick hero game built with Next.js and TypeScript",
  keywords: ["game", "stick hero", "nextjs", "typescript", "canvas"],
  authors: [{ name: "Stick Hero Game" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
