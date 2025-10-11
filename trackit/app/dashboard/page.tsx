"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import Image from "next/image";
import logo from "@/components/images/logo.png"; // path to your logo


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login"); // redirect to login if not logged in
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return null; // or a loading spinner

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-xl font-bold dark:text-white">TrackIt Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="dark:text-white">{user.email}</span>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold dark:text-white">Welcome, {user.email}!</h2>
        <p className="mt-2 dark:text-gray-300">
          This will be your main dashboard where projects, tasks, and sprints appear.
        </p>
      </main>
    </div>
  );
}
