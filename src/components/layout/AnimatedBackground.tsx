import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speed: Math.random() * 0.4 + 0.05,
      opacity: Math.random(),
    }));

    const fps = 30;
    let lastTime = 0;
    let animationId: number;

    const draw = (time: number) => {
      const delta = time - lastTime;
      if (delta < 1000 / fps) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(196, 153, 82, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
        ctx.fill();

        star.y -= star.speed;
        star.x += star.speed;

        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }
        if (star.x > width) {
          star.x = 0;
          star.y = Math.random() * height;
        }

        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.min(Math.max(star.opacity, 0.3), 1);
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        stars.forEach((star) => {
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        });
      }, 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
    />
  );
};
