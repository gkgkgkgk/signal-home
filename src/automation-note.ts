import { available, type Entity } from "./types";

/** The backend must provide an explicit future change time for this text. */
export function scheduledNote(
  entity?: Entity,
  now = Date.now(),
): string | undefined {
  if (!available(entity)) return;
  const next = Date.parse(String(entity.attributes.next_change_at || ""));
  if (!Number.isFinite(next) || next <= now) return;
  const value = entity.state.trim();
  return value && value !== "none" ? value : undefined;
}
