/* Editable business and integration settings.
   Only the contact form reads this file today; other pages contain their details directly in HTML.
   Verify every detail with the restaurant before launch. */
window.PNY_CONFIG = {
  brand: "Phở Ngọc Yến",
  officialWebsite: "https://ngocyenrestaurant.com/",

  /* CONTACT FORM — set ONE of these before launch (both left empty = demo mode):
     formEndpoint: URL of a form service that accepts a JSON POST (e.g. a Formspree/Basin endpoint or your own API).
     contactEmail: address used to pre-fill the visitor's email app when no endpoint is set. */
  formEndpoint: "",
  contactEmail: "",

  locations: {
    mississauga: {
      name: "Mississauga — Kamato Road",
      address: "1090 Kamato Rd, Units 17–19, Mississauga, ON L4W 2P3, Canada",
      phone: "+1 (905) 629-9559",
      verified: "Address and phone supplied by client research; confirm before launch."
    },
    etobicoke: {
      name: "Etobicoke — The Queensway",
      addressCandidates: ["1055 The Queensway, Etobicoke, ON M8Z 5T5", "1596 The Queensway, Etobicoke, ON M8Z 1T8"],
      verified: "Conflicting addresses supplied; do not publish a single address until confirmed."
    },
    toronto: {
      name: "Toronto",
      addressCandidates: ["206 Ward St, Toronto, ON M5T 2Z3", "350 Adelaide St W, Toronto, ON M5V 1R7"],
      verified: "Conflicting addresses supplied; do not publish a single address until confirmed."
    }
  }
};
