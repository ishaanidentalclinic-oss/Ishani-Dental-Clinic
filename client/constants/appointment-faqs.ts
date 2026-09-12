import type { FaqItem } from "@/types";

export const APPOINTMENT_FAQS: FaqItem[] = [
  {
    id: "how-to-book",
    question: "How do I book an appointment?",
    answer:
      "Fill out the appointment form on this page, call us directly, or message us on WhatsApp — whichever is easiest for you.",
  },
  {
    id: "what-to-bring",
    question: "What should I bring to my first appointment?",
    answer:
      "A valid ID, any previous dental records or X-rays you have, and a list of current medications.",
  },
  {
    id: "reschedule",
    question: "Can I reschedule or cancel my appointment?",
    answer:
      "Yes — contact us by phone or WhatsApp as soon as you know your plans have changed, and we'll help you find a new time.",
  },
  {
    id: "arrival-time",
    question: "How early should I arrive?",
    answer:
      "We recommend arriving 10–15 minutes before your scheduled time to complete any paperwork.",
  },
] as const;
