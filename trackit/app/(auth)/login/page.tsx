"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import logo from "../../components/images/logo.png";          // ✅ correct logo path
import googleIcon from "../../components/images/googleIcon.png"; // ✅ correct Google icon path


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
   <div className="flex min-h-screen items-center justify-center bg-surface transition-colors dark:bg-surface-dark">
  <form
    onSubmit={handleLogin}
    className="p-8 rounded-3xl bg-surface-alt transition-colors dark:bg-surface-alt-dark shadow-xl space-y-6 w-full max-w-sm"
  >
    {/* Logo Only */}
    <div className="flex flex-col items-center gap-2">
      <Image src={logo} alt="TrackIt Logo" width={80} height={80} />
      {/* TrackIt label removed */}
    </div>

    <h2 className="text-xl font-semibold text-center text-text transition-colors dark:text-text-dark">
      Sign In
    </h2>

    {error && <p className="text-sm text-accent-dark text-center">{error}</p>}

    <input
      type="email"
      placeholder="Email"
      className="w-full p-3 border border-muted rounded-lg bg-surface-alt transition-colors dark:bg-surface-alt-dark text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    <input
      type="password"
      placeholder="Password"
      className="w-full p-3 border border-muted rounded-lg bg-surface-alt transition-colors dark:bg-surface-alt-dark text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    {/* Google Sign-In Button */}
    <button
      type="button"
      //onClick={handleGoogleLogin} // implement this function
      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-muted hover:bg-hover dark:hover:bg-hover-dark transition-colors bg-surface-alt dark:bg-surface-alt-dark"
    >
      <Image src={googleIcon} alt="Google Logo" width={20} height={20} />
      <span className="text-text dark:text-text-dark font-medium">
        Sign In with Google
      </span>
    </button>

    <Button
      type="submit"
      className="w-full bg-primary hover:bg-secondary text-text-light dark:bg-primary-dark dark:hover:bg-secondary-dark dark:text-text-dark font-semibold py-2 rounded-lg transition-colors"
    >
      Login
    </Button>
  </form>
</div>


  );
}
