document.addEventListener("DOMContentLoaded", () => {
  // Voice toggle
  document.querySelectorAll(".voice-toggle").forEach(toggle => {
    const buttons = toggle.querySelectorAll(".voice-option");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });

  // Handle all forms safely
  const forms = document.querySelectorAll(".hero-form-card");

  forms.forEach(formEl => {
    if (formEl.tagName.toLowerCase() !== "form") return;

    const consentCheckbox = formEl.querySelector('input[name="consent"]');
    const callButton = formEl.querySelector(".call-button");

    // Disable button until consent is checked
    if (consentCheckbox && callButton) {
      callButton.disabled = !consentCheckbox.checked;
      consentCheckbox.addEventListener("change", () => {
        callButton.disabled = !consentCheckbox.checked;
      });
    }

    formEl.addEventListener("submit", async e => {
      e.preventDefault();

      const activeVoiceBtn = formEl.querySelector(".voice-option.active");
      const voice = activeVoiceBtn ? activeVoiceBtn.dataset.voice || "male" : "male";
      const code = formEl.querySelector("select[name='country_code']")?.value || "";
      const phone = formEl.querySelector("input[name='phone']")?.value || "";

      if (!phone || (consentCheckbox && !consentCheckbox.checked)) {
        alert("Please enter your phone number and check the consent box.");
        return;
      }

      // Webhook placeholder
      const webhookUrl = "https://example.com/your-webhook-endpoint";
      const payload = {
        phone: `${code} ${phone}`.trim(),
        voice,
        consent: consentCheckbox?.checked || false,
        source: formEl.dataset.formOrigin || "hero"
      };

      try {
        // Uncomment for real call
        // await fetch(webhookUrl, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload)
        // });

        console.log("Form submitted:", payload);
        alert("Your AI test call is on the way!");
        formEl.reset();
        if (consentCheckbox) callButton.disabled = true;

        const firstVoice = formEl.querySelector(".voice-option");
        formEl.querySelectorAll(".voice-option").forEach(b => b.classList.remove("active"));
        if (firstVoice) firstVoice.classList.add("active");
      } catch (err) {
        console.error("Error submitting form:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  });
});
