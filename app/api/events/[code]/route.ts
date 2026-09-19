import { NextResponse } from "next/server";
import type { EventParticipant, EventSubmission } from "@/lib/event-store";
import { getCloudRoom, saveCloudRoom } from "../cloud-sync";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase().trim();
  const room = await getCloudRoom(code);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase().trim();
  const room = await getCloudRoom(code);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "join") {
      const { name } = body;
      const cleanName = (name || "").trim();

      const existing = room.participants.find(
        (p) => p.name.toLowerCase().trim() === cleanName.toLowerCase()
      );

      if (existing) {
        return NextResponse.json({ participant: existing, room });
      }

      const newId = generateId();
      const newParticipant: EventParticipant = {
        id: newId,
        name: cleanName || `Player ${room.participants.length + 1}`,
        avatarSeed: newId,
        isHost: false,
        joinedAt: new Date().toISOString(),
      };

      room.participants.push(newParticipant);
      await saveCloudRoom(room);
      return NextResponse.json({ participant: newParticipant, room });
    }

    if (action === "start") {
      room.status = "active";
      room.currentChallengeIndex = 0;
      room.roundStartedAt = new Date().toISOString();
      await saveCloudRoom(room);
      return NextResponse.json(room);
    }

    if (action === "next") {
      if (room.currentChallengeIndex + 1 < room.challengeIds.length) {
        room.currentChallengeIndex += 1;
        room.roundStartedAt = new Date().toISOString();
      } else {
        room.status = "completed";
      }
      await saveCloudRoom(room);
      return NextResponse.json(room);
    }

    if (action === "end") {
      room.status = "completed";
      await saveCloudRoom(room);
      return NextResponse.json(room);
    }

    if (action === "submit") {
      const { participantId, participantName, challengeId, prompt, score, dimensions, xpEarned, hintsUsed } = body;

      const existingIdx = room.submissions.findIndex(
        (s) => s.participantId === participantId && s.challengeId === challengeId
      );

      const submission: EventSubmission = {
        id: existingIdx >= 0 ? room.submissions[existingIdx].id : generateId(),
        roomId: room.id,
        challengeId,
        participantId,
        participantName,
        prompt,
        score,
        dimensions,
        xpEarned,
        hintsUsed,
        submittedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        room.submissions[existingIdx] = submission;
      } else {
        room.submissions.push(submission);
      }

      await saveCloudRoom(room);
      return NextResponse.json({ submission, room });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Action processing failed" }, { status: 500 });
  }
}
