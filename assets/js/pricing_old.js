// assets/js/pricing.js

document.addEventListener("DOMContentLoaded", () => {
  const billingToggle = document.getElementById("billingToggle");
  const sliders = document.querySelectorAll(".minutes-slider");

  if (!billingToggle || sliders.length === 0) return;

  // Pricing data from sheet
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
    // enterprise & payg: static markup
  };

  function animateChange(el) {
    if (!el) return;
    el.classList.remove("bump");
    void el.offsetWidth; // reflow
    el.classList.add("bump");
  }

  function snapToTiers(slider) {
    const tiersAttr = slider.dataset.tiers;
    if (!tiersAttr) return parseInt(slider.value, 10);

    const tiers = tiersAttr.split(",").map(v => parseInt(v.trim(), 10)).filter(Boolean);
    if (!tiers.length) return parseInt(slider.value, 10);

    const current = parseInt(slider.value, 10);
    let closest = tiers[0];
    let minDiff = Math.abs(current - closest);

    tiers.forEach(v => {
      const diff = Math.abs(current - v);
      if (diff < minDiff) {
        minDiff = diff;
        closest = v;
      }
    });

    slider.value = closest;
    return closest;
  }

  function updatePrices() {
    const yearly = billingToggle.checked;

    sliders.forEach(slider => {
      const card = slider.closest(".pricing-card");
      if (!card) return;

      const plan = card.dataset.plan;
      const priceTag = card.querySelector(".price-tag");
      const display = card.querySelector(".minutes-display");
      const rateEl = card.querySelector(".effective-rate");
      const marks = card.querySelectorAll(".minutes-marks span");

      let minutes = parseInt(slider.value, 10);
      // Snap growth (and any future tiered sliders) to defined tiers
      minutes = snapToTiers(slider);

      const planData = pricingData[plan];
      if (!planData) return;

      const prices = yearly ? planData.yearly : planData.monthly;
      const basePrice = prices[minutes];

      if (typeof basePrice === "number" && priceTag) {
        const per = yearly ? "/yr" : "/mo";
        priceTag.innerHTML = `$${basePrice.toLocaleString()}<span>${per}</span>`;
        animateChange(priceTag);

        // Effective price per minute (monthly or yearly/12)
        if (rateEl) {
          const periodPrice = yearly ? basePrice / 12 : basePrice;
          const perMin = periodPrice / minutes;
          rateEl.textContent = `≈ $${perMin.toFixed(2)} / min`;
          animateChange(rateEl);
        }
      }

      if (display) {
        display.textContent = `${minutes.toLocaleString()} minutes`;
        animateChange(display);
      }

      // Highlight active minute mark
      if (marks && marks.length) {
        marks.forEach(mark => {
          const val = parseInt(mark.dataset.value, 10);
          mark.classList.toggle("active", val === minutes);
        });
      }
    });
  }

  billingToggle.addEventListener("change", updatePrices);

  sliders.forEach(slider => {
    slider.addEventListener("input", () => {
      updatePrices();
    });
  });

  // Initial render
  updatePrices();
});
