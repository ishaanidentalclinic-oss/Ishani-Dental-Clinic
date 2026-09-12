import { CLINIC } from "./constants";
import { escapeHtml, formatDateOnlyDisplay } from "./utils";

// The site's brand colors — kept in sync with client/app/globals.css
const COLORS = {
  brand: "#145043",
  ink900: "#16232a",
  ink700: "#33454c",
  sage50: "#eef4f1",
  border: "#e2ece7",
};

function renderEmailLayout({ previewText, bodyHtml }: { previewText: string; bodyHtml: string }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${CLINIC.name}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.sage50};font-family:Arial, Helvetica, sans-serif;">
    <span style="display:none;font-size:1px;color:${COLORS.sage50};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${previewText}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.sage50};padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr><td style="background-color:${COLORS.brand};padding:20px 32px;">
            <span style="color:#ffffff;font-size:18px;font-weight:bold;font-family:Arial, Helvetica, sans-serif;">${CLINIC.name}</span>
          </td></tr>
          <tr><td style="padding:32px;">${bodyHtml}</td></tr>
          <tr><td style="background-color:${COLORS.sage50};padding:20px 32px;border-top:1px solid ${COLORS.border};">
            <p style="margin:0;font-size:12px;line-height:1.6;color:${COLORS.ink700};font-family:Arial, Helvetica, sans-serif;">
              ${CLINIC.fullName}<br />
              ${CLINIC.address}<br />
              Phone: ${CLINIC.phone} &middot; Email: ${CLINIC.email}
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// ── Email builders ────────────────────────────────────────────────────────

type AppointmentData = {
  name: string;
  email?: string;
  phone: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: string;
  createdAt?: Date | string;
};

export function buildPatientConfirmationEmail(appointment: AppointmentData) {
  const { name, treatment, preferredDate, preferredTime, status } = appointment;
  const dateLabel = formatDateOnlyDisplay(preferredDate);
  const safeName = escapeHtml(name);

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;color:${COLORS.ink900};font-family:Arial, Helvetica, sans-serif;">
      Hi ${safeName}, we've received your request!
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${COLORS.ink700};font-family:Arial, Helvetica, sans-serif;">
      Thank you for choosing ${CLINIC.name}. Your appointment request has been received and is currently <strong>${status}</strong> — our team will reach out shortly to confirm the exact time.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.sage50};border-radius:8px;margin:0 0 20px;">
      <tr><td style="padding:16px 20px;font-size:14px;font-family:Arial, Helvetica, sans-serif;color:${COLORS.ink900};">
        <p style="margin:0 0 8px;"><strong>Treatment:</strong> ${escapeHtml(treatment)}</p>
        <p style="margin:0 0 8px;"><strong>Preferred Date:</strong> ${dateLabel}</p>
        <p style="margin:0 0 8px;"><strong>Preferred Time:</strong> ${escapeHtml(preferredTime)}</p>
        <p style="margin:0;"><strong>Status:</strong> ${status}</p>
      </td></tr>
    </table>
    <p style="margin:0;font-size:15px;line-height:1.6;color:${COLORS.ink700};font-family:Arial, Helvetica, sans-serif;">
      Warm regards,<br />The ${CLINIC.name} Team
    </p>
  `;

  return {
    subject: `Your appointment request has been received — ${CLINIC.name}`,
    html: renderEmailLayout({ previewText: "Your appointment request has been received.", bodyHtml }),
    text: `Hi ${name}, your appointment request for ${treatment} on ${dateLabel} at ${preferredTime} has been received (Status: ${status}).`,
  };
}

export function buildClinicNotificationEmail(appointment: AppointmentData) {
  const { name, email, phone, treatment, preferredDate, preferredTime, message, status, createdAt } = appointment;

  const rows = [
    ["Patient Name", name],
    ["Phone", phone],
    ["Email", email || "—"],
    ["Treatment", treatment],
    ["Preferred Date", formatDateOnlyDisplay(preferredDate)],
    ["Preferred Time", preferredTime],
    ["Message", message || "—"],
    ["Status", status],
    ["Booked At", createdAt ? new Date(createdAt).toLocaleString("en-IN") : "—"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 12px;font-size:13px;font-family:Arial, Helvetica, sans-serif;color:${COLORS.ink700};border-bottom:1px solid ${COLORS.border};white-space:nowrap;"><strong>${label}</strong></td>
        <td style="padding:10px 12px;font-size:13px;font-family:Arial, Helvetica, sans-serif;color:${COLORS.ink900};border-bottom:1px solid ${COLORS.border};">${escapeHtml(String(value))}</td>
      </tr>`,
    )
    .join("");

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;color:${COLORS.ink900};font-family:Arial, Helvetica, sans-serif;">New Appointment Request</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rowsHtml}</table>
  `;

  return {
    subject: `New Appointment Request — ${name} (${treatment})`,
    html: renderEmailLayout({ previewText: `New appointment request from ${name}`, bodyHtml }),
    text: rows.map(([l, v]) => `${l}: ${v}`).join("\n"),
  };
}

export function buildAppointmentCancelledEmail(appointment: AppointmentData) {
  const { name, treatment, preferredDate, preferredTime } = appointment;
  const dateLabel = formatDateOnlyDisplay(preferredDate);

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;color:${COLORS.ink900};font-family:Arial, Helvetica, sans-serif;">
      Hi ${escapeHtml(name)}, your appointment has been cancelled
    </h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${COLORS.ink700};font-family:Arial, Helvetica, sans-serif;">
      Your appointment with ${CLINIC.name} has been cancelled as requested.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.sage50};border-radius:8px;margin:0 0 20px;">
      <tr><td style="padding:16px 20px;font-size:14px;font-family:Arial, Helvetica, sans-serif;color:${COLORS.ink900};">
        <p style="margin:0 0 8px;"><strong>Treatment:</strong> ${escapeHtml(treatment)}</p>
        <p style="margin:0 0 8px;"><strong>Was scheduled for:</strong> ${dateLabel} at ${escapeHtml(preferredTime)}</p>
      </td></tr>
    </table>
  `;

  return {
    subject: `Your appointment has been cancelled — ${CLINIC.name}`,
    html: renderEmailLayout({ previewText: "Your appointment has been cancelled.", bodyHtml }),
    text: `Hi ${name}, your appointment for ${treatment} on ${dateLabel} at ${preferredTime} has been cancelled.`,
  };
}

export function buildAppointmentRescheduledEmail(
  appointment: AppointmentData,
  previous: { preferredDate: string; preferredTime: string },
) {
  const { name, treatment, preferredDate, preferredTime, status } = appointment;
  const newDateLabel = formatDateOnlyDisplay(preferredDate);
  const oldDateLabel = formatDateOnlyDisplay(previous.preferredDate);

  const bodyHtml = `
    <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;color:${COLORS.ink900};font-family:Arial, Helvetica, sans-serif;">
      Hi ${escapeHtml(name)}, your appointment has been rescheduled
    </h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.sage50};border-radius:8px;margin:0 0 20px;">
      <tr><td style="padding:16px 20px;font-size:14px;font-family:Arial, Helvetica, sans-serif;color:${COLORS.ink900};">
        <p style="margin:0 0 8px;"><strong>Treatment:</strong> ${escapeHtml(treatment)}</p>
        <p style="margin:0 0 8px;text-decoration:line-through;color:${COLORS.ink700};"><strong>Previously:</strong> ${oldDateLabel} at ${escapeHtml(previous.preferredTime)}</p>
        <p style="margin:0 0 8px;"><strong>Now:</strong> ${newDateLabel} at ${escapeHtml(preferredTime)}</p>
        <p style="margin:0;"><strong>Status:</strong> ${status}</p>
      </td></tr>
    </table>
  `;

  return {
    subject: `Your appointment has been rescheduled — ${CLINIC.name}`,
    html: renderEmailLayout({ previewText: "Your appointment has a new date and time.", bodyHtml }),
    text: `Hi ${name}, your appointment for ${treatment} has been rescheduled from ${oldDateLabel} to ${newDateLabel} at ${preferredTime}.`,
  };
}

// ── Email sender ──────────────────────────────────────────────────────────

let transporterInstance: import("nodemailer").Transporter | null = null;

async function getTransporter() {
  if (transporterInstance) return transporterInstance;
  const nodemailer = (await import("nodemailer")).default;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.warn("[email] SMTP not configured — email sending skipped");
    return null;
  }
  transporterInstance = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  return transporterInstance;
}

async function sendMail(to: string, { subject, html, text }: { subject: string; html: string; text: string }) {
  try {
    const transporter = await getTransporter();
    if (!transporter) return;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("[email] Failed to send email:", err);
  }
}

export async function sendPatientConfirmationEmail(appointment: AppointmentData) {
  if (!appointment.email) return;
  const mail = buildPatientConfirmationEmail(appointment);
  await sendMail(appointment.email, mail);
}

export async function sendClinicNotificationEmail(appointment: AppointmentData) {
  const clinicEmail = process.env.CLINIC_EMAIL;
  if (!clinicEmail) return;
  const mail = buildClinicNotificationEmail(appointment);
  await sendMail(clinicEmail, mail);
}

export async function sendAppointmentCancelledEmail(appointment: AppointmentData) {
  if (!appointment.email) return;
  const mail = buildAppointmentCancelledEmail(appointment);
  await sendMail(appointment.email, mail);
}

export async function sendAppointmentRescheduledEmail(
  appointment: AppointmentData,
  previous: { preferredDate: string; preferredTime: string },
) {
  if (!appointment.email) return;
  const mail = buildAppointmentRescheduledEmail(appointment, previous);
  await sendMail(appointment.email, mail);
}
