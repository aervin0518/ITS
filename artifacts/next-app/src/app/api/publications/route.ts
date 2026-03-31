import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { insertAuditLog } from "@/lib/audit";

const MANAGE_ROLES = ["Admin", "Program Admin"];
const READ_ROLES = ["Admin", "Program Admin", "Researcher", "Partner", "Subscriber"];

async function getAuth(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_profiles")
    .select("email, user_roles(roles(name))")
    .eq("id", userId)
    .single();
  return {
    role: (data as any)?.user_roles?.[0]?.roles?.name ?? null,
    email: (data as any)?.email ?? null,
  };
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await getAuth(user.id);
  if (!role || !READ_ROLES.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 50;
  const from = (page - 1) * limit;

  // Subscribers and Partners can only see published content
  const isRestrictedRole = ["Subscriber", "Partner"].includes(role);
  const statusParam = isRestrictedRole ? "published" : searchParams.get("status");
  const type = searchParams.get("publication_type");

  const admin = createAdminClient();
  let query = admin
    .from("publications")
    .select("id, title, publication_type, slug, abstract, status, author_json, published_at", { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, from + limit - 1);

  if (statusParam) query = query.eq("status", statusParam);
  if (type) query = query.eq("publication_type", type);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ publications: data, total: count, page });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getAuth(user.id);
  if (role !== "Admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, publication_type, slug, abstract, status, author_json, body_markdown } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("publications")
    .insert({
      title: title.trim(),
      publication_type: publication_type || null,
      slug: slug?.trim() || null,
      abstract: abstract?.trim() || null,
      status: status ?? "draft",
      author_json: author_json ?? null,
      body_markdown: body_markdown?.trim() || null,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    userId: user.id,
    actorEmail: email ?? undefined,
    action: "publication.create",
    entityType: "publication",
    entityId: data.id,
    details: { title, status },
  });

  return NextResponse.json({ publication: data });
}
