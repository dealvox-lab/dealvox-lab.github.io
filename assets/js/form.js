// assets/js/form.js

document.addEventListener("DOMContentLoaded", () => {
  /* 1. Voice toggle behavior (shared) */
  document.querySelectorAll(".voice-toggle").forEach(toggle => {
    const buttons = toggle.querySelectorAll(".voice-option");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });

  /* 2. Attach logic to every hero-style form card */
  const cards = document.querySelectorAll(".hero-form-card");

  cards.forEach(card => {
    const callButton = card.querySelector(".call-button");
    const consentCheckbox = card.querySelector('input[name="consent"]');
    const phoneInput = card.querySelector('input[name="phone"]');
    const countrySelect = card.querySelector('select[name="country_code"]');
    const voiceButtons = card.querySelectorAll(".voice-option");

    if (!callButton) return; // nothing to do for this card

    // Keep button disabled until consent is checked (if consent exists)
    if (consentCheckbox) {
      callButton.disabled = !consentCheckbox.checked;
      consentCheckbox.addEventListener("change", () => {
        callButton.disabled = !consentCheckbox.checked;
      });
    }

    // Handle click as "submit"
    callButton.addEventListener("click", async (e) => {
      e.preventDefault();

      const activeVoiceBtn = card.querySelector(".voice-option.active");
      const voice =
        (activeVoiceBtn && (activeVoiceBtn.dataset.voice || activeVoiceBtn.textContent.trim())) ||
        "male";

      const code = countrySelect ? countrySelect.value : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";

      if (!phone) {
        alert("Please enter your phone number.");
        return;
      }

      if (consentCheckbox && !consentCheckbox.checked) {
        alert("Please confirm consent to receive the AI test call.");
        return;
      }

      const payload = {
        phone: `${code} ${phone}`.trim(),
        voice,
        consent: consentCheckbox ? !!consentCheckbox.checked : true,
        source: card.dataset.formOrigin || "hero"
      };

      // TODO: plug in your real webhook URL here
      // const webhookUrl = "https://your-webhook-endpoint";
      try {
        // Example (commented out):
        // await fetch(webhookUrl, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload),
        // });

        console.log("Form submitted (demo):", payload);
        alert("Your AI test call is on the way!");

        // Reset fields
        if (phoneInput) phoneInput.value = "";
        if (consentCheckbox) {
          consentCheckbox.checked = false;
          callButton.disabled = true;
        }

        // Reset toggle to first option if present
        if (voiceButtons.length) {
          voiceButtons.forEach(b => b.classList.remove("active"));
          voiceButtons[0].classList.add("active");
        }
      } catch (err) {
        console.error("Form submission failed:", err);
        alert("Oops. Something went wrong. Please try again.");
      }
    });
  });
});
