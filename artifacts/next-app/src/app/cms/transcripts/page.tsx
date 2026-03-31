import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TranscriptsManager from "@/components/cms/TranscriptsManager";

export const metadata = { title: "Transcripts — I.T.S. CMS" };

export default async function TranscriptsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <TranscriptsManager userId={user.id} />;
}
