/**
 * Example CRUD route handler — shows the pattern for all your API routes.
 *
 * Replace this file with your actual resource routes, e.g.:
 *   src/app/api/users/route.ts
 *   src/app/api/payments/route.ts
 *   src/app/api/surveys/route.ts
 *
 * Database usage (server-side only):
 *   import { db } from "@/lib/db";
 *   import { yourTable } from "@workspace/db/schema";
 *   const rows = await db.select().from(yourTable);
 */

import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  createdResponse,
  validationErrorResponse,
} from "@/lib/api";
import { getPaginationParams } from "@/types";

const items: { id: number; name: string; createdAt: string }[] = [];
let nextId = 1;

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize } = getPaginationParams(
      new URL(request.url).searchParams
    );

    const start = (page - 1) * pageSize;
    const paginated = items.slice(start, start + pageSize);

    return successResponse({
      items: paginated,
      total: items.length,
      page,
      pageSize,
    });
  } catch {
    return errorResponse("Failed to fetch items");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string") {
      return validationErrorResponse([{ field: "name", message: "Name is required" }]);
    }

    const item = { id: nextId++, name: body.name, createdAt: new Date().toISOString() };
    items.push(item);

    return createdResponse(item);
  } catch {
    return errorResponse("Failed to create item");
  }
}
