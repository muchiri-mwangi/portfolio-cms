"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CURSOR_EMOJI = "🐆";
const HOVER_EMOJI = "🐾";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 22, stiffness: 300, mass: 0.4 });
  const springY = useSpring(y, { damping: 22, stiffness: 300, mass: 0.4 });

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);

    function handleMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, input, textarea, select, [role='button']")));
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] select-none"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.span
        animate={{ scale: hovering ? 1.5 : 1, rotate: hovering ? -10 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="block text-2xl"
      >
        {hovering ? HOVER_EMOJI : CURSOR_EMOJI}
      </motion.span>
    </motion.div>
  );
}
