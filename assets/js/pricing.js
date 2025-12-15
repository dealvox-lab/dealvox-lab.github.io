// assets/js/pricing.js
// ---------------------------------------------
// Dealvox Pricing logic
// - Minutes sliders (discrete positions)
// - Monthly / Yearly toggle
// - Dynamic Stripe links for each tier
// ---------------------------------------------

(function () {
  "use strict";

  // Stripe links & prices by plan / billing period / minutes
  const PRICING_CONFIG = {
    starter: {
      monthly: {
        200: {
          price: 239,
          link: "https://buy.stripe.com/test_5kQ3cvc1M6HD5K62sAfYY00"
        },
        300: {
          price: 339,
          link: "https://buy.stripe.com/test_fZu6oHe9Ugidc8ud7efYY02"
        },
        400: {
          price: 439,
          link: "https://buy.stripe.com/test_bJe9AT5Do0jf2xU3wEfYY03"
        }
      },
      yearly: {
        200: {
          price: 2629,
          link: "https://buy.stripe.com/test_14A7sL6Hs4zv2xUgjqfYY0i"
        },
        300: {
          price: 3729,
          link: "https://buy.stripe.com/test_fZu14nfdYea51tQ3wEfYY0j"
        },
        400: {
          price: 4829,
          link: "https://buy.stripe.com/test_fZucN53vgfe91tQ4AIfYY0k"
        }
      }
    },
    growth: {
      monthly: {
        500: {
          price: 499,
          link: "https://buy.stripe.com/test_28E3cv2rcfe9a0maZ6fYY01"
        },
        1000: {
          price: 899,
          link: "https://buy.stripe.com/test_8x2eVd8PA7LHdcy5EMfYY07"
        },
        1500: {
          price: 1199,
          link: "https://buy.stripe.com/test_9B64gze9Ud61egCffmfYY08"
        },
        2000: {
          price: 1599,
          link: "https://buy.stripe.com/test_28E00jd5Qc1Xdcy8QYfYY09"
        },
        3000: {
          price: 2149,
          link: "https://buy.stripe.com/test_bJeaEX8PA8PLdcy8QYfYY0a"
        },
        5000: {
          price: 3699,
          link: "https://buy.stripe.com/test_7sYeVd7Lwgid1tQd7efYY0b"
        }
      },
      yearly: {
        500: {
          price: 4990,
          link: "https://buy.stripe.com/test_7sYcN59TE1njgoKebifYY0c"
        },
        1000: {
          price: 8990,
          link: "https://buy.stripe.com/test_28EeVd6Hs8PL5K6c3afYY0m"
        },
        1500: {
          price: 11990,
          link: "https://buy.stripe.com/test_fZu7sLgi24zv2xUaZ6fYY0n"
        },
        2000: {
          price: 15990,
          link: "https://buy.stripe.com/test_fZucN56Hsc1X7SeebifYY0o"
        },
        3000: {
          price: 21490,
          link: "https://buy.stripe.com/test_14AeVd0j4ea5dcyebifYY0p"
        },
        5000: {
          price: 36990,
          link: "https://buy.stripe.com/test_eVq8wP7Lw1njc8uaZ6fYY0q"
        }
      }
    }
    // Enterprise is handled via "Contact Sales" – no direct Stripe links here
  };

  document.addEventListener("DOMContentLoaded", initPricing);

  function initPricing() {
    const billingToggle = document.getElementById("billingToggle");
    const cards = document.querySelectorAll(".pricing-card[data-plan]");

    function getBillingMode() {
      return billingToggle && billingToggle.checked ? "yearly" : "monthly";
    }

    function getTiersForCard(card, slider) {
      // If data-tiers is present, use it (Growth)
      const tiersAttr = slider.dataset.tiers;
      if (tiersAttr) {
        return tiersAttr.split(",").map((t) => parseInt(t.trim(), 10));
      }

      // Otherwise derive tiers from min/max/step (Starter)
      const min = Number(slider.min || 0);
      const max = Number(slider.max || 0);
      const step = Number(slider.step || 1);
      const arr = [];
      for (let v = min; v <= max; v += step) {
        arr.push(v);
      }
      return arr;
    }

    function updateMinutesMarks(card, minutes) {
      const marks = card.querySelectorAll(".minutes-marks span[data-value]");
      marks.forEach((mark) => {
        const value = parseInt(mark.dataset.value, 10);
        if (value === minutes) {
          mark.classList.add("active");
        } else {
          mark.classList.remove("active");
        }
      });
    }

    function updateCardPricing(card) {
      const plan = card.dataset.plan;
      if (!PRICING_CONFIG[plan]) return; // skip enterprise

      const slider = card.querySelector(".minutes-slider");
      const minutesDisplayEl = card.querySelector(".minutes-display");
      const priceTagEl = card.querySelector(".price-tag");
      const buttonEl = card.querySelector(".pricing-btn");
      const rateEl = card.querySelector(".effective-rate");

      if (!slider || !priceTagEl || !buttonEl) return;

      const tiers = slider._tiers;
      if (!tiers || !tiers.length) return;

      const index = parseInt(slider.value, 10);
      const minutes = tiers[index];
      const mode = getBillingMode();
      const planConfig = PRICING_CONFIG[plan][mode];
      if (!planConfig) return;

      const tier = planConfig[minutes];
      if (!tier) return;

      // Update minutes text
      if (minutesDisplayEl) {
        minutesDisplayEl.textContent = `${minutes} minutes`;
      }

      // Update price
      const periodLabel = mode === "monthly" ? "mo" : "yr";
      const formattedPrice = tier.price.toLocaleString("en-US", {
        maximumFractionDigits: 0
      });
      priceTagEl.innerHTML = `$${formattedPrice}<span>/${periodLabel}</span>`;

       // ✅ Effective rate (yearly normalized to /mo)
  if (rateEl && minutes > 0) {
    const periodPrice = mode === "yearly" ? (tier.price / 12) : tier.price;
    const perMin = periodPrice / minutes;
    rateEl.textContent = `≈ $${perMin.toFixed(2)} / min`;
  }

      // Update button click → Stripe link
      buttonEl.onclick = function () {
        window.open(tier.link, "_blank");
      };

      updateMinutesMarks(card, minutes);
    }

    function attachSliderLogic(card) {
      const slider = card.querySelector(".minutes-slider");
      if (!slider) return;

      // Build tiers and convert slider to 0..n-1 discrete positions
      const tiers = getTiersForCard(card, slider);
      slider._tiers = tiers;

      slider.min = 0;
      slider.max = tiers.length - 1;
      slider.step = 1;

      // Initial value: index 0 (first tier)
      if (slider.value === "" || slider.value === undefined) {
        slider.value = 0;
      } else {
        // Clamp existing value into range
        let idx = parseInt(slider.value, 10);
        if (isNaN(idx) || idx < 0) idx = 0;
        if (idx > tiers.length - 1) idx = tiers.length - 1;
        slider.value = idx;
      }

      const onChange = () => updateCardPricing(card);

      slider.addEventListener("input", onChange);
      slider.addEventListener("change", onChange);

      // Initial sync
      updateCardPricing(card);
    }

    // Initialize all cards
    cards.forEach((card) => {
      attachSliderLogic(card);
    });

    // Billing toggle (Monthly / Yearly)
    if (billingToggle) {
      billingToggle.addEventListener("change", () => {
        cards.forEach((card) => updateCardPricing(card));
      });
    }

    // OPTIONAL: Pay-as-you-go button link
    // const paygBtn = document.querySelector(".payg-btn");
    // if (paygBtn) {
    //   paygBtn.onclick = () =>
    //     window.open("https://your-payg-stripe-link-here", "_blank");
    // }
  }
})();
