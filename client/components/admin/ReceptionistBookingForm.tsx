"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TREATMENT_OPTIONS } from "@/constants/treatment-options";
import { fetchDentists, type Dentist } from "@/lib/dentists";
import { fetchAvailableSlots, fetchNextAvailableSlot } from "@/lib/appointments";
import { createReceptionistAppointment } from "@/lib/adminAppointments";
import { ApiError } from "@/lib/adminApi";
import { toDateOnlyString, formatTimeLabel } from "@/lib/dateOnly";
import type { AdminAppointment } from "@/types/admin";

interface ReceptionistBookingFormProps {
  initialName?: string;
  initialPhone?: string;
  initialEmail?: string;
  onBooked: (appointment: AdminAppointment) => void;
  onCancel: () => void;
}

/**
 * Receptionist/walk-in booking form — calls the exact same scheduling
 * engine as the public site (createAppointment on the server), via the
 * `/appointments/receptionist` endpoint. There is only one booking engine;
 * this form just lets the front desk supply an explicit source.
 */
export function ReceptionistBookingForm({
  initialName = "",
  initialPhone = "",
  initialEmail = "",
  onBooked,
  onCancel,
}: ReceptionistBookingFormProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [treatment, setTreatment] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [source, setSource] = useState<"Receptionist" | "Walk-in">("Receptionist");
  const [notes, setNotes] = useState("");

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [findingSlot, setFindingSlot] = useState(false);

  useEffect(() => {
    fetchDentists()
      .then(setDentists)
      .catch(() => toast.error("Couldn't load the list of dentists"));
  }, []);

  // "Loading" is derived by comparing the slot query this render wants
  // against the query the slots currently in state were resolved for, both
  // updated only from inside the fetch's own promise callbacks — an effect
  // must never call setState synchronously in its own body (see the same
  // pattern in admin/appointments/page.tsx).
  const slotsQueryKey =
    date && treatment && dentistId ? `${toDateOnlyString(date)}|${treatment}|${dentistId}` : null;
  const [resolvedSlotsKey, setResolvedSlotsKey] = useState<string | null>(null);
  const slotsLoading = slotsQueryKey !== null && resolvedSlotsKey !== slotsQueryKey;

  useEffect(() => {
    if (!slotsQueryKey || !date || !treatment || !dentistId) {
      return;
    }

    let ignore = false;

    fetchAvailableSlots(toDateOnlyString(date), treatment, dentistId)
      .then((result) => {
        if (ignore) return;
        setSlots(result.isOpen ? result.slots : []);
      })
      .catch(() => {
        if (!ignore) setSlots([]);
      })
      .finally(() => {
        if (!ignore) setResolvedSlotsKey(slotsQueryKey);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- slotsQueryKey already encodes date/treatment/dentistId
  }, [slotsQueryKey]);

  async function handleFindEarliest() {
    if (!treatment) {
      toast.error("Choose a treatment first");
      return;
    }
    setFindingSlot(true);
    try {
      const next = await fetchNextAvailableSlot(treatment, dentistId || undefined);
      if (!next) {
        toast.error("No availability found in the next 30 days");
        return;
      }
      setDentistId(next.dentist.id);
      const [year, month, day] = next.date.split("-").map(Number);
      setDate(new Date(year, month - 1, day));
      setTime(next.time);
    } catch {
      toast.error("Couldn't find the next available slot");
    } finally {
      setFindingSlot(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name || !phone || !treatment || !dentistId || !date || !time) {
      toast.error("Please fill in every field before booking");
      return;
    }
    if (treatment === "Other" && !notes.trim()) {
      toast.error("Please describe the patient's treatment need or concern");
      return;
    }

    setSubmitting(true);
    try {
      const appointment = await createReceptionistAppointment({
        name,
        email,
        phone,
        treatment,
        dentist: dentistId,
        preferredDate: toDateOnlyString(date),
        preferredTime: time,
        source,
        message: notes || undefined,
      });
      toast.success("Appointment booked");
      onBooked(appointment);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" htmlFor="rb-name">
          <Input id="rb-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Phone" htmlFor="rb-phone">
          <Input id="rb-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </FormField>
      </div>

      <FormField label="Email (optional)" htmlFor="rb-email">
        <Input
          id="rb-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Treatment" htmlFor="rb-treatment">
          <Select id="rb-treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)}>
            <option value="">Select a treatment</option>
            {TREATMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Dentist" htmlFor="rb-dentist">
          <Select id="rb-dentist" value={dentistId} onChange={(e) => setDentistId(e.target.value)}>
            <option value="">Select a dentist</option>
            {dentists.map((dentist) => (
              <option key={dentist._id} value={dentist._id}>
                {dentist.name}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleFindEarliest}
        disabled={findingSlot}
      >
        {findingSlot ? "Finding…" : "Use earliest available slot"}
      </Button>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Date" htmlFor="rb-date">
          <DatePicker
            id="rb-date"
            selected={date}
            onChange={setDate}
            minDate={new Date()}
            dateFormat="dd-MM-yyyy"
            placeholderText="DD-MM-YYYY"
            disabled={!treatment || !dentistId}
            withPortal
            className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-ink-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none disabled:opacity-50"
          />
        </FormField>
        <FormField label="Time" htmlFor="rb-time">
          <div className="relative">
            <Select
              id="rb-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!date || !treatment || !dentistId || slotsLoading || slots.length === 0}
            >
              <option value="">
                {slotsLoading
                  ? "Loading…"
                  : slots.length === 0
                    ? "No times available"
                    : "Select a time"}
              </option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {formatTimeLabel(slot)}
                </option>
              ))}
            </Select>
            {slotsLoading && (
              <Loader2
                size={16}
                className="pointer-events-none absolute top-1/2 right-9 -translate-y-1/2 animate-spin text-ink-700/50"
              />
            )}
          </div>
        </FormField>
      </div>

      <FormField label="Booking Source" htmlFor="rb-source">
        <Select
          id="rb-source"
          value={source}
          onChange={(e) => setSource(e.target.value as "Receptionist" | "Walk-in")}
        >
          <option value="Receptionist">Receptionist (phone/desk)</option>
          <option value="Walk-in">Walk-in</option>
        </Select>
      </FormField>

      <FormField
        label={treatment === "Other" ? "Treatment need or concern" : "Notes (optional)"}
        htmlFor="rb-notes"
      >
        <Textarea
          id="rb-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          invalid={treatment === "Other" && !notes.trim()}
          placeholder={
            treatment === "Other" ? "What's going on with the patient?" : undefined
          }
        />
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Booking…" : "Book Appointment"}
        </Button>
      </div>
    </form>
  );
}
