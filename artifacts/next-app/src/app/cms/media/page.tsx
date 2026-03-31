import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MediaLibrary from "@/components/cms/MediaLibrary";

export const metadata = { title: "Media Library — I.T.S. CMS" };

export default async function MediaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <MediaLibrary userId={user.id} />;
}
