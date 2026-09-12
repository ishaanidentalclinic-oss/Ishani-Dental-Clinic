import { z } from "zod";

export const appointmentSchema = z
  .object({
    patientType: z.enum(["new", "returning"], { message: "Please tell us if you've visited before" }),
    dentist: z.string().min(1, "Please select a dentist"),
    fullName: z.string().min(2, "Please enter your full name"),
    // Optional — not every patient has one. Phone below is the required,
    // reliable contact channel.
    email: z.email("Please enter a valid email address").optional().or(z.literal("")),
    phone: z.string().min(8, "Please enter a valid phone number"),
    date: z.date({ message: "Please pick a date" }),
    time: z.string().min(1, "Please select an available time"),
    treatment: z.string().min(1, "Please select a treatment"),
    notes: z.string().optional(),
  })
  // "Other" isn't a real treatment the clinic can prepare for on its own —
  // require a description of what's actually going on before it can be submitted.
  .refine((data) => data.treatment !== "Other" || !!data.notes?.trim(), {
    message: "Please describe your treatment need or concern",
    path: ["notes"],
  });

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
