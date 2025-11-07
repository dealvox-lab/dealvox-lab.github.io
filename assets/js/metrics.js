// assets/js/metrics.js

document.addEventListener("DOMContentLoaded", () => {
  const metricsSection = document.querySelector(".ai-metrics");
  const circles = document.querySelectorAll(".metric-circle");

  if (!metricsSection || circles.length === 0) return;

  let hasAnimated = false;

  const animate = () => {
    if (hasAnimated) return;
    hasAnimated = true;

    circles.forEach(circle => {
      circle.classList.add("animate");
    });
  };

  // Use IntersectionObserver to trigger once when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.35
    }
  );

  observer.observe(metricsSection);
});
