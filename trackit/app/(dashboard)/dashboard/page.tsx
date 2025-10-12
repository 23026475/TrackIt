"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import Sidebar from "../../components/sidebar";
import logo from "../../components/images/googleIcon.png"; // ✅ your logo path
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

      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

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
