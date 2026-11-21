import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

const minimumThumbWidth = 30;

export function ProgramBoardRoomScrollbar({ scrollRef, gridRef }: {
  scrollRef: RefObject<HTMLDivElement | null>;
  gridRef: RefObject<HTMLDivElement | null>;
}) {
  const [scroll, setScroll] = useState({ left: 0, limit: 0, visiblePercent: 100 });
  const drag = useRef<{ pointerId: number; origin: number; scrollPerPixel: number } | null>(null);

  useEffect(() => {
    const scroller = scrollRef.current;
    const grid = gridRef.current;
    if (!scroller || !grid) return;

    const sync = () => {
      const { clientWidth, scrollWidth, scrollLeft } = scroller;
      const limit = scrollWidth - clientWidth;
      const left = Math.min(limit, Math.max(0, Math.round(scrollLeft)));
      const visiblePercent = scrollWidth ? Math.round(100 * clientWidth / scrollWidth) : 100;
      setScroll(current => current.left === left && current.limit === limit && current.visiblePercent === visiblePercent
        ? current : { left, limit, visiblePercent });
    };

    const observer = new ResizeObserver(sync);
    observer.observe(scroller);
    observer.observe(grid);
    scroller.addEventListener("scroll", sync, { passive: true });
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", sync);
    };
  }, [scrollRef, gridRef]);

  if (scroll.limit <= 0) return null;
  const thumbPercent = Math.min(90, scroll.visiblePercent);

  function scrollTo(left: number) {
    const scroller = scrollRef.current;
    if (!scroller) return;
    scroller.scrollLeft = Math.min(scroll.limit, Math.max(0, Math.round(left)));
    const position = Math.round(scroller.scrollLeft);
    setScroll(current => current.left === position ? current : { ...current, left: position });
  }

  return (
    <label className="program-board-room-scrollbar">
      <span>Rooms</span>
      <input
        aria-label="Scroll rooms horizontally"
        aria-valuetext={`${Math.round(100 * scroll.left / scroll.limit)}% across rooms`}
        max={scroll.limit}
        min={0}
        onChange={event => scrollTo(event.currentTarget.valueAsNumber)}
        onKeyDown={event => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          scrollTo(scroll.left + (event.key === "ArrowLeft" ? -48 : 48));
        }}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          const input = event.currentTarget;
          const bounds = input.getBoundingClientRect();
          const thumbWidth = Math.max(minimumThumbWidth, bounds.width * thumbPercent / 100);
          const travel = bounds.width - thumbWidth;
          if (travel <= 0) return;
          event.preventDefault();
          input.focus({ preventScroll: true });
          input.setPointerCapture(event.pointerId);
          // Keep the grab point within the thumb when it covers most of the track.
          const thumbLeft = bounds.left + scroll.left / scroll.limit * travel;
          const grabbedAt = event.clientX - thumbLeft;
          const isOnThumb = grabbedAt >= 0 && grabbedAt <= thumbWidth;
          const origin = bounds.left + (isOnThumb ? grabbedAt : thumbWidth / 2);
          const scrollPerPixel = scroll.limit / travel;
          drag.current = { pointerId: event.pointerId, origin, scrollPerPixel };
          if (!isOnThumb) scrollTo((event.clientX - origin) * scrollPerPixel);
        }}
        onPointerMove={event => {
          const active = drag.current;
          if (active?.pointerId === event.pointerId) scrollTo((event.clientX - active.origin) * active.scrollPerPixel);
        }}
        onLostPointerCapture={event => {
          if (drag.current?.pointerId === event.pointerId) drag.current = null;
        }}
        style={{ "--room-scroll-thumb": `max(${minimumThumbWidth}px, ${thumbPercent}%)` } as CSSProperties}
        type="range"
        value={scroll.left}
      />
    </label>
  );
}
