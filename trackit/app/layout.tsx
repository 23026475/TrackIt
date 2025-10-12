// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrackIt",
  description: "Project tracking made simple.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-surface text-text dark:bg-surface-dark dark:text-text-dark transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
