"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2, Search, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AppointmentStatusBadge } from "@/components/admin/AppointmentStatusBadge";
import { ReceptionistBookingModal } from "@/components/admin/ReceptionistBookingModal";
import { searchPatientByPhone } from "@/lib/adminPatients";
import { ApiError } from "@/lib/adminApi";
import { formatDateOnlyDisplay } from "@/lib/dateOnly";
import type { AdminAppointment, PatientSearchResult } from "@/types/admin";

function AppointmentRow({ appointment }: { appointment: AdminAppointment }) {
  const dentistName =
    typeof appointment.dentist === "string" ? appointment.dentist : appointment.dentist?.name;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-ink-900">{appointment.treatment}</p>
        <p className="text-xs text-ink-700">
          {formatDateOnlyDisplay(appointment.preferredDate)} · {appointment.preferredTime}
          {dentistName ? ` · ${dentistName}` : ""}
        </p>
      </div>
      <AppointmentStatusBadge status={appointment.status} />
    </div>
  );
}

export default function AdminPatientsPage() {
  const [phone, setPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");
  const [result, setResult] = useState<PatientSearchResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    try {
      const data = await searchPatientByPhone(phone.trim());
      setResult(data);
      setSearchedPhone(phone.trim());
      setHasSearched(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to search for patient");
    } finally {
      setLoading(false);
    }
  }

  function handleBooked() {
    setBookingOpen(false);
    // Refresh the current search so the newly-booked appointment shows up
    // immediately, if we were looking at this same patient.
    if (searchedPhone) {
      searchPatientByPhone(searchedPhone).then(setResult).catch(() => {});
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Patients</h1>
          <p className="text-sm text-ink-700">
            Look up a patient by phone number, or book a new appointment / walk-in.
          </p>
        </div>
        <Button type="button" onClick={() => setBookingOpen(true)}>
          <UserPlus size={16} />
          New Appointment
        </Button>
      </div>

      <Card className="mt-6 p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-700/50"
            />
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Search by phone number..."
              className="w-full rounded-lg border border-black/10 bg-white py-2.5 pr-4 pl-10 text-sm text-ink-900 placeholder:text-ink-700/50 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none"
            />
          </div>
          <Button type="submit" disabled={loading || !phone.trim()}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
          </Button>
        </form>
      </Card>

      {hasSearched && !loading && (
        <Card className="mt-4 p-0 overflow-hidden">
          {!result ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <p className="text-sm text-ink-700">No patient found for this phone number.</p>
              <Button type="button" variant="outline" onClick={() => setBookingOpen(true)}>
                <UserPlus size={16} />
                Book as a new patient
              </Button>
            </div>
          ) : (
            <div>
              <div className="border-b border-black/5 p-5">
                <p className="text-lg font-semibold text-ink-900">{result.patient.name}</p>
                <p className="text-sm text-ink-700">
                  {result.patient.phone}
                  {result.patient.email ? ` · ${result.patient.email}` : ""}
                </p>
                {result.patient.previousDentist && (
                  <p className="mt-1 text-xs text-ink-700">
                    Previous dentist: {result.patient.previousDentist.name}
                  </p>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
                  Upcoming Appointments
                </h3>
                <div className="mt-2 rounded-lg border border-black/5">
                  {result.upcomingAppointments.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-ink-700">No upcoming appointments.</p>
                  ) : (
                    result.upcomingAppointments.map((appointment) => (
                      <AppointmentRow key={appointment._id} appointment={appointment} />
                    ))
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <h3 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
                  Past Appointments
                </h3>
                <div className="mt-2 rounded-lg border border-black/5">
                  {result.pastAppointments.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-ink-700">No past appointments.</p>
                  ) : (
                    result.pastAppointments.map((appointment) => (
                      <AppointmentRow key={appointment._id} appointment={appointment} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      <ReceptionistBookingModal
        open={bookingOpen}
        initialPhone={!result ? searchedPhone : result.patient.phone}
        initialName={result?.patient.name}
        initialEmail={result?.patient.email}
        onBooked={handleBooked}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
