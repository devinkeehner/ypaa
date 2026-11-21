"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";

type Point = { x: number; y: number };
export type DropTarget = { roomID: string; time: string };
type Drag = {
  sessionID: string;
  pointerID: number;
  element: HTMLButtonElement;
  origin: Point;
  pointer: Point;
  started: boolean;
};

const edgeSize = 72;
const maxScrollPerFrame = 22;

function edgeSpeed(value: number, min: number, max: number) {
  if (value < min - 12 || value > max + 12) return 0;
  const inset = Math.min(edgeSize, (max - min) / 3);
  if (inset <= 0) return 0;
  const proximity = Math.min(1, Math.max(-1, (value - max + inset) / inset, (min + inset - value) / inset));
  if (proximity <= 0) return 0;
  return (value < min + inset ? -1 : 1) * Math.ceil(maxScrollPerFrame * proximity ** 2);
}

export function useProgramBoardDrag(scrollRef: RefObject<HTMLDivElement | null>, times: readonly string[], slotHeight: number) {
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [target, setTarget] = useState<DropTarget | null>(null);
  const drag = useRef<Drag | null>(null);
  const targetRef = useRef<DropTarget | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const suppressClick = useRef(false);

  const hitTest = useCallback((point: Point) => {
    const track = document.elementFromPoint(point.x, point.y)?.closest<HTMLElement>("[data-program-room-id]");
    const roomID = track?.dataset.programRoomId;
    if (!roomID || !track || !scrollRef.current?.contains(track)) return null;
    const slot = Math.floor((point.y - track.getBoundingClientRect().top) / slotHeight);
    return times[slot] ? { roomID, time: times[slot] } : null;
  }, [scrollRef, slotHeight, times]);

  const paint = useCallback(function onFrame() {
    frame.current = 0;
    const active = drag.current;
    const scroller = scrollRef.current;
    if (!active?.started || !scroller) return;
    const { pointer } = active;
    const rect = scroller.getBoundingClientRect();
    const corner = scroller.querySelector(".program-board-corner")?.getBoundingClientRect();
    const left = scroller.scrollLeft;
    const top = scroller.scrollTop;
    const withinX = pointer.x >= rect.left - 12 && pointer.x <= rect.right + 12;
    const withinY = pointer.y >= rect.top - 12 && pointer.y <= rect.bottom + 12;
    if (withinY) scroller.scrollLeft += edgeSpeed(pointer.x, corner?.right ?? rect.left, rect.left + scroller.clientWidth);
    if (withinX) scroller.scrollTop += edgeSpeed(pointer.y, corner?.bottom ?? rect.top, rect.top + scroller.clientHeight);

    if (ghostRef.current) {
      const width = ghostRef.current.offsetWidth;
      const height = ghostRef.current.offsetHeight;
      const x = pointer.x + width + 20 > window.innerWidth ? Math.max(0, pointer.x - width - 16) : pointer.x + 16;
      const y = pointer.y + height + 20 > window.innerHeight ? Math.max(0, pointer.y - height - 16) : pointer.y + 16;
      ghostRef.current.style.transform = `translate3d(${x}px,${y}px,0)`;
    }
    const next = hitTest(pointer);
    if (next?.roomID !== targetRef.current?.roomID || next?.time !== targetRef.current?.time) {
      targetRef.current = next;
      setTarget(next);
    }
    if (scroller.scrollLeft !== left || scroller.scrollTop !== top) frame.current = requestAnimationFrame(onFrame);
  }, [hitTest, scrollRef]);

  const queueFrame = useCallback(() => {
    if (drag.current?.started && !frame.current) frame.current = requestAnimationFrame(paint);
  }, [paint]);

  const cancel = useCallback(() => {
    const active = drag.current;
    if (!active) return;
    drag.current = null;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (active.element.hasPointerCapture(active.pointerID)) active.element.releasePointerCapture(active.pointerID);
    if (!active.started) return;
    targetRef.current = null;
    setTarget(null);
    setSessionID(null);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || !drag.current?.started) return;
      event.preventDefault();
      event.stopPropagation();
      cancel();
    }
    const cancelOnBlur = () => cancel();
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("blur", cancelOnBlur);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("blur", cancelOnBlur);
      cancel();
    };
  }, [cancel]);

  function start(event: PointerEvent<HTMLButtonElement>, id: string, canMove: boolean) {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;
    suppressClick.current = false;
    if (!canMove || (event.pointerType === "touch" && !(event.target as Element).closest("[data-move-grip]"))) return;
    const pointer = { x: event.clientX, y: event.clientY };
    drag.current = { sessionID: id, pointerID: event.pointerId, element: event.currentTarget, origin: pointer, pointer, started: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerID !== event.pointerId) return;
    active.pointer = { x: event.clientX, y: event.clientY };
    if (!active.started) {
      if (Math.hypot(active.pointer.x - active.origin.x, active.pointer.y - active.origin.y) < 6) return;
      active.started = true;
      suppressClick.current = true;
      setSessionID(active.sessionID);
    }
    queueFrame();
  }

  function finish(event: PointerEvent<HTMLButtonElement>) {
    const active = drag.current;
    if (!active || active.pointerID !== event.pointerId) return null;
    const destination = active.started ? hitTest({ x: event.clientX, y: event.clientY }) : null;
    cancel();
    return destination ? { sessionID: active.sessionID, ...destination } : null;
  }

  return { sessionID, target, ghostRef, suppressClick, start, move, finish, cancel, queueFrame };
}
