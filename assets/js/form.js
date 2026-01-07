// assets/js/form.js

// 1) Set your webhook endpoint here
const WEBHOOK_URL = "https://dealvox-840984531750.us-east4.run.app/webhook/4757abb5-c3d0-42d3-a57d-50e9e71e4f6a";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ai-test-call-form");
  if (!form) return; // Script can load globally without breaking

  // Elements (scoped where possible)
  const voiceButtons = form.querySelectorAll(".voice-option");
  const voiceInput = document.getElementById("voiceInput");
  const consentCheckbox = document.getElementById("consentCheckbox");
  const callButton = document.getElementById("callButton");
  const statusEl = document.getElementById("formStatus");
  const countryCodeEl = document.getElementById("countryCode");
  const phoneEl = document.getElementById("phone");

  // Helper: update button state based on required fields
  function updateButtonState() {
    if (!callButton) return;

    const hasPhone = phoneEl && phoneEl.value.trim() !== "";
    const hasConsent = consentCheckbox ? consentCheckbox.checked : true;
    const hasVoice = voiceInput ? !!voiceInput.value : true;

    const enabled = hasPhone && hasConsent && hasVoice;

    callButton.disabled = !enabled;
    callButton.classList.toggle("enabled", enabled);
  }

  // Voice toggle (guard voiceInput presence)
  if (voiceButtons.length && voiceInput) {
    voiceButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        voiceButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        voiceInput.value = btn.dataset.voice || "male";
        updateButtonState();
      });
    });

    // Set default voice if not set
    if (!voiceInput.value && voiceButtons[0]) {
      voiceButtons[0].classList.add("active");
      voiceInput.value = voiceButtons[0].dataset.voice || "male";
    }
  }

  // Consent + phone listeners (guard against missing elements)
  if (consentCheckbox) {
    consentCheckbox.addEventListener("change", updateButtonState);
  }
  if (phoneEl) {
    phoneEl.addEventListener("input", updateButtonState);
  }

  // Initial state
  updateButtonState();

  // Submit handler (only if key elements exist)
  if (!statusEl || !callButton || !phoneEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.style.color = "";
    callButton.disabled = true;

    const payload = {
      countryCode: countryCodeEl ? countryCodeEl.value : "",
      phone: phoneEl.value.trim(),
      voice: voiceInput ? voiceInput.value : null,
      consent: consentCheckbox ? consentCheckbox.checked : false,
      source: "dealvox-ai-test-call-form",
    };

    if (!payload.phone) {
      statusEl.textContent = "Please enter a valid phone number.";
      updateButtonState();
      return;
    }
    if (consentCheckbox && !payload.consent) {
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

      // Reset voice selection if present
      if (voiceButtons.length && voiceInput) {
        voiceButtons.forEach((b) => b.classList.remove("active"));
        voiceButtons[0].classList.add("active");
        voiceInput.value = voiceButtons[0].dataset.voice || "male";
      }

      updateButtonState();
    } catch (err) {
      console.error(err);
      statusEl.textContent = "⚠️ Something went wrong. Please try again in a moment.";
      statusEl.style.color = "#f97316";
      updateButtonState();
    }
  });
});
