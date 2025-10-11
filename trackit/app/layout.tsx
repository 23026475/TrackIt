import "./globals.css";
import { ThemeProvider } from "../app/components/theme-provider";
import Navbar from "../app/components/navbar";
import Sidebar from "../app/components/sidebar";

export const metadata = {
  title: "TrackIt",
  description: "Track your projects and tasks efficiently.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark transition-colors min-h-screen">
        <ThemeProvider>
          {/* Navbar spans full width */}
          <Navbar />

          <div className="flex w-full min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto bg-surface dark:bg-surface-dark transition-colors">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>

  );
}
