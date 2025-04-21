import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1 + 0.5,
      speed: Math.random() * 0.02 + 0.1,
      opacity: Math.random(),
      blur: Math.random() * 1.5,
    }));

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        ctx.beginPath();
        ctx.shadowBlur = star.blur;
        ctx.shadowColor = "#c49952";

        ctx.fillStyle = `rgba(196, 153, 82, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();

        star.y -= star.speed;

        star.opacity += (Math.random() - 0.5) * 0.05;
        star.opacity = Math.min(Math.max(star.opacity, 0.1), 1);

        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
          star.size = Math.random() * 1 + 0.5;
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-1]"
    />
  );
};
