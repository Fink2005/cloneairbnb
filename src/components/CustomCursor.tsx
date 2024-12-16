// components/CustomCursor.tsx
"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    controls.start({
      x: mousePosition.x - 16, // Offset by half the cursor's size
      y: mousePosition.y - 16,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  }, [mousePosition, controls]);

  return (
    <motion.div
      className="cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "32px",
        height: "32px",
        backgroundColor: "#000",
        borderRadius: "50%",
        transformOrigin: "center",
        zIndex: 9999,
      }}
      animate={controls}
    />
  );
};

export default CustomCursor;
