"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import Image from "next/image";
import Sidebar from "../components/sidebar";
import logo from "@/components/images/logo.png"; // ✅ your logo path
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // ✅ Handle auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login");
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="TrackIt Logo" width={36} height={36} className="rounded-md" />
            <h1 className="text-xl font-bold">TrackIt Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded hover:bg-muted transition"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button
              onClick={handleLogout}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Logout
            </Button>
          </div>
        </nav>

        {/* Main Section */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome, {user.email}!</h2>
          <p className="text-muted-foreground mb-6">
            This is your main dashboard — your projects, tasks, and reminders will appear here.
          </p>

          {/* Example dashboard area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold mb-2">Recent Projects</h3>
              <p className="text-sm text-muted-foreground">
                View and manage your active projects here.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold mb-2">Tasks Overview</h3>
              <p className="text-sm text-muted-foreground">
                Track your daily and long-term tasks in one place.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold mb-2">Reminders</h3>
              <p className="text-sm text-muted-foreground">
                Get notified for important deadlines and meetings.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
