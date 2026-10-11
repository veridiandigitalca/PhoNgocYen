(() =>
 {
  "use strict";
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  if (!form || !status) return;
  form.addEventListener("submit", event =>
 {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Pho Ngoc Yen enquiry — ${data.get("topic")}`;
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nTopic: ${data.get("topic")}\n\nMessage:\n${data.get("message")}`;
    status.textContent = "Your message has been prepared below. This demo does not send it automatically; connect a form service before launch.";
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const link = document.createElement("a");
    link.href = mailto;
    link.className = "underlined-link mailto-action";
    link.textContent = "Open your email app to send it ↗";
    link.style.display = "inline-flex";
    const old = form.querySelector(".mailto-action");
    if (old) old.remove();
    status.insertAdjacentElement("afterend", link);
  });
})();