import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const bucket = searchParams.get("bucket") ?? "media";

  const admin = createAdminClient();

  // List all files in userId/ prefix
  const { data: files, error } = await admin.storage
    .from(bucket)
    .list(user.id, { sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    // Bucket may not exist yet — return empty list
    if (error.message.includes("not found") || error.message.includes("does not exist")) {
      return NextResponse.json({ files: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Generate signed URLs for each file
  const withUrls = await Promise.all(
    (files ?? []).filter((f) => f.name !== ".emptyFolderPlaceholder").map(async (file) => {
      const path = `${user.id}/${file.name}`;
      const { data: urlData } = await admin.storage
        .from(bucket)
        .createSignedUrl(path, 3600); // 1 hour
      return {
        name: file.name,
        path,
        size: file.metadata?.size ?? 0,
        mimeType: file.metadata?.mimetype ?? "",
        createdAt: file.created_at,
        url: urlData?.signedUrl ?? null,
      };
    })
  );

  return NextResponse.json({ files: withUrls });
}
