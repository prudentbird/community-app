"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { z } from "zod/v4";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/convex/_generated/api";
import { authClient } from "~/lib/auth-client";

type SignInState = {
  error?: string;
  success?: boolean;
  timestamp: number;
};

type SignUpState = {
  error?: string;
  success?: boolean;
  timestamp: number;
  profileData?: { firstName: string; lastName: string; username: string };
};

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9_-]+$/, "Only lowercase letters, numbers, - and _ allowed"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

async function signInAction(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { timestamp: Date.now(), error: parsed.error.issues[0].message };
  }

  const { error } = await authClient.signIn.email(parsed.data);
  if (error)
    return { timestamp: Date.now(), error: error.message ?? "Sign in failed" };

  return { timestamp: Date.now(), success: true };
}

async function signUpAction(
  _prev: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    username: (formData.get("username") as string).toLowerCase(),
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { timestamp: Date.now(), error: parsed.error.issues[0].message };
  }

  const { error } = await authClient.signUp.email({
    email: parsed.data.email,
    password: parsed.data.password,
    name: `${parsed.data.firstName} ${parsed.data.lastName}`,
  });

  if (error)
    return { timestamp: Date.now(), error: error.message ?? "Sign up failed" };

  return {
    timestamp: Date.now(),
    success: true,
    profileData: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      username: parsed.data.username,
    },
  };
}

export default function AuthForm({
  redirectTo,
  defaultMode,
}: {
  redirectTo: string;
  defaultMode: "sign-in" | "sign-up";
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">(defaultMode);

  const createProfile = useMutation(api.profiles.createProfile);

  const [signInState, signInAction_, signInPending] = useActionState<
    SignInState,
    FormData
  >(signInAction, { timestamp: 0 });

  const [signUpState, signUpAction_, signUpPending] = useActionState<
    SignUpState,
    FormData
  >(signUpAction, { timestamp: 0 });

  useEffect(() => {
    if (signInState.success) {
      router.push(redirectTo);
    }
  }, [signInState.success, redirectTo, router]);

  useEffect(() => {
    if (!signUpState.success || !signUpState.profileData) return;

    const { firstName, lastName, username } = signUpState.profileData;
    createProfile({ firstName, lastName, username })
      .catch(() => {})
      .finally(() => router.push(redirectTo));
  }, [
    signUpState.success,
    signUpState.profileData,
    redirectTo,
    router,
    createProfile,
  ]);

  const switchMode = (next: "sign-in" | "sign-up") => {
    setMode(next);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex mb-6 rounded-xl overflow-hidden border border-white/10">
          <button
            type="button"
            onClick={() => switchMode("sign-in")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "sign-in"
                ? "bg-blue-500 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("sign-up")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              mode === "sign-up"
                ? "bg-blue-500 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-sm">
          {mode === "sign-in" ? (
            <form action={signInAction_} className="flex flex-col gap-4">
              {signInState.error && (
                <p className="text-sm text-red-400 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                  {signInState.error}
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={signInPending}
                className="mt-1 w-full"
              >
                {signInPending ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          ) : (
            <form action={signUpAction_} className="flex flex-col gap-4">
              {signUpState.error && (
                <p className="text-sm text-red-400 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
                  {signUpState.error}
                </p>
              )}

              <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    placeholder="Jane"
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  required
                  autoComplete="username"
                  placeholder="janedoe"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email-up">Email</Label>
                <Input
                  id="email-up"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password-up">Password</Label>
                <Input
                  id="password-up"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="min. 8 characters"
                />
              </div>

              <Button
                type="submit"
                disabled={signUpPending}
                className="mt-1 w-full"
              >
                {signUpPending ? "Creating account…" : "Create Account"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
