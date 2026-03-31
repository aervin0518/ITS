import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SetPasswordForm from "@/components/SetPasswordForm";

export const metadata = {
  title: "Set Password — I.T.S. Fatherhood",
};

export default async function SetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=invite_expired");
  }

  return <SetPasswordForm />;
}
