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
      <body className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <div className="flex w-full min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
