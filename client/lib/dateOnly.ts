/** Formats a Date using its LOCAL calendar components (not toISOString,
 * which converts to UTC and can shift the date by a day depending on the
 * visitor's timezone offset) — the day the user actually clicked in the
 * picker is the day that gets booked. */
export function toDateOnlyString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Formats a 'YYYY-MM-DD' string for display without ever routing it through
 * a UTC-parsed Date — parses the components directly and constructs a LOCAL
 * Date, so the displayed calendar day can never shift regardless of the
 * viewer's timezone. */
export function formatDateOnlyDisplay(
  dateOnlyString: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
): string {
  const [year, month, day] = dateOnlyString.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);
  return localDate.toLocaleDateString("en-IN", options);
}

/** '14:30' -> '2:30 PM' */
export function formatTimeLabel(time: string): string {
  const [hoursStr, minutes] = time.split(":");
  const hours = Number(hoursStr);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${period}`;
}
