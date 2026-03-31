import { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | I.T.S. Fatherhood",
  description: "Sign in to access the I.T.S. Fatherhood platform.",
};

const ERROR_MESSAGES: Record<string, string> = {
  invite_expired:
    "Your invitation link has expired or is no longer valid. Please contact your administrator to resend the invite.",
  invite_failed:
    "We could not process your invitation link. Please try clicking the link in your email again, or contact your administrator.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? null) : null;

  return <LoginForm urlError={errorMessage} />;
}
