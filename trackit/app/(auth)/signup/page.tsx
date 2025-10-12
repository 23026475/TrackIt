"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react"; // 👁️ Icons for show/hide
import logo from "../components/images/logo.png";
import googleIcon from "../components/images/googleIcon.png";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // ✅ Email & Password Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface dark:bg-surface-dark transition-colors">
      <form
        onSubmit={handleSignup}
        className="p-8 rounded-3xl bg-surface-alt dark:bg-surface-alt-dark shadow-xl space-y-6 w-full max-w-sm transition-colors"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Image src={logo} alt="TrackIt Logo" width={90} height={90} />
        </div>

        <h2 className="text-xl font-semibold text-center text-text dark:text-text-dark">
          Sign Up
        </h2>

        {error && (
          <p className="text-sm text-red-500 text-center font-medium">{error}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-muted rounded-lg bg-surface-alt dark:bg-surface-alt-dark text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pr-10 border border-muted rounded-lg bg-surface-alt dark:bg-surface-alt-dark text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-muted dark:text-muted-dark hover:text-primary dark:hover:text-primary-dark"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-3 pr-10 border border-muted rounded-lg bg-surface-alt dark:bg-surface-alt-dark text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-colors"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-muted dark:text-muted-dark hover:text-primary dark:hover:text-primary-dark"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Google Sign-Up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-muted hover:bg-hover dark:hover:bg-hover-dark transition-colors bg-surface-alt dark:bg-surface-alt-dark disabled:opacity-60"
        >
          <Image src={googleIcon} alt="Google Logo" width={20} height={20} />
          <span className="text-text dark:text-text-dark font-medium">
            {loading ? "Signing up..." : "Sign Up with Google"}
          </span>
        </button>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-secondary text-white dark:bg-primary-dark dark:hover:bg-secondary-dark font-semibold py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
