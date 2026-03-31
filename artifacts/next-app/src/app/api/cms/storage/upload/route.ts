import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_BUCKETS = ["media", "transcripts"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string ?? "media";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_BUCKETS.includes(bucket)) return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });

  const MAX_SIZE = 100 * 1024 * 1024; // 100MB
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "File exceeds 100MB limit" }, { status: 400 });

  const admin = createAdminClient();

  // Ensure the bucket exists
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === bucket);
  if (!exists) {
    const { error: createError } = await admin.storage.createBucket(bucket, { public: false });
    if (createError && !createError.message.includes("already exists")) {
      return NextResponse.json({ error: `Could not create bucket: ${createError.message}` }, { status: 500 });
    }
  }

  // Build a unique file path: userId/timestamp-filename
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${user.id}/${Date.now()}-${safeName}`;

  const bytes = await file.arrayBuffer();
  const { data, error } = await admin.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ path: data.path, bucket });
}
