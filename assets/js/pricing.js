// assets/js/pricing.js

document.addEventListener("DOMContentLoaded", () => {
  const billingToggle = document.getElementById("billingToggle");
  const sliders = document.querySelectorAll(".minutes-slider");

  function updatePrices() {
    const yearly = billingToggle.checked;

    sliders.forEach(slider => {
      const card = slider.closest(".pricing-card");
      const minutes = parseInt(slider.value, 10);
      const priceTag = card.querySelector(".price-tag");

      let basePrice;
      if (minutes === 200) basePrice = yearly ? 790 : 79;
      else if (minutes === 300) basePrice = yearly ? 1290 : 129;
      else basePrice = yearly ? 1990 : 199;

      const per = yearly ? "/yr" : "/mo";
      priceTag.innerHTML = `$${basePrice}<span>${per}</span>`;

      const display = card.querySelector(".minutes-display");
      display.textContent = `${minutes} minutes`;
    });
  }

  // Listeners
  billingToggle.addEventListener("change", updatePrices);
  sliders.forEach(slider => {
    slider.addEventListener("input", updatePrices);
  });

  updatePrices();
});
