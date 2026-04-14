import { useState, useCallback } from "react";
import { User, FormApplication } from "./types";
import { genId } from "./utils";
import { Input, Textarea, Btn, Card, PageTitle, Alert, Select, FileInput } from "./components";

type FormFields = {
  email: string;
  organization: string;
  title: string;
  date: string;
  type: string;
  justification: string;
  attire: string;
  effectivityDate: string;
  time: string;
  participantsList: string;
  poaFile: File[];
  requestedBy: string;
  position: string;
};

const TYPE_OPTIONS = [
  { value: "", label: "Select Type of Activity" },
  { value: "exhibit", label: "EXHIBIT" },
  { value: "meeting", label: "MEETING/ORIENTATION" },
  { value: "issue", label: "ISSUE ADVOCACY" },
  { value: "seminar", label: "SEMINAR/TALK/TRAINING" },
  { value: "performance", label: "PERFORMANCE" },
  { value: "contest", label: "CONTEST/COMPETITION" },
  { value: "community", label: "COMMUNITY INVOLVEMENT" },
  { value: "teambuilding", label: "TEAMBUILDING" },
  { value: "assembly", label: "GENERAL ASSEMBLY" },
  { value: "mass", label: "MASS/SPIRITUAL ACTIVITY" },
  { value: "publicity", label: "PUBLICITY/AWARENESS CAMPAIGN" },
  { value: "fundraising", label: "FUNDRAISING" },
  { value: "party", label: "ACQUITANCE PARTY" },
  { value: "other", label: "Other" },
];

const ATTIRE_OPTIONS = [
  { value: "", label: "Select Alternative Attire" },
  { value: "org-shirt", label: "ORGANIZATIONAL SHIRT" },
  { value: "business", label: "BUSINESS ATTIRE/CORPORATE ATTIRE" },
  { value: "casual", label: "CASUAL ATTIRE" },
  { value: "other", label: "Other" },
];

export function NonUniformForm({
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
    type: "",
    justification: "",
    attire: "",
    effectivityDate: "",
    time: "",
    participantsList: "",
    poaFile: [],
    requestedBy: "",
    position: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((key: keyof FormFields) => (value: string | File[]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    const errorKey = key as string;
    if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: "" }));
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const required = [
      'email', 'organization', 'title', 'date', 'type', 'justification', 
      'attire', 'effectivityDate', 'time', 'participantsList', 'requestedBy', 'position'
    ];
    required.forEach((field) => {
      const value = fields[field as keyof FormFields];
      if (!value || (typeof value === 'string' && !(value as string).trim())) {
        newErrors[field] = `${field.toUpperCase().replace('_', ' ')} required`;
      }
    });
    if (fields.poaFile.length === 0) {
      newErrors.poaFile = "Approved POA PDF required";
    }
    if (!fields.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Valid email required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields]);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    const filePromises = fields.poaFile.map((file) => 
      new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      })
    );
    const poaUrls = await Promise.all(filePromises);

    const details: Record<string, any> = {
      ...fields as any,
      poaFile: poaUrls,
    };

    onSubmit({
      id: genId(),
      studentId: user.id,
      studentName: user.name,
      type: "non_uniform",
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
        <PageTitle>Non-Uniform Form Submitted!</PageTitle>
        <p style={{ color: "#4b7a62", fontSize: 16, marginBottom: 24 }}>
          Track status in Tracking page.
        </p>
        <Btn onClick={onBack}>Back to Forms</Btn>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <PageTitle>CSAO REQUEST FOR NOT WEARING SCHOOL UNIFORM FOR ORGANIZATIONAL ACTIVITIES</PageTitle>
      <Alert type="info">
        Please take note of the following guidelines:<br/>
        1. Alternative attire should adhere to the dress code policy stated in the college student handbook<br/>
        2. Students who will not be capable of wearing the alternative attire stated in this request shall wear school uniform<br/>
        3. The request should be processed at least 3 days before the activity excluding Saturdays, Sundays and Holidays<br/>
        4. Requestor is the one responsible for the clear dissemination of information about the details of the approved request.
      </Alert>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>
        The name, email, and photo associated with your Google account will be recorded when you upload files and submit this form.
      </p>
      <Alert type="info">* Indicates required question</Alert>

      <Card style={{ marginBottom: 24 }}>
        <Input label="Email *" type="email" id="email" value={fields.email} onChange={setField("email")} error={errors.email} required />
        <Input label="NAME OF ORGANIZATION *" id="org" value={fields.organization} onChange={setField("organization")} error={errors.organization} required />
        <Input label="TITLE OF THE ACTIVITY *" id="title" value={fields.title} onChange={setField("title")} error={errors.title} required />
        <Input label="DATE OF ACTIVITY *" type="date" id="date" value={fields.date} onChange={setField("date")} error={errors.date} required />
        <Select label="TYPE OF ACTIVITY *" id="type" value={fields.type} onChange={setField("type")} options={TYPE_OPTIONS} error={errors.type} required />
        <Textarea label="JUSTIFICATION OF REQUEST *" id="justification" value={fields.justification} onChange={setField("justification")} error={errors.justification} required />
        <Select label="ALTERNATIVE ATTIRE *" id="attire" value={fields.attire} onChange={setField("attire")} options={ATTIRE_OPTIONS} error={errors.attire} required />
        <Input label="EFFECTIVITY DATE *" type="date" id="effectivity" value={fields.effectivityDate} onChange={setField("effectivityDate")} error={errors.effectivityDate} required />
        <Input label="TIME *" type="time" id="time" value={fields.time} onChange={setField("time")} error={errors.time} required />
        <Textarea label="LIST OF PARTICIPANTS *" id="participants" value={fields.participantsList} onChange={setField("participantsList")} error={errors.participantsList} required />
        <FileInput label="UPLOAD THE APPROVED POA *" id="poa-file" onChange={setField("poaFile")} accept=".pdf" />
        {errors.poaFile && <p style={{ color: "#dc2626", fontSize: 14 }}>{errors.poaFile}</p>}
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

