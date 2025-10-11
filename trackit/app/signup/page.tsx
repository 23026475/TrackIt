"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSignup}
        className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg space-y-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-center dark:text-white">
          Sign Up
        </h1>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
