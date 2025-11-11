// assets/js/pricing.js

document.addEventListener("DOMContentLoaded", () => {
  const billingToggle = document.getElementById("billingToggle");
  const sliders = document.querySelectorAll(".minutes-slider");

  if (!billingToggle || sliders.length === 0) return;

  // Pricing table from your sheet
  const pricingData = {
    starter: {
      monthly: { 200: 239, 300: 339, 400: 439 },
      yearly:  { 200: 2629, 300: 3729, 400: 4829 }
    },
    growth: {
      monthly: {
        500: 499,
        1000: 899,
        1500: 1199,
        2000: 1599,
        3000: 2149,
        5000: 3699
      },
      yearly: {
        500: 4990,
        1000: 8990,
        1500: 11990,
        2000: 15990,
        3000: 21490,
        5000: 36990
      }
    }
    // Enterprise & Pay-as-you-go are static in markup
  };

  function animateChange(el) {
    if (!el) return;
    el.classList.remove("bump");
    // trigger reflow so animation restarts
    void el.offsetWidth;
    el.classList.add("bump");
  }

  function updatePrices() {
    const yearly = billingToggle.checked;

    sliders.forEach(slider => {
      const card = slider.closest(".pricing-card");
      if (!card) return;

      const plan = card.dataset.plan;
      const minutes = parseInt(slider.value, 10);
      const priceTag = card.querySelector(".price-tag");
      const display = card.querySelector(".minutes-display");
      const marks = card.querySelectorAll(".minutes-marks span");

      const planData = pricingData[plan];
      if (!planData) return;

      const prices = yearly ? planData.yearly : planData.monthly;
      const basePrice = prices[minutes];

      if (typeof basePrice === "number" && priceTag) {
        const per = yearly ? "/yr" : "/mo";
        priceTag.innerHTML = `$${basePrice.toLocaleString()}<span>${per}</span>`;
        animateChange(priceTag);
      }

      if (display) {
        display.textContent = `${minutes.toLocaleString()} minutes`;
        animateChange(display);
      }

      // Highlight active minute mark
      if (marks.length) {
        marks.forEach(mark => {
          const val = parseInt(mark.dataset.value, 10);
          mark.classList.toggle("active", val === minutes);
        });
      }
    });
  }

  billingToggle.addEventListener("change", updatePrices);
  sliders.forEach(slider => {
    slider.addEventListener("input", updatePrices);
  });

  updatePrices();
});
