/* Centralized editable business details. Verify all details before launch. */
window.PNY_CONFIG = {
  brand: "Phở Ngọc Yến",
  officialWebsite: "https://ngocyenrestaurant.com/",
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