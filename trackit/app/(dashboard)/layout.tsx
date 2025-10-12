// app/(dashboard)/layout.tsx
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-surface dark:bg-surface-dark text-text dark:text-text-dark transition-colors duration-300">
      {/* Navbar spans full width */}
      <Navbar />

      {/* Main content area with sidebar + content below navbar */}
      <div className="flex flex-1 overflow-hidden border-t border-muted dark:border-border-dark">
        {/* Sidebar sits below the navbar now */}
        <Sidebar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-surface-alt dark:bg-surface-alt-dark transition-colors duration-300 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
