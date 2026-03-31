import { createAdminClient } from "@/lib/supabase/admin";

export type AuditAction =
  | "login"
  | "logout"
  | "user.create"
  | "user.update"
  | "user.delete"
  | "user.role_change"
  | "user.status_change"
  | "interview.create"
  | "interview.update"
  | "interview.delete"
  | "transcript.upload"
  | "transcript.delete"
  | "publication.create"
  | "publication.update"
  | "publication.delete"
  | "father_profile.create"
  | "father_profile.update"
  | "father_profile.delete"
  | "media.upload"
  | "media.delete"
  | "survey.received"
  | "assessment.create"
  | "export";

export interface AuditParams {
  userId?: string;
  actorEmail?: string;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

function isValidUUID(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function insertAuditLog(params: AuditParams): Promise<void> {
  try {
    const admin = createAdminClient();
    const detailsJson: Record<string, unknown> = { ...(params.details ?? {}) };
    if (params.actorEmail) detailsJson.actor_email = params.actorEmail;
    if (params.ipAddress) detailsJson.ip_address = params.ipAddress;

    await admin.from("audit_logs").insert({
      user_id: params.userId ?? null,
      action: params.action,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId && isValidUUID(params.entityId) ? params.entityId : null,
      details_json: Object.keys(detailsJson).length > 0 ? detailsJson : null,
    });
  } catch {
    // Audit logging should never break the main flow
  }
}
