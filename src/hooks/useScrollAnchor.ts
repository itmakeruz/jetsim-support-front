import { useRef, useCallback, useEffect } from "react";

interface UseScrollAnchorOptions {
  /** Pastda deb hisoblash uchun threshold (px) */
  bottomThreshold?: number;
}

export function useScrollAnchor(options: UseScrollAnchorOptions = {}) {
  const { bottomThreshold = 100 } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);
  const lastScrollHeightRef = useRef(0);
  const isUserScrollingRef = useRef(false);

  // User pastda turganini tekshirish
  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= bottomThreshold;
  }, [bottomThreshold]);

  // Pastga scroll qilish
  const scrollToBottom = useCallback((instant = false) => {
    const container = containerRef.current;
    if (!container) return;

    if (instant) {
      container.scrollTop = container.scrollHeight;
    } else {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
    isAtBottomRef.current = true;
  }, []);

  // Scroll position'ni saqlash (rasm yuklanganda chaqiriladi)
  const preserveScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Agar user pastda bo'lsa, pastga scroll qilamiz
    if (isAtBottomRef.current) {
      container.scrollTop = container.scrollHeight;
      return;
    }

    // Agar user yuqorida bo'lsa, scroll position'ni saqlaymiz
    const currentScrollHeight = container.scrollHeight;
    const previousScrollHeight = lastScrollHeightRef.current;

    if (currentScrollHeight !== previousScrollHeight) {
      const heightDifference = currentScrollHeight - previousScrollHeight;
      container.scrollTop += heightDifference;
      lastScrollHeightRef.current = currentScrollHeight;
    }
  }, []);

  // Scroll event handler
  const handleScroll = useCallback(() => {
    if (isUserScrollingRef.current) {
      isAtBottomRef.current = checkIfAtBottom();
    }
    const container = containerRef.current;
    if (container) {
      lastScrollHeightRef.current = container.scrollHeight;
    }
  }, [checkIfAtBottom]);

  // User scroll qilishni boshladi
  const handleScrollStart = useCallback(() => {
    isUserScrollingRef.current = true;
  }, []);

  // User scroll qilishni tugatdi
  const handleScrollEnd = useCallback(() => {
    isUserScrollingRef.current = false;
  }, []);

  // ResizeObserver - content o'zgarganda scroll'ni to'g'rilash
  useEffect(() => {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return;

    lastScrollHeightRef.current = container.scrollHeight;

    const resizeObserver = new ResizeObserver(() => {
      preserveScrollPosition();
    });

    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
    };
  }, [preserveScrollPosition]);

  // Scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("mousedown", handleScrollStart);
    container.addEventListener("mouseup", handleScrollEnd);
    container.addEventListener("touchstart", handleScrollStart);
    container.addEventListener("touchend", handleScrollEnd);
    container.addEventListener("wheel", handleScrollStart, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("mousedown", handleScrollStart);
      container.removeEventListener("mouseup", handleScrollEnd);
      container.removeEventListener("touchstart", handleScrollStart);
      container.removeEventListener("touchend", handleScrollEnd);
      container.removeEventListener("wheel", handleScrollStart);
    };
  }, [handleScroll, handleScrollStart, handleScrollEnd]);

  return {
    containerRef,
    contentRef,
    scrollToBottom,
    preserveScrollPosition,
    isAtBottom: () => isAtBottomRef.current,
    setIsAtBottom: (value: boolean) => {
      isAtBottomRef.current = value;
    },
  };
}
