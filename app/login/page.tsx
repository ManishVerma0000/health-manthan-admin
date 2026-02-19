"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginApi } from "@/services/auth.service";
import Toast from "@/components/Toast";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Icon from "@/components/Icon"; // Assuming this is the logo

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error" | "info",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginApi(form);
      setToast({
        show: true,
        message: "Login successful",
        type: "success",
      });

      // Allow toast to show briefly before redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);

    } catch (err: any) {
      setToast({
        show: true,
        message: err?.response?.data?.message || err?.message || "Login failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center flex flex-col items-center">
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mb-4">
                {/* Replaced Icon with something consistent if needed, or keeping Icon */}
                <span className="font-bold text-xl">HM</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <Input
                label="Username"
                name="username"
                type="text"
                required
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                isLoading={loading}
                className="w-full"
                size="lg"
              >
                Sign in
              </Button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden lg:block relative bg-muted/30">
          <div className="absolute inset-0 bg-zinc-900 border-l border-white/10" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Health Manthan Admin</h2>
            <p className="text-lg text-zinc-400 max-w-lg">
              Manage your hospital network, doctors, and appointments efficiently with our comprehensive admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
