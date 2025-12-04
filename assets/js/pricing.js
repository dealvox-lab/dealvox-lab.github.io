// assets/js/pricing.js
// ---------------------------------------------
// Dealvox Pricing logic
// - Minutes sliders
// - Monthly / Yearly toggle
// - Dynamic Stripe links for each tier
// - Correct visual positions for uneven marks
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
          link: "https://buy.stripe.com/test_7sY4gz7Lw8PLfkG1owfYY04"
        },
        300: {
          price: 3729,
          link: "https://buy.stripe.com/test_4gM14n5Dofe9fkG9V2fYY05"
        },
        400: {
          price: 4829,
          link: "https://buy.stripe.com/test_dRm28r0j4gida0mc3afYY06"
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
          link: "https://buy.stripe.com/test_3cIbJ13vg6HD0pM7MUfYY0d"
        },
        1500: {
          price: 11990,
          link: "https://buy.stripe.com/test_dRmaEX9TEea51tQ7MUfYY0e"
        },
        2000: {
          price: 15990,
          link: "https://buy.stripe.com/test_14A8wP0j41nj6Oa7MUfYY0f"
        },
        3000: {
          price: 21490,
          link: "https://buy.stripe.com/test_28E6oH4zkfe9a0m6IQfYY0g"
        },
        5000: {
          price: 36990,
          link: "https://buy.stripe.com/test_6oU4gzc1M2rn3BY7MUfYY0h"
        }
      }
    }
    // Enterprise is handled via "Contact Sales" – no direct Stripe links here
  };

  document.addEventListener("DOMContentLoaded", initPricing);

  function initPricing() {
    const billingToggle = document.getElementById("billingToggle");
    const cards = document.querySelectorAll(".pricing-card[data-plan]");
    let billingMode = billingToggle && billingToggle.checked ? "yearly" : "monthly";

    function getBillingMode() {
      return billingToggle && billingToggle.checked ? "yearly" : "monthly";
    }

    // Position labels under the slider according to their real numeric value
    function layoutMinutesMarks(card) {
      const slider = card.querySelector(".minutes-slider");
      const marks = card.querySelectorAll(".minutes-marks span[data-value]");
      if (!slider || !marks.length) return;

      const min = Number(slider.min || 0);
      const max = Number(slider.max || 100);
      const range = max - min || 1;

      marks.forEach((mark) => {
        const value = Number(mark.dataset.value);
        const pct = ((value - min) / range) * 100;
        mark.style.left = pct + "%";
      });
    }

    function updateMinutesMarks(card, currentMinutes) {
      const marks = card.querySelectorAll(".minutes-marks span[data-value]");
      marks.forEach((mark) => {
        const value = parseInt(mark.dataset.value, 10);
        if (value === currentMinutes) {
          mark.classList.add("active");
        } else {
          mark.classList.remove("active");
        }
      });
    }

    function updateCardPricing(card) {
      const plan = card.dataset.plan; // starter | growth | enterprise
      if (!PRICING_CONFIG[plan]) return; // skip enterprise

      const slider = card.querySelector(".minutes-slider");
      const minutesDisplayEl = card.querySelector(".minutes-display");
      const priceTagEl = card.querySelector(".price-tag");
      const buttonEl = card.querySelector(".pricing-btn");

      if (!slider || !priceTagEl || !buttonEl) return;

      const minutes = parseInt(slider.value, 10);
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

      // Update button click → Stripe link
      buttonEl.onclick = function () {
        window.open(tier.link, "_blank");
      };

      updateMinutesMarks(card, minutes);
    }

    function attachSliderLogic(card) {
      const slider = card.querySelector(".minutes-slider");
      if (!slider) return;

      // For Growth, snap to the nearest tier from data-tiers
      const tiersAttr = slider.dataset.tiers;
      let tiers = null;
      if (tiersAttr) {
        tiers = tiersAttr.split(",").map((t) => parseInt(t.trim(), 10));
      }

      const snapToTier = () => {
        if (tiers && tiers.length > 0) {
          let raw = parseInt(slider.value, 10);
          let closest = tiers[0];
          let minDiff = Math.abs(raw - closest);

          for (const t of tiers) {
            const diff = Math.abs(raw - t);
            if (diff < minDiff) {
              minDiff = diff;
              closest = t;
            }
          }
          slider.value = closest;
        }

        updateCardPricing(card);
      };

      // On drag / change
      slider.addEventListener("input", snapToTier);
      slider.addEventListener("change", snapToTier);

      // Initial sync
      snapToTier();
    }

    // Initialize all cards
    cards.forEach((card) => {
      layoutMinutesMarks(card); // place numeric labels correctly
      attachSliderLogic(card);  // hook slider + pricing logic
    });

    // Billing toggle (Monthly / Yearly)
    if (billingToggle) {
      billingToggle.addEventListener("change", () => {
        billingMode = getBillingMode();
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
