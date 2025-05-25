import React, { useEffect, useRef, useState } from "react";

const images = import.meta.glob("/src/assets/galaxies/*.jpg", { eager: true });
const imageList = Object.values(images).map((mod) => mod.default || mod);

const ROWS = 6;

const Row = ({ rowIndex, speed, width }) => {
  const rowRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const row = rowRef.current;
    let animationFrameId;

    const animate = () => {
      offsetRef.current -= speed;
      if (row) {
        if (Math.abs(offsetRef.current) >= width) offsetRef.current = 0;
        row.style.transform = `translateX(${offsetRef.current}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, width]);

  // Décalage pour chaque ligne
  const startIndex = (rowIndex * 5) % imageList.length;

  const shiftedImages = [
    ...imageList.slice(startIndex),
    ...imageList.slice(0, startIndex),
  ];

  const repeatedImages = [...shiftedImages, ...shiftedImages];

  return (
    <div
      ref={rowRef}
      className="flex"
      style={{
        width: width * 2,
        overflow: "hidden",
        marginBottom: "1px",
        height: 150,
      }}
    >
      {repeatedImages.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt="galaxy"
          draggable={false}
          className="object-cover"
          style={{
            width: 250,
            height: 250,
            userSelect: "none",
            pointerEvents: "none",
            borderRadius: 5,
            marginRight: 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default function BackgroundGrid() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const speeds = [0.33, 0.52, 0.7, 0.45, 0.25, 0.75];

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden bg-black"
      style={{ pointerEvents: "none", height: "100vh" }}

    >
      <div
        className="flex flex-col justify-center"
        style={{
          width: windowWidth,
          height: "100%",
        }}
      >
        {Array.from({ length: ROWS }).map((_, i) => (
          <Row
            key={i}
            rowIndex={i}
            speed={speeds[i % speeds.length]}
            width={windowWidth}
          />
        ))}
      </div>
    </div>
  );
}
