/**
 * Google Calendar integration — creates/updates/deletes calendar events for
 * appointments. Silently skips if credentials are not configured so the
 * booking flow never breaks because of Calendar being down or unconfigured.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let calendarClient: any = null;

async function getCalendarClient() {
  if (calendarClient) return calendarClient;

  const clientEmail = process.env.GOOGLE_CALENDAR_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    console.warn("[calendar] Google Calendar credentials not configured — skipping");
    return null;
  }

  const { google } = await import("googleapis");
  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  calendarClient = google.calendar({ version: "v3", auth });
  return calendarClient;
}

function toGoogleDateTime(dateOnlyString: string, timeString: string) {
  // dateOnlyString = 'YYYY-MM-DD', timeString = 'HH:MM'
  return `${dateOnlyString}T${timeString}:00+05:30`;
}

type AppointmentForCalendar = {
  _id: string | { toString(): string };
  name: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
  durationMinutes: number;
  phone?: string;
  message?: string;
  googleEventId?: string;
};

type DentistForCalendar = {
  _id: string | { toString(): string };
  name: string;
  googleCalendarId?: string;
};

export async function createAppointmentEvent(
  appointment: AppointmentForCalendar,
  dentist: DentistForCalendar,
): Promise<string | null> {
  try {
    const calendarId = dentist.googleCalendarId;
    if (!calendarId) return null;

    const calendar = await getCalendarClient();
    if (!calendar) return null;

    const startDateTime = toGoogleDateTime(appointment.preferredDate, appointment.preferredTime);
    const [h, m] = appointment.preferredTime.split(":").map(Number);
    const totalMinutes = h * 60 + m + appointment.durationMinutes;
    const endH = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    const endM = (totalMinutes % 60).toString().padStart(2, "0");
    const endDateTime = toGoogleDateTime(appointment.preferredDate, `${endH}:${endM}`);

    const response = await (calendar as any).events.insert({
      calendarId,
      requestBody: {
        summary: `${appointment.name} — ${appointment.treatment}`,
        description: `Phone: ${appointment.phone || "—"}\nMessage: ${appointment.message || "—"}\nAppointment ID: ${String(appointment._id)}`,
        start: { dateTime: startDateTime, timeZone: "Asia/Kolkata" },
        end: { dateTime: endDateTime, timeZone: "Asia/Kolkata" },
      },
    });

    return response.data.id || null;
  } catch (err) {
    console.error("[calendar] Failed to create event:", err);
    return null;
  }
}

export async function updateAppointmentEvent(
  appointment: AppointmentForCalendar,
  dentist: DentistForCalendar,
  previousDentist?: DentistForCalendar | null,
): Promise<string | null> {
  try {
    const calendar = await getCalendarClient();
    if (!calendar) return null;

    // If the dentist changed, delete the old event and create a new one
    if (previousDentist && previousDentist.googleCalendarId && appointment.googleEventId) {
      await (calendar as any).events.delete({
        calendarId: previousDentist.googleCalendarId,
        eventId: appointment.googleEventId,
      });
    } else if (appointment.googleEventId && dentist.googleCalendarId) {
      // Update in place
      const startDateTime = toGoogleDateTime(appointment.preferredDate, appointment.preferredTime);
      const [h, m] = appointment.preferredTime.split(":").map(Number);
      const totalMinutes = h * 60 + m + appointment.durationMinutes;
      const endH = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
      const endM = (totalMinutes % 60).toString().padStart(2, "0");
      const endDateTime = toGoogleDateTime(appointment.preferredDate, `${endH}:${endM}`);

      await (calendar as any).events.update({
        calendarId: dentist.googleCalendarId,
        eventId: appointment.googleEventId,
        requestBody: {
          summary: `${appointment.name} — ${appointment.treatment}`,
          start: { dateTime: startDateTime, timeZone: "Asia/Kolkata" },
          end: { dateTime: endDateTime, timeZone: "Asia/Kolkata" },
        },
      });
      return appointment.googleEventId;
    }

    // Create new event on the new dentist's calendar
    return createAppointmentEvent(appointment, dentist);
  } catch (err) {
    console.error("[calendar] Failed to update event:", err);
    return null;
  }
}

export async function deleteAppointmentEvent(
  eventId: string,
  dentist: DentistForCalendar,
): Promise<void> {
  try {
    const calendarId = dentist.googleCalendarId;
    if (!calendarId || !eventId) return;

    const calendar = await getCalendarClient();
    if (!calendar) return;

    await (calendar as any).events.delete({ calendarId, eventId });
  } catch (err) {
    console.error("[calendar] Failed to delete event:", err);
  }
}

export async function getBusyIntervals(
  calendarId: string,
  dateOnlyString: string,
): Promise<{ start: number; end: number }[]> {
  try {
    const calendar = await getCalendarClient();
    if (!calendar) return [];

    const dayStart = `${dateOnlyString}T00:00:00+05:30`;
    const dayEnd = `${dateOnlyString}T23:59:59+05:30`;

    const response = await (calendar as any).freebusy.query({
      requestBody: {
        timeMin: dayStart,
        timeMax: dayEnd,
        timeZone: "Asia/Kolkata",
        items: [{ id: calendarId }],
      },
    });

    const busy = response.data.calendars?.[calendarId]?.busy || [];
    return busy.map((interval: { start: string; end: string }) => {
      const startDate = new Date(interval.start);
      const endDate = new Date(interval.end);
      const startMinutes = startDate.getUTCHours() * 60 + startDate.getUTCMinutes() + 330; // +5:30 IST
      const endMinutes = endDate.getUTCHours() * 60 + endDate.getUTCMinutes() + 330;
      return { start: startMinutes % (24 * 60), end: endMinutes % (24 * 60) };
    });
  } catch (err) {
    console.error("[calendar] Failed to get busy intervals:", err);
    return [];
  }
}
