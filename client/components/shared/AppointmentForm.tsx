"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonHover, buttonTap } from "@/motion/variants";
import { getWhatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { appointmentSchema, type AppointmentFormValues } from "@/lib/validations/appointment";
import { TREATMENT_OPTIONS } from "@/constants/treatment-options";
import {
  bookAppointment,
  fetchAvailableSlots,
  fetchNextAvailableSlot,
  AppointmentApiError,
} from "@/lib/appointments";
import { fetchDentists, type Dentist } from "@/lib/dentists";
import { toDateOnlyString, formatTimeLabel } from "@/lib/dateOnly";

const WHATSAPP_APPOINTMENT_MESSAGE =
  "Hello, I would like to book an appointment at Ishaani Dental Clinic.";

function radioCardClass(active: boolean) {
  return cn(
    "flex cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-colors",
    active
      ? "border-primary-600 bg-primary-50 text-primary-700"
      : "border-black/10 text-ink-700 hover:border-primary-200",
  );
}

export function AppointmentForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  const patientType = watch("patientType");
  const selectedDentistId = watch("dentist");
  const selectedDate = watch("date");
  const selectedTreatment = watch("treatment");
  const selectedDateTime = selectedDate?.getTime();

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [dentistsLoading, setDentistsLoading] = useState(true);
  const [dentistsError, setDentistsError] = useState<string | null>(null);

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [dayIsClosed, setDayIsClosed] = useState(false);

  // Returning-patient "your dentist is unavailable, want to see the other
  // one?" flow — deliberately requires an explicit click to even check the
  // other dentist, and another explicit click to actually pick one of their
  // times. The engine never substitutes a dentist on its own.
  const [alternateDentist, setAlternateDentist] = useState<Dentist | null>(null);
  const [alternateSlots, setAlternateSlots] = useState<string[]>([]);
  const [alternateLoading, setAlternateLoading] = useState(false);

  // New-patient "Earliest Available Dentist" recommendation.
  const [recommended, setRecommended] = useState<{
    date: string;
    time: string;
    dentistName: string;
  } | null>(null);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetchDentists()
      .then((list) => {
        if (!ignore) setDentists(list);
      })
      .catch(() => {
        if (!ignore) setDentistsError("Couldn't load our dentists. Please refresh the page.");
      })
      .finally(() => {
        if (!ignore) setDentistsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // A returning patient's dentist choice (radio) and a new patient's dentist
  // choice (cards) come from different UI — switching between "new" and
  // "returning" shouldn't carry a stale selection across.
  useEffect(() => {
    setValue("dentist", "");
    setRecommended(null);
    setAlternateDentist(null);
    setAlternateSlots([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resetting on patientType change only
  }, [patientType]);

  useEffect(() => {
    setAlternateDentist(null);
    setAlternateSlots([]);

    if (!selectedDate || !selectedTreatment || !selectedDentistId) {
      setSlots([]);
      setSlotsError(null);
      setDayIsClosed(false);
      return;
    }

    let ignore = false;
    setSlotsLoading(true);
    setSlotsError(null);

    fetchAvailableSlots(toDateOnlyString(selectedDate), selectedTreatment, selectedDentistId)
      .then((result) => {
        if (ignore) return;
        setSlots(result.slots);
        setDayIsClosed(!result.isOpen);
      })
      .catch((err) => {
        if (ignore) return;
        setSlots([]);
        setSlotsError(
          err instanceof AppointmentApiError ? err.message : "Couldn't load available times.",
        );
      })
      .finally(() => {
        if (!ignore) setSlotsLoading(false);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- selectedDate/selectedTreatment/selectedDentistId are the only real deps
  }, [selectedDateTime, selectedTreatment, selectedDentistId]);

  // The previously-picked time may no longer be valid once the day,
  // treatment, or dentist changes — clear it rather than silently
  // submitting a stale value.
  useEffect(() => {
    setValue("time", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateTime, selectedTreatment, selectedDentistId]);

  const showOtherDentistOffer =
    patientType === "returning" &&
    !!selectedDentistId &&
    !!selectedDate &&
    !!selectedTreatment &&
    !slotsLoading &&
    !dayIsClosed &&
    slots.length === 0;

  const currentDentistName =
    dentists.find((d) => d._id === selectedDentistId)?.name ?? "Your previous dentist";

  async function handleShowOtherDentist() {
    if (!selectedDate || !selectedTreatment) return;
    const other = dentists.find((d) => d._id !== selectedDentistId);
    if (!other) return;

    setAlternateLoading(true);
    try {
      const result = await fetchAvailableSlots(
        toDateOnlyString(selectedDate),
        selectedTreatment,
        other._id,
      );
      setAlternateDentist(other);
      setAlternateSlots(result.isOpen ? result.slots : []);
    } catch {
      setAlternateDentist(other);
      setAlternateSlots([]);
    } finally {
      setAlternateLoading(false);
    }
  }

  function handlePickAlternateSlot(time: string) {
    if (!alternateDentist) return;
    setValue("dentist", alternateDentist._id, { shouldValidate: true });
    setValue("time", time, { shouldValidate: true });
    setAlternateDentist(null);
    setAlternateSlots([]);
  }

  async function handleUseEarliestAvailable() {
    if (!selectedTreatment) return;
    setRecommendedLoading(true);
    try {
      const next = await fetchNextAvailableSlot(selectedTreatment);
      if (!next) {
        toast.error("No availability found in the next 30 days. Please call the clinic directly.");
        return;
      }
      setRecommended({ date: next.date, time: next.time, dentistName: next.dentist.name });
      setValue("dentist", next.dentist.id, { shouldValidate: true });
      // react-datepicker needs a Date object — parse 'YYYY-MM-DD' as LOCAL
      // components (not UTC) so the recommended calendar day can't shift.
      const [year, month, day] = next.date.split("-").map(Number);
      setValue("date", new Date(year, month - 1, day), { shouldValidate: true });
      setValue("time", next.time, { shouldValidate: true });
    } catch {
      toast.error("Couldn't find the next available slot. Please try again.");
    } finally {
      setRecommendedLoading(false);
    }
  }

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      await bookAppointment({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        treatment: data.treatment,
        dentist: data.dentist,
        preferredDate: toDateOnlyString(data.date),
        preferredTime: data.time,
        message: data.notes,
      });
      toast.success("Appointment request received — we'll contact you shortly.");
      reset();
      setSlots([]);
      setRecommended(null);
    } catch (err) {
      const message =
        err instanceof AppointmentApiError ? err.message : "Something went wrong. Please try again.";
      toast.error(message);

      // Someone else may have just taken this slot — refresh the list so
      // the user immediately sees what's actually still available.
      if (selectedDate && selectedTreatment && selectedDentistId) {
        fetchAvailableSlots(toDateOnlyString(selectedDate), selectedTreatment, selectedDentistId)
          .then((result) => {
            setSlots(result.slots);
            setDayIsClosed(!result.isOpen);
          })
          .catch(() => {
            // Best-effort refresh only — the error toast above already told the user what happened.
          });
      }
    }
  };

  const timePlaceholder =
    !selectedDate || !selectedTreatment || !selectedDentistId
      ? "Select a treatment and dentist first"
      : slotsLoading
        ? "Loading available times…"
        : dayIsClosed
          ? "Clinic is closed on this day"
          : slotsError
            ? slotsError
            : slots.length === 0
              ? "No available times for this day"
              : "Select a time";

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-ink-900">Book Appointment</h3>
      <p className="mt-1 text-sm text-ink-700">Schedule your smile consultation.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <FormField
          label="Have you visited Ishaani Dental Clinic before?"
          htmlFor="patientType"
          error={errors.patientType?.message}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className={radioCardClass(patientType === "new")}>
              <input type="radio" value="new" className="sr-only" {...register("patientType")} />
              New Patient
            </label>
            <label className={radioCardClass(patientType === "returning")}>
              <input
                type="radio"
                value="returning"
                className="sr-only"
                {...register("patientType")}
              />
              Returning Patient
            </label>
          </div>
        </FormField>

        {patientType && (
          <FormField
            label="Choose Your Treatment"
            htmlFor="treatment"
            error={errors.treatment?.message}
          >
            <Select id="treatment" defaultValue="" {...register("treatment")}>
              <option value="" disabled>
                Select a treatment
              </option>
              {TREATMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </FormField>
        )}

        {patientType === "returning" && selectedTreatment && (
          <FormField
            label="Who was your previous dentist?"
            htmlFor="dentist"
            error={errors.dentist?.message}
          >
            {dentistsLoading ? (
              <p className="text-sm text-ink-700">Loading dentists…</p>
            ) : dentistsError ? (
              <p className="text-sm text-red-600">{dentistsError}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {dentists.map((dentist) => (
                  <label
                    key={dentist._id}
                    className={radioCardClass(selectedDentistId === dentist._id)}
                  >
                    <input
                      type="radio"
                      value={dentist._id}
                      className="sr-only"
                      {...register("dentist")}
                    />
                    {dentist.name}
                  </label>
                ))}
              </div>
            )}
          </FormField>
        )}

        {patientType === "returning" && showOtherDentistOffer && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="text-ink-900">
              {currentDentistName} is unavailable on your selected date.
            </p>
            {!alternateDentist ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={handleShowOtherDentist}
                disabled={alternateLoading}
              >
                {alternateLoading ? "Checking…" : "Show appointments with the other dentist"}
              </Button>
            ) : alternateSlots.length === 0 ? (
              <p className="mt-2 text-ink-700">
                {alternateDentist.name} also has no openings on this date. Please try another
                date.
              </p>
            ) : (
              <div className="mt-3">
                <p className="mb-2 text-ink-700">{alternateDentist.name}&apos;s available times:</p>
                <div className="flex flex-wrap gap-2">
                  {alternateSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handlePickAlternateSlot(time)}
                      className="rounded-pill border border-primary-200 bg-white px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
                    >
                      {formatTimeLabel(time)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {patientType === "new" && selectedTreatment && (
          <FormField label="Choose Your Dentist" htmlFor="dentist" error={errors.dentist?.message}>
            {dentistsLoading ? (
              <p className="text-sm text-ink-700">Loading dentists…</p>
            ) : dentistsError ? (
              <p className="text-sm text-red-600">{dentistsError}</p>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleUseEarliestAvailable}
                  disabled={recommendedLoading}
                  className={cn(
                    "block w-full rounded-lg border px-4 py-3 text-left transition-colors",
                    recommended
                      ? "border-primary-600 bg-primary-50"
                      : "border-black/10 hover:border-primary-200",
                  )}
                >
                  <span className="font-semibold text-ink-900">Earliest Available Dentist</span>
                  <span className="ml-2 text-xs font-medium text-primary-600">(Recommended)</span>
                  <p className="mt-1 text-xs text-ink-700">
                    {recommendedLoading
                      ? "Checking availability…"
                      : recommended
                        ? `${recommended.dentistName} — ${recommended.date} at ${formatTimeLabel(recommended.time)}`
                        : "We'll suggest whichever dentist has the soonest opening."}
                  </p>
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  {dentists.map((dentist) => (
                    <button
                      key={dentist._id}
                      type="button"
                      onClick={() => {
                        setRecommended(null);
                        setValue("dentist", dentist._id, { shouldValidate: true });
                      }}
                      className={cn(
                        "block w-full overflow-hidden rounded-lg border text-left transition-colors",
                        selectedDentistId === dentist._id && !recommended
                          ? "border-primary-600 bg-primary-50"
                          : "border-black/10 hover:border-primary-200",
                      )}
                    >
                      <div className="flex gap-3 p-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-primary-50">
                          {dentist.profilePhoto && (
                            <Image
                              src={dentist.profilePhoto}
                              alt={`Portrait of ${dentist.name}`}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink-900">{dentist.name}</p>
                          <p className="text-xs text-ink-700">{dentist.role}</p>
                          <p className="mt-0.5 text-xs text-ink-700">
                            {dentist.experienceYears}+ years experience
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {dentist.specializations.slice(0, 2).map((tag) => (
                              <Badge key={tag} tone="neutral" className="px-2 py-0.5">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="block border-t border-black/5 bg-white px-3 py-2 text-center text-xs font-medium text-primary-600">
                        Book with {dentist.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </FormField>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Full Name" htmlFor="fullName" error={errors.fullName?.message}>
            <Input
              id="fullName"
              placeholder="Your name"
              invalid={!!errors.fullName}
              {...register("fullName")}
            />
          </FormField>
          <FormField label="Phone No." htmlFor="phone" error={errors.phone?.message}>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 00000 00000"
              invalid={!!errors.phone}
              {...register("phone")}
            />
          </FormField>
        </div>

        <FormField label="Email (optional)" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            invalid={!!errors.email}
            {...register("email")}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Date" htmlFor="date" error={errors.date?.message}>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  id="date"
                  selected={field.value}
                  onChange={field.onChange}
                  minDate={new Date()}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="DD-MM-YYYY"
                  disabled={!selectedDentistId}
                  className="w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/50 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none disabled:opacity-50"
                />
              )}
            />
          </FormField>
          <FormField label="Time" htmlFor="time" error={errors.time?.message}>
            <div className="relative">
              <Select
                id="time"
                defaultValue=""
                disabled={
                  !selectedDate ||
                  !selectedTreatment ||
                  !selectedDentistId ||
                  slotsLoading ||
                  slots.length === 0
                }
                {...register("time")}
              >
                <option value="" disabled>
                  {timePlaceholder}
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

        <FormField
          label={
            selectedTreatment === "Other"
              ? "Please describe your treatment need or concern"
              : "Additional Notes (optional)"
          }
          htmlFor="notes"
          error={errors.notes?.message}
        >
          <Textarea
            id="notes"
            placeholder={
              selectedTreatment === "Other"
                ? "Tell us what's going on so we can prepare for your visit..."
                : "Any concerns, past history, or preferences..."
            }
            invalid={!!errors.notes}
            {...register("notes")}
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Sending…" : "Book Appointment"}
        </Button>

        <Reveal delay={0.1}>
          <motion.div whileHover={buttonHover} whileTap={buttonTap}>
            <Button
              href={getWhatsappLink(WHATSAPP_APPOINTMENT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              className="w-full"
            >
              <WhatsAppIcon size={18} />
              Book via WhatsApp
            </Button>
          </motion.div>
        </Reveal>

        <p className="text-center text-xs text-ink-700">
          Your information is kept private and used only to contact you.
        </p>
      </form>
    </Card>
  );
}
