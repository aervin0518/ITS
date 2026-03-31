import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import DashboardOverview from "@/components/cms/DashboardOverview";

export const metadata = { title: "Dashboard — I.T.S. CMS" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("id, email, first_name, last_name, status, user_roles(roles(id, name))")
    .eq("id", user.id)
    .single();

  const role = (profile as any)?.user_roles?.[0]?.roles?.name ?? null;
  if (!role) redirect("/login");

  // Fetch live stats in parallel
  const [
    { count: userCount },
    { count: fatherCount },
    { count: publicationCount },
    { count: transcriptCount },
    { count: surveyCount },
    { count: interviewCount },
    { count: assessmentCount },
    { count: programCount },
  ] = await Promise.all([
    admin.from("user_profiles").select("id", { count: "exact", head: true }),
    admin.from("father_profiles").select("id", { count: "exact", head: true }),
    admin.from("publications").select("id", { count: "exact", head: true }),
    admin.from("transcripts").select("id", { count: "exact", head: true }),
    admin.from("surveys").select("id", { count: "exact", head: true }),
    admin.from("interviews").select("id", { count: "exact", head: true }),
    admin.from("assessment_results").select("id", { count: "exact", head: true }),
    admin.from("programs").select("id", { count: "exact", head: true }),
  ]);

  // Pending review counts
  const { count: pendingTranscripts } = await admin
    .from("transcripts")
    .select("id", { count: "exact", head: true })
    .eq("processed_flag", false);

  const { count: pendingInterviews } = await admin
    .from("interviews")
    .select("id", { count: "exact", head: true })
    .eq("status", "scheduled");

  return (
    <DashboardOverview
      profile={{
        id: (profile as any).id,
        email: (profile as any).email,
        first_name: (profile as any).first_name,
        last_name: (profile as any).last_name,
        role,
      }}
      stats={{
        userCount: userCount ?? 0,
        fatherCount: fatherCount ?? 0,
        publicationCount: publicationCount ?? 0,
        transcriptCount: transcriptCount ?? 0,
        surveyCount: surveyCount ?? 0,
        interviewCount: interviewCount ?? 0,
        assessmentCount: assessmentCount ?? 0,
        programCount: programCount ?? 0,
        pendingTranscripts: pendingTranscripts ?? 0,
        pendingInterviews: pendingInterviews ?? 0,
      }}
    />
  );
}
