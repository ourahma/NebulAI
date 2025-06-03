import { useEffect, useRef } from "react";

export default function AnimatedCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  let mouse = { x: 0, y: 0 };

  useEffect(() => {
    const updatePosition = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.current.style.left = mouse.x + "px";
      dot.current.style.top = mouse.y + "px";
    };

    const animate = () => {
      ring.current.style.transform = `translate(${mouse.x - 15}px, ${mouse.y - 15}px)`;
      requestAnimationFrame(animate);
    };

    const clickEffect = () => {
      ring.current.classList.add("clicked");
      setTimeout(() => ring.current.classList.remove("clicked"), 150);
    };

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("click", clickEffect);
    animate();

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("click", clickEffect);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot"></div>
      <div ref={ring} className="cursor-ring"></div>
    </>
  );
}
