import { NextRequest } from "next/server";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api";

/**
 * Auth endpoints — replace with your chosen auth library.
 *
 * Recommended options:
 *   - Auth.js (NextAuth): https://authjs.dev
 *   - Clerk: https://clerk.com
 *   - Lucia: https://lucia-auth.com
 *
 * The routes below are stubs to show the pattern.
 */

export async function GET(request: NextRequest) {
  const sessionToken =
    request.cookies.get("session")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  if (!sessionToken) {
    return unauthorizedResponse();
  }

  return successResponse({
    authenticated: true,
    message: "Replace this with your actual session lookup",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    return successResponse({
      message: "Auth stub — connect your auth library here",
      email,
    });
  } catch {
    return errorResponse("Invalid request body", 400);
  }
}

export async function DELETE() {
  const response = successResponse({ message: "Logged out" });
  response.headers.set(
    "Set-Cookie",
    "session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );
  return response;
}
