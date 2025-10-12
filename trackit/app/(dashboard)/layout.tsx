// app/(dashboard)/layout.tsx
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-surface dark:bg-surface-dark text-text dark:text-text-dark transition-colors duration-300">
      <Sidebar />

      <div className="flex flex-1 flex-col border-l border-muted dark:border-border-dark">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-surface-alt dark:bg-surface-alt-dark transition-colors duration-300 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
