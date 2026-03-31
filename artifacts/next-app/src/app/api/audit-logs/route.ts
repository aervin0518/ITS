import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("user_roles(roles(name))")
    .eq("id", user.id)
    .single();

  const role = (profile as any)?.user_roles?.[0]?.roles?.name;
  const ALLOWED = ["Admin", "Program Admin", "Researcher"];
  if (!role || !ALLOWED.includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Non-admins can only query entity-specific logs
  const isAdmin = role === "Admin";

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));
  const action = searchParams.get("action");
  const from = (page - 1) * limit;

  let query = admin
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  const entityId = searchParams.get("entity_id");
  const entityType = searchParams.get("entity_type");

  // Non-admins must scope to a specific entity
  if (!isAdmin && !entityId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (action) query = query.eq("action", action);
  if (entityId) query = query.eq("entity_id", entityId);
  if (entityType) query = query.eq("entity_type", entityType);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ logs: data, total: count, page, limit });
}
