// assets/js/form.js

// 1) Set your webhook endpoint here
const WEBHOOK_URL = "https://example.com/your-webhook-endpoint";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ai-test-call-form");
  const voiceButtons = document.querySelectorAll(".voice-option");
  const voiceInput = document.getElementById("voiceInput");
  const consentCheckbox = document.getElementById("consentCheckbox");
  const callButton = document.getElementById("callButton");
  const statusEl = document.getElementById("formStatus");
  const countryCodeEl = document.getElementById("countryCode");
  const phoneEl = document.getElementById("phone");

  // Voice toggle
  voiceButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      voiceButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      voiceInput.value = btn.dataset.voice || "male";
    });
  });

  // Enable/disable button based on consent
  function updateButtonState() {
    if (consentCheckbox.checked) {
      callButton.disabled = false;
      callButton.classList.add("enabled");
    } else {
      callButton.disabled = true;
      callButton.classList.remove("enabled");
    }
  }
  consentCheckbox.addEventListener("change", updateButtonState);
  updateButtonState();

  // Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    callButton.disabled = true;

    const payload = {
      countryCode: countryCodeEl.value,
      phone: phoneEl.value.trim(),
      voice: voiceInput.value,
      consent: consentCheckbox.checked,
      source: "dealvox-ai-test-call-form"
    };

    if (!payload.phone) {
      statusEl.textContent = "Please enter a valid phone number.";
      updateButtonState();
      return;
    }
    if (!payload.consent) {
      statusEl.textContent = "Please confirm consent to receive a test call.";
      updateButtonState();
      return;
    }

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      statusEl.textContent = "✅ Request received. Your AI test call will start shortly.";
      statusEl.style.color = "#22c55e";
      form.reset();
      voiceButtons.forEach((b) => b.classList.remove("active"));
      voiceButtons[0].classList.add("active");
      voiceInput.value = "male";
      updateButtonState();
    } catch (err) {
      console.error(err);
      statusEl.textContent = "⚠️ Something went wrong. Please try again in a moment.";
      statusEl.style.color = "#f97316";
      updateButtonState();
    }
  });
});

