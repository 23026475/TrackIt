import "./globals.css";
import { ThemeProvider } from "../app/components/theme-provider";
import Navbar from "../app/components/navbar";

export const metadata = {
  title: "TrackIt",
  description: "Track your projects and tasks efficiently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
