// assets/js/form.js

document.addEventListener("DOMContentLoaded", () => {
  // 1) Voice toggle behaviour
  document.querySelectorAll(".voice-toggle").forEach(toggle => {
    const buttons = toggle.querySelectorAll(".voice-option");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  });

  // 2) Form submission handling for all hero-style forms
  const forms = document.querySelectorAll(".hero-form-card");

  forms.forEach(formEl => {
    // Ensure it's actually a <form>; if not, skip
    if (formEl.tagName.toLowerCase() !== "form") return;

    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();

      const activeVoiceBtn = formEl.querySelector(".voice-option.active");
      const voice = activeVoiceBtn ? activeVoiceBtn.dataset.voice || "male" : "male";

      const code = formEl.querySelector("select[name='country_code']")?.value || "";
      const phone = formEl.querySelector("input[name='phone']")?.value || "";
      const consent = formEl.querySelector("input[name='consent']")?.checked || false;

      if (!phone || !consent) {
        alert("Please enter your phone number and accept the consent.");
        return;
      }

      // TODO: replace with your real webhook URL
      const webhookUrl = "https://example.com/your-webhook-endpoint";

      const payload = {
        phone: `${code} ${phone}`.trim(),
        voice,
        consent,
        source: formEl.dataset.formOrigin || "hero"
      };

      try {
        // Comment this out until you have a real endpoint to avoid errors:
        // await fetch(webhookUrl, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload)
        // });

        console.log("Form submitted (demo payload):", payload);
        alert("Thank you! An AI test call will be triggered shortly.");
        formEl.reset();
        // reset active voice to default
        const firstVoice = formEl.querySelector(".voice-option");
        formEl.querySelectorAll(".voice-option").forEach(b => b.classList.remove("active"));
        if (firstVoice) firstVoice.classList.add("active");
      } catch (err) {
        console.error("Form submission failed:", err);
        alert("Oops. Something went wrong. Please try again in a moment.");
      }
    });
  });
});
