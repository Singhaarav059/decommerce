// Book-a-demo form copy, shared by the homepage close and /contact-us.

export const demoForm = {
  fields: {
    name: { label: "Your name", autoComplete: "name" },
    email: { label: "Work email", autoComplete: "email" },
    company: { label: "Company", autoComplete: "organization" },
    sells: {
      label: "Where do you sell today?",
      options: ["Website only", "Stores only", "Website and stores", "Marketplaces too", "Wholesale (B2B)"],
    },
    message: { label: "Anything we should know?", placeholder: "Catalog size, number of stores, systems you use today…" },
  },
  submit: "Book a demo",
  sending: "Sending…",
  success: { title: "Thanks, we've got it.", body: "We'll reply within one working day to set up a time." },
  error: "We couldn't send your request right now. Please try again later.",
  privacy: "We only use these details to reply to you.",
};
