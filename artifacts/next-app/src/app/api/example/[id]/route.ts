import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/lib/api";

const items: { id: number; name: string; createdAt: string }[] = [];

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const item = items.find((i) => i.id === parseInt(id));
  if (!item) return notFoundResponse("Item");
  return successResponse(item);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = items.findIndex((i) => i.id === parseInt(id));
    if (index === -1) return notFoundResponse("Item");

    items[index] = { ...items[index], ...body };
    return successResponse(items[index]);
  } catch {
    return errorResponse("Failed to update item");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const index = items.findIndex((i) => i.id === parseInt(id));
  if (index === -1) return notFoundResponse("Item");

  items.splice(index, 1);
  return successResponse({ message: "Deleted successfully" });
}
