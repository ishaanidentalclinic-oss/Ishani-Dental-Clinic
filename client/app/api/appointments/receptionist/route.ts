import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { created, withErrorHandler, requireAuth, parseBody, FRONT_DESK_ROLES } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import { HTTP_STATUS, APPOINTMENT_SOURCE } from "@/lib/server/constants";
import { createAppointmentInternal } from "../route";

export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);

  const data = await parseBody(req);

  if (!data.name || !data.phone || !data.treatment || !data.preferredDate || !data.preferredTime || !data.dentist) {
    throw new AppError(
      "Name, phone, treatment, preferredDate, preferredTime, and dentist are required",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  const source =
    data.source === APPOINTMENT_SOURCE.WALK_IN
      ? APPOINTMENT_SOURCE.WALK_IN
      : APPOINTMENT_SOURCE.RECEPTIONIST;

  const appointment = await createAppointmentInternal({
    ...data,
    source,
  });

  return created(appointment, "Appointment created successfully");
});
