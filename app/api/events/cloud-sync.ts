import type { EventRoom } from "@/lib/event-store";

// Master Cloud Index Object ID hosted on api.restful-api.dev
const MASTER_INDEX_ID = "ff808181a09d98f701a0bb5515884a2b";
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${MASTER_INDEX_ID}`;

declare global {
  // eslint-disable-next-line no-var
  var eventRoomsMap: Map<string, EventRoom> | undefined;
}

if (!globalThis.eventRoomsMap) {
  globalThis.eventRoomsMap = new Map<string, EventRoom>();
}

const memoryMap = globalThis.eventRoomsMap;

interface MasterIndexData {
  name: string;
  data: {
    rooms?: Record<string, EventRoom>;
  };
}

export async function getCloudRoom(code: string): Promise<EventRoom | null> {
  const upper = code.toUpperCase().trim();

  try {
    const res = await fetch(CLOUD_API_URL, { cache: "no-store" });
    if (res.ok) {
      const json: MasterIndexData = await res.json();
      const rooms = json.data?.rooms || {};
      const room = rooms[upper];
      if (room) {
        memoryMap.set(upper, room);
        return room;
      }
    }
  } catch {
    // network fallback to memory map
  }

  return memoryMap.get(upper) ?? null;
}

export async function saveCloudRoom(room: EventRoom): Promise<EventRoom> {
  const upper = room.code.toUpperCase().trim();
  memoryMap.set(upper, room);

  try {
    // 1. Fetch existing master index to preserve other active rooms
    const getRes = await fetch(CLOUD_API_URL, { cache: "no-store" });
    let existingRooms: Record<string, EventRoom> = {};

    if (getRes.ok) {
      const json: MasterIndexData = await getRes.json();
      existingRooms = json.data?.rooms || {};
    }

    // 2. Insert/update the room entry
    existingRooms[upper] = room;

    // 3. Put updated master index back to cloud
    await fetch(CLOUD_API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "PROMPT_LENS_MASTER_INDEX",
        data: { rooms: existingRooms },
      }),
    });
  } catch {
    // network error fallback
  }

  return room;
}
