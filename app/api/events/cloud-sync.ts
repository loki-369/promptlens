import type { EventRoom } from "@/lib/event-store";

const CLOUD_API_BASE = "https://api.restful-api.dev/objects";
const ROOM_NAME_PREFIX = "PROMPT_ROOM_";

declare global {
  // eslint-disable-next-line no-var
  var eventRoomsMap: Map<string, { cloudId?: string; room: EventRoom }> | undefined;
}

if (!globalThis.eventRoomsMap) {
  globalThis.eventRoomsMap = new Map<string, { cloudId?: string; room: EventRoom }>();
}

const memoryMap = globalThis.eventRoomsMap;

export async function getCloudRoom(code: string): Promise<EventRoom | null> {
  const upper = code.toUpperCase().trim();
  const cached = memoryMap.get(upper);

  // Check cloud storage if memory map missing or to re-sync
  try {
    const res = await fetch(CLOUD_API_BASE, { cache: "no-store" });
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) {
        const found = list.find(
          (item: any) =>
            item?.name === `${ROOM_NAME_PREFIX}${upper}` ||
            item?.data?.code === upper
        );

        if (found && found.data) {
          const room = found.data as EventRoom;
          memoryMap.set(upper, { cloudId: found.id, room });
          return room;
        }
      }
    }
  } catch {
    // network error fallback
  }

  return cached?.room ?? null;
}

export async function saveCloudRoom(room: EventRoom): Promise<EventRoom> {
  const upper = room.code.toUpperCase().trim();
  const cached = memoryMap.get(upper);
  const cloudId = cached?.cloudId;

  memoryMap.set(upper, { cloudId, room });

  try {
    if (cloudId) {
      // Update existing cloud object
      await fetch(`${CLOUD_API_BASE}/${cloudId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${ROOM_NAME_PREFIX}${upper}`, data: room }),
      });
    } else {
      // Create new cloud object
      const res = await fetch(CLOUD_API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${ROOM_NAME_PREFIX}${upper}`, data: room }),
      });
      if (res.ok) {
        const created = await res.json();
        memoryMap.set(upper, { cloudId: created.id, room });
      }
    }
  } catch {
    // network error fallback
  }

  return room;
}
