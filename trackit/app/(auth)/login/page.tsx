"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import logo from "../../components/images/logo.png";
import googleIcon from "../../components/images/googleIcon.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ✅ Email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Sign-in
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent!");
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface dark:bg-surface-dark transition-colors">
      <form
        onSubmit={handleLogin}
        className="p-8 rounded-3xl bg-surface-alt dark:bg-surface-alt-dark shadow-xl space-y-6 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Image src={logo} alt="TrackIt Logo" width={80} height={80} />
        </div>

        <h2 className="text-xl font-semibold text-center text-text dark:text-text-dark">
          Sign In
        </h2>

        {/* Feedback messages */}
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-500 text-center">{success}</p>
        )}

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-muted rounded-lg bg-surface-alt dark:bg-surface-alt-dark text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-muted rounded-lg bg-surface-alt dark:bg-surface-alt-dark text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-muted hover:bg-hover dark:hover:bg-hover-dark transition-colors bg-surface-alt dark:bg-surface-alt-dark"
        >
          <Image src={googleIcon} alt="Google Logo" width={20} height={20} />
          <span className="text-text dark:text-text-dark font-medium">
            Sign In with Google
          </span>
        </button>

        {/* Main Login Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-secondary text-text-light dark:bg-primary-dark dark:hover:bg-secondary-dark dark:text-text-dark font-semibold py-2 rounded-lg transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* Redirect to Sign Up */}
        <p className="text-sm text-center text-muted dark:text-muted-dark">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}
