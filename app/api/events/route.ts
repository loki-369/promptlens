import { NextResponse } from "next/server";
import type { EventRoom, EventParticipant } from "@/lib/event-store";

// Use globalThis to persist room state across API route reloads in Node environment
declare global {
  // eslint-disable-next-line no-var
  var eventRoomsMap: Map<string, EventRoom> | undefined;
}

if (!globalThis.eventRoomsMap) {
  globalThis.eventRoomsMap = new Map<string, EventRoom>();
}

const roomsMap = globalThis.eventRoomsMap;

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.toUpperCase().trim();

  if (!code) {
    return NextResponse.json({ error: "Code parameter required" }, { status: 400 });
  }

  const room = roomsMap.get(code);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, hostName, challengeIds, timeLimitSeconds } = body;

    const code = generateRoomCode();
    const hostId = generateId();

    const hostParticipant: EventParticipant = {
      id: hostId,
      name: (hostName || "Host").trim(),
      avatarSeed: hostId,
      isHost: true,
      joinedAt: new Date().toISOString(),
    };

    const room: EventRoom = {
      id: generateId(),
      code,
      name: (name || "Prompt Competition").trim(),
      hostId,
      hostName: hostParticipant.name,
      status: "lobby",
      challengeIds: challengeIds || [],
      currentChallengeIndex: 0,
      timeLimitSeconds: timeLimitSeconds ?? 300,
      createdAt: new Date().toISOString(),
      participants: [hostParticipant],
      submissions: [],
    };

    roomsMap.set(code, room);

    return NextResponse.json({ room, hostParticipantId: hostId });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
