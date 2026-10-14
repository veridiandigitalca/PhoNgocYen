/* Contact form: accessible validation + honest submission states.
   - With PNY_CONFIG.formEndpoint set, the message is POSTed as JSON.
   - Otherwise nothing is sent: the visitor gets a prepared email draft and is told so plainly. */
(() => {
  "use strict";
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;
  const cfg = window.PNY_CONFIG || {};
  const submit = form.querySelector("[type=submit]");
  const fields = ["name", "email", "message", "consent"].map(id => form.elements[id]).filter(Boolean);
  const messages = {
    name: "Please enter your name.",
    email: "Please enter a valid email address, like you@example.com.",
    message: "Please write a short message.",
    consent: "Please tick the box to continue."
  };

  const errorEl = field => document.getElementById(`${field.name}-error`);
  const setError = (field, text) => {
    const el = errorEl(field);
    field.setAttribute("aria-invalid", text ? "true" : "false");
    if (el) { el.textContent = text; el.hidden = !text; }
  };
  const validate = field => {
    const bad = field.type === "checkbox" ? !field.checked : (!field.value.trim() || (field.type === "email" && !field.validity.valid));
    setError(field, bad ? messages[field.name] : "");
    return !bad;
  };
  fields.forEach(field => {
    field.addEventListener("blur", () => { if (field.getAttribute("aria-invalid") === "true" || field.value) validate(field); });
    field.addEventListener("input", () => { if (field.getAttribute("aria-invalid") === "true") validate(field); });
  });

  const clearDraftLink = () => { const old = form.querySelector(".mailto-action"); if (old) old.remove(); };

  form.addEventListener("submit", async event => {
    event.preventDefault();
    clearDraftLink();
    const results = fields.map(validate);
    if (results.includes(false)) {
      status.textContent = "Please fix the highlighted fields and try again.";
      fields[results.indexOf(false)].focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    delete data.consent;
    const subject = `Pho Ngoc Yen enquiry — ${data.topic}`;
    const body = `Name: ${data.name}\nEmail: ${data.email}\nTopic: ${data.topic}\n\nMessage:\n${data.message}`;

    if (cfg.formEndpoint) {
      submit.disabled = true;
      status.textContent = "Sending your message…";
      try {
        const response = await fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(String(response.status));
        form.reset();
        fields.forEach(field => setError(field, ""));
        status.textContent = "Thank you — your message has been sent.";
      } catch (error) {
        status.textContent = "Sorry, your message could not be sent. Please try again, or call the restaurant.";
      } finally {
        submit.disabled = false;
      }
      return;
    }

    // Demo mode: be explicit that nothing has been sent.
    status.textContent = "Nothing has been sent yet. Use the link below to open a draft in your email app" +
      (cfg.contactEmail ? "." : " and add the restaurant's address.");
    const link = document.createElement("a");
    link.href = `mailto:${cfg.contactEmail || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    link.className = "underlined-link mailto-action";
    link.textContent = "Open your email app ↗";
    status.insertAdjacentElement("afterend", link);
  });
})();
