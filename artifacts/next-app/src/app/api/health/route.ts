import { successResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  return successResponse({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
  });
}
