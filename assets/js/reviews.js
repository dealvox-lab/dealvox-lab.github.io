// assets/js/reviews.js

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".reviews-track");
  const slides = Array.from(document.querySelectorAll(".reviews-slide"));
  const dots = Array.from(document.querySelectorAll(".reviews-dot"));
  const arrows = Array.from(document.querySelectorAll(".reviews-arrow"));

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;

  function goToSlide(index) {
    current = (index + total) % total; // wrap
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  // Arrow navigation
  arrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const dir = arrow.dataset.direction === "next" ? 1 : -1;
      goToSlide(current + dir);
    });
  });
});
