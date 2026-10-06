import type { ProgramSession } from "../components/site/program-types";
type ResizeEdge = "start" | "end";
type ResizeRange = { startAt: string; endAt: string };
export type ResizePlan = { changes: Map<string, ResizeRange>; error?: string };
function dateKey(value: string) { return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value)); }
export function clampResizeDelta(session: ProgramSession, edge: ResizeEdge, deltaSlots: number) {
    const slotMs = 30 * 60_000;
    const start = new Date(session.startAt).getTime();
    const end = new Date(session.endAt).getTime();
    const midnight = Date.parse(`${dateKey(session.startAt)}T00:00:00-05:00`);
    const minStart = midnight + 8 * 60 * 60_000;
    const maxEnd = midnight + 24 * 60 * 60_000;
    const minDelta = edge === "start"
      ? Math.ceil((minStart - start) / slotMs)
      : Math.ceil((start + slotMs - end) / slotMs);
    const maxDelta = edge === "start"
      ? Math.floor((end - slotMs - start) / slotMs)
      : Math.floor((maxEnd - end) / slotMs);
    return Math.max(minDelta, Math.min(maxDelta, deltaSlots));
  }

export function planResize(sessions: ProgramSession[], session: ProgramSession, edge: ResizeEdge, requestedDelta: number): ResizePlan {
    const slotMs = 30 * 60_000;
    const deltaSlots = clampResizeDelta(session, edge, requestedDelta);
    const oldStart = new Date(session.startAt).getTime();
    const oldEnd = new Date(session.endAt).getTime();
    const deltaMs = deltaSlots * slotMs;
    const nextStart = oldStart + (edge === "start" ? deltaMs : 0);
    const nextEnd = oldEnd + (edge === "end" ? deltaMs : 0);
    const changes = new Map<string, ResizeRange>([[String(session.id), { startAt: new Date(nextStart).toISOString(), endAt: new Date(nextEnd).toISOString() }]]);
    const extendsLater = edge === "end" && deltaSlots > 0;
    const extendsEarlier = edge === "start" && deltaSlots < 0;
    const neighbors = sessions
      .filter((candidate) => String(candidate.id) !== String(session.id) && String(candidate.room.id) === String(session.room.id))
      .map((candidate) => ({ session: candidate, start: new Date(candidate.startAt).getTime(), end: new Date(candidate.endAt).getTime() }));

    if (extendsLater) {
      let boundary = nextEnd;
      for (const neighbor of neighbors.filter(({ start, end }) => start >= oldEnd && end > oldEnd).sort((a, b) => a.start - b.start)) {
        if (neighbor.start >= boundary) break;
        const overlapMs = boundary - neighbor.start;
        const durationMs = neighbor.end - neighbor.start;
        const pushWholeBlock = durationMs - overlapMs <= slotMs;
        if (!pushWholeBlock) {
          changes.set(String(neighbor.session.id), { startAt: new Date(boundary).toISOString(), endAt: neighbor.session.endAt });
          break;
        }
        const shiftMs = boundary - neighbor.start;
        const movedStart = boundary;
        const movedEnd = neighbor.end + shiftMs;
        changes.set(String(neighbor.session.id), { startAt: new Date(movedStart).toISOString(), endAt: new Date(movedEnd).toISOString() });
        boundary = movedEnd;
      }
    } else if (extendsEarlier) {
      let boundary = nextStart;
      for (const neighbor of neighbors.filter(({ end }) => end <= oldStart).sort((a, b) => b.end - a.end)) {
        if (neighbor.end <= boundary) break;
        const overlapMs = neighbor.end - boundary;
        const durationMs = neighbor.end - neighbor.start;
        const pushWholeBlock = durationMs - overlapMs <= slotMs;
        if (!pushWholeBlock) {
          changes.set(String(neighbor.session.id), { startAt: neighbor.session.startAt, endAt: new Date(boundary).toISOString() });
          break;
        }
        const shiftMs = neighbor.end - boundary;
        const movedStart = neighbor.start - shiftMs;
        const movedEnd = boundary;
        changes.set(String(neighbor.session.id), { startAt: new Date(movedStart).toISOString(), endAt: new Date(movedEnd).toISOString() });
        boundary = movedStart;
      }
    }

    const midnight = Date.parse(`${dateKey(session.startAt)}T00:00:00-05:00`);
    const boardStart = midnight + 8 * 60 * 60_000;
    const boardEnd = midnight + 24 * 60 * 60_000;
    const touched = [...changes.keys()];
    for (const id of touched) {
      const range = changes.get(id);
      if (!range) continue;
      const start = new Date(range.startAt).getTime();
      const end = new Date(range.endAt).getTime();
      if (start < boardStart || end > boardEnd) return { changes, error: "Resize blocked: there is no more room in that direction." };
    }

    const finalRanges = neighbors.map(({ session: candidate, start, end }) => ({
      id: String(candidate.id),
      title: candidate.title,
      start: changes.has(String(candidate.id)) ? new Date(changes.get(String(candidate.id))!.startAt).getTime() : start,
      end: changes.has(String(candidate.id)) ? new Date(changes.get(String(candidate.id))!.endAt).getTime() : end,
    }));
    finalRanges.push({ id: String(session.id), title: session.title, start: nextStart, end: nextEnd });
    finalRanges.sort((a, b) => a.start - b.start);
    for (let index = 0; index < finalRanges.length; index += 1) {
      const previous = finalRanges[index];
      for (const current of finalRanges.slice(index + 1)) {
        if (current.start >= previous.end) break;
        if (touched.includes(current.id) || touched.includes(previous.id)) return { changes, error: `Resize blocked: “${current.title}” still overlaps “${previous.title}”.` };
      }
    }
    return { changes };
  }

