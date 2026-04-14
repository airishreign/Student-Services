import { useState, useCallback } from "react";
import { User, FormApplication } from "./types";
import { genId } from "./utils";
import { Input, Textarea, Btn, Card, PageTitle, Alert, Select } from "./components";

type FormFields = {
  email: string;
  organization: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  classification: string;
  purpose: string;
  names: string;
  vehicle: string;
  requestedBy: string;
  position: string;
};

const CLASSIFICATION_OPTIONS = [
  { value: "", label: "Select Classification" },
  { value: "alumni", label: "ALUMNI" },
  { value: "parents", label: "PARENTS" },
  { value: "speakers", label: "SPEAKERS/FACILITATORS/TRAINORS" },
  { value: "sponsors", label: "SPONSORS" },
  { value: "participants", label: "PARTICIPANTS FROM OTHER COLLEGES AND UNIVERSITIES" },
  { value: "community", label: "ADOPTED COMMUNITY" },
  { value: "other", label: "Other" },
];

export function ExternalGuestForm({
  user,
  onSubmit,
  onBack,
}: {
  user: User;
  onSubmit: (app: FormApplication) => void;
  onBack: () => void;
}) {
  const [fields, setFields] = useState<FormFields>({
    email: user.email,
    organization: user.org || "",
    title: "",
    date: "",
    time: "",
    venue: "",
    classification: "",
    purpose: "",
    names: "",
    vehicle: "",
    requestedBy: "",
    position: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((key: keyof FormFields) => (value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) setErrors((prev) => ({ ...prev, [key as string]: "" }));
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['email', 'organization', 'title', 'date', 'time', 'venue', 'classification', 'purpose', 'names', 'vehicle', 'requestedBy', 'position'];
    requiredFields.forEach((field) => {
      const value = fields[field as keyof FormFields];
      if (!value || typeof value === 'string' && !value.trim()) {
        newErrors[field] = `${field.toUpperCase().replace(/([A-Z])/g, ' $1')} required`;
      }
    });
    if (!fields.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Valid email required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields]);

  const handleSubmit = () => {
    if (!validateForm()) return;
    setSubmitting(true);

    const details: Record<string, any> = { ...fields };

    onSubmit({
      id: genId(),
      studentId: user.id,
      studentName: user.name,
      type: "external_guest",
      submittedAt: new Date().toISOString(),
      status: "pending",
      deanStatus: "pending",
      csaoStatus: "pending",
      studentServicesStatus: "pending",
      details,
      date: fields.date,
    });
    setDone(true);
  };

  if (done) {
    return (
      <Card style={{ maxWidth: 500, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16, fontWeight: 700, color: "#1a7a4a" }}>✓</div>
        <PageTitle>External Guest Form Submitted!</PageTitle>
        <p style={{ color: "#4b7a62", fontSize: 16, marginBottom: 24 }}>
          Track status in Tracking page.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn onClick={onBack}>Back to Forms</Btn>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <PageTitle>CSAO REQUEST TO ENTER THE CAMPUS</PageTitle>
      <Alert type="info">
        This form should be accomplished three (3 days) before the event.
      </Alert>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>
        The name, email, and photo associated with your Google account will be recorded when you submit this form.
      </p>
      <Alert type="info">* Indicates required question</Alert>

      <Card style={{ marginBottom: 24 }}>
        <Input label="Email *" type="email" id="email" value={fields.email} onChange={setField("email")} error={errors.email} required />
        <Input label="REQUESTING DEPARTMENT/ORGANIZATION *" id="org" value={fields.organization} onChange={setField("organization")} error={errors.organization} required />
        <Input label="TITLE OF ACTIVITY *" id="title" value={fields.title} onChange={setField("title")} error={errors.title} required />
        <Input label="Date(s) of Entry *" type="date" id="date" value={fields.date} onChange={setField("date")} error={errors.date} required />
        <Input label="Time *" type="time" id="time" value={fields.time} onChange={setField("time")} error={errors.time} required />
        <Input label="Venue(s) *" id="venue" value={fields.venue} onChange={setField("venue")} error={errors.venue} required />
        <Select label="CLASSIFICATION OF GUESTS *" id="classification" value={fields.classification} onChange={setField("classification")} options={CLASSIFICATION_OPTIONS} error={errors.classification} required />
        <Textarea label="PURPOSE *" id="purpose" value={fields.purpose} onChange={setField("purpose")} error={errors.purpose} placeholder="Describe purpose..." required />
        <Input label="NAME/S *" id="names" value={fields.names} onChange={setField("names")} error={errors.names} required />
        <Input label="VEHICLE TYPE/PLATE NUMBER *" id="vehicle" value={fields.vehicle} onChange={setField("vehicle")} error={errors.vehicle} placeholder="Ex. Honda Civic - DFA 1234" required />
        <Input label="REQUESTED BY AND POSITION *" id="requested" value={fields.requestedBy} onChange={setField("requestedBy")} error={errors.requestedBy} required />
      </Card>

      <Card>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Btn>
          <Btn variant="outline" onClick={onBack} style={{ fontWeight: 600 }}>← Back to Forms</Btn>
        </div>
        <p style={{ fontSize: 12, color: "#666", marginTop: 16 }}>
          A copy of your responses will be emailed to {fields.email}.
        </p>
      </Card>
    </div>
  );
}

