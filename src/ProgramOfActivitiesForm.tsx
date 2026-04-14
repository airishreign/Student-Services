import { useState, useCallback } from "react";
import { User, FormApplication } from "./types";
import { genId } from "./utils";
import { Input, Textarea, Btn, Card, PageTitle, Alert, Select, FileInput } from "./components";

type FormFields = {
  email: string;
  organization: string;
  title: string;
  startDate: string;
  endDate: string;
  time: string;
  targetParticipants: string;
  targetNumber: string;
  estimatedCost: string;
  unsdg: string;
  rationale: string;
  objectives: string;
  mechanics: string;
  speakers: string;
  programFlow: string;
  budgetBreakdown: string;
  budgetCharging: string;
  facilitatorsList: string;
  attachments: File[];
  implementationType: string;
  venuePlatform: string;
  preparedBy: string;
  position: string;
};

const UNSDG_OPTIONS = [
  { value: "", label: "Select UNSDG" },
  { value: "No Poverty", label: "No Poverty" },
  { value: "Zero Hunger", label: "Zero Hunger" },
  { value: "Good Health and Well-being", label: "Good Health and Well-being" },
  // Add all 17 UNSDGs as needed - abbreviated here
  { value: "Peace, Justice and Strong Institutions", label: "Peace, Justice and Strong Institutions" },
  { value: "Partnerships for the Goals", label: "Partnerships for the Goals" },
];

const BUDGET_CHARGING_OPTIONS = [
  { value: "", label: "Select..." },
  { value: "CSAO Depository", label: "CSAO Depository" },
  { value: "Student Collection", label: "Student Collection" },
];

const IMPLEMENTATION_TYPE_OPTIONS = [
  { value: "", label: "Select Type..." },
  { value: "Online - Social Media Posting", label: "Online - Social Media Posting" },
  { value: "Google Meet", label: "Google Meet" },
  { value: "Zoom", label: "Zoom" },
  { value: "Face to Face", label: "Face to Face" },
];

export function ProgramOfActivitiesForm({
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
    startDate: "",
    endDate: "",
    time: "",
    targetParticipants: "",
    targetNumber: "",
    estimatedCost: "",
    unsdg: "",
    rationale: "",
    objectives: "",
    mechanics: "",
    speakers: "",
    programFlow: "",
    budgetBreakdown: "",
    budgetCharging: "",
    facilitatorsList: "",
    attachments: [],
    implementationType: "",
    venuePlatform: "",
    preparedBy: "",
    position: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback((key: keyof FormFields) => (value: string | File[]) => {
    setFields(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
  }, [errors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5); // Max 5
      setField('attachments')(files);
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const requiredFields = ['email', 'organization', 'title', 'startDate', 'endDate', 'time', 'targetParticipants', 'targetNumber', 'estimatedCost', 'unsdg', 'rationale', 'objectives', 'mechanics', 'speakers', 'programFlow', 'budgetBreakdown', 'budgetCharging', 'facilitatorsList', 'implementationType', 'venuePlatform', 'preparedBy', 'position'];

    requiredFields.forEach(field => {
      const value = fields[field as keyof FormFields];
      if (!value || typeof value === 'string' && ! (value as string).trim()) {
        newErrors[field as string] = `${field.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`;
      }
    });

    // Specific validations
    if (fields.startDate && fields.endDate && new Date(fields.startDate) > new Date(fields.endDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }
    if (!fields.targetNumber.match(/^\d+$/) || parseInt(fields.targetNumber) <= 0) {
      newErrors.targetNumber = "Valid positive number required";
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

    // Handle file uploads - convert to base64
    const filePromises = fields.attachments.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    const attachmentUrls = await Promise.all(filePromises);

    const formDetails: Record<string, any> = {
      ...fields,
      attachments: attachmentUrls,
      targetNumber: parseInt(fields.targetNumber),
    };

    onSubmit({
      id: genId(),
      studentId: user.id,
      studentName: user.name,
      type: "program_of_activities",
      submittedAt: new Date().toISOString(),
      status: "pending",
      deanStatus: "pending",
      csaoStatus: "pending",
      studentServicesStatus: "pending",
      details: formDetails,
      date: fields.startDate, // Use startDate as primary
    });

    setDone(true);
  };

  if (done) {
    return (
      <Card style={{ maxWidth: 500, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16, fontWeight: 700, color: "#1a7a4a" }}>✓</div>
        <PageTitle>POA Form Submitted!</PageTitle>
        <p style={{ color: "#4b7a62", fontSize: 16, marginBottom: 24 }}>
          A copy of your responses will be emailed to {user.email}. Track status in Tracking page.
        </p>
        <Btn onClick={onBack}>Back to Forms</Btn>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <PageTitle>CSAO Program of Activities</PageTitle>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>
        The name, email, and photo associated with your Google account will be recorded when you upload files and submit this form.
      </p>
      <Alert type="info">
        * Indicates required question
      </Alert>
      <Card style={{ marginBottom: 24 }}>
        <Input 
          label="Email *" 
          id="email" 
          type="email"
          value={fields.email} 
          onChange={setField("email")} 
          error={errors.email}
          required 
        />
        <Input 
          label="Name of Organization *" 
          id="organization" 
          value={fields.organization} 
          onChange={setField("organization")} 
          error={errors.organization}
          required 
        />
        <Input 
          label="Title of Activity *" 
          id="title" 
          value={fields.title} 
          onChange={setField("title")} 
          error={errors.title}
          required 
        />
        <Input 
          label="Start Date of Implementation *" 
          id="start-date" 
          type="date"
          value={fields.startDate} 
          onChange={setField("startDate")} 
          error={errors.startDate}
          required 
        />
        <Input 
          label="End Date of Implementation *" 
          id="end-date" 
          type="date"
          value={fields.endDate} 
          onChange={setField("endDate")} 
          error={errors.endDate}
          required 
        />
        <Input 
          label="Time of Implementation *" 
          id="time" 
          type="time"
          value={fields.time} 
          onChange={setField("time")} 
          error={errors.time}
          required 
        />
        <Input 
          label="Target Participants *" 
          id="target-participants" 
          value={fields.targetParticipants} 
          onChange={setField("targetParticipants")} 
          error={errors.targetParticipants}
          required 
        />
        <Input 
          label="Target Number of Participants *" 
          id="target-number" 
          type="number"
          value={fields.targetNumber} 
          onChange={setField("targetNumber")} 
          error={errors.targetNumber}
          placeholder="e.g. 150"
          required 
        />
        <Input 
          label="Estimated Activity Cost *" 
          id="estimated-cost" 
          type="number"
          value={fields.estimatedCost} 
          onChange={setField("estimatedCost")} 
          error={errors.estimatedCost}
          placeholder="e.g. 5000"
          required 
        />
        <Select
          label="UNSDG *"
          id="unsdg"
          value={fields.unsdg}
          onChange={setField("unsdg")}
          error={errors.unsdg}
          options={UNSDG_OPTIONS}
          required
        />
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, color: "#333" }}>Description & Mechanics</h3>
        <Textarea 
          label="Rationale/Brief Description *" 
          id="rationale" 
          value={fields.rationale} 
          onChange={setField("rationale")} 
          error={errors.rationale}
          placeholder="Briefly describe..."
          required 
        />
        <Textarea 
          label="Objectives *" 
          id="objectives" 
          value={fields.objectives} 
          onChange={setField("objectives")} 
          error={errors.objectives}
          required 
        />
        <Textarea 
          label="Mechanics/Guidelines *" 
          id="mechanics" 
          value={fields.mechanics} 
          onChange={setField("mechanics")} 
          error={errors.mechanics}
          required 
        />
        <Input 
          label="Name of Speakers: *" 
          id="speakers" 
          value={fields.speakers} 
          onChange={setField("speakers")} 
          error={errors.speakers}
          required 
        />
        <Textarea 
          label="Program Flow: *" 
          id="program-flow" 
          value={fields.programFlow} 
          onChange={setField("programFlow")} 
          error={errors.programFlow}
          required 
        />
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, color: "#333" }}>Budget & Participants</h3>
        <Textarea 
          label="Budget Breakdown *" 
          id="budget-breakdown" 
          value={fields.budgetBreakdown} 
          onChange={setField("budgetBreakdown")} 
          error={errors.budgetBreakdown}
          required 
        />
        <Select
          label="Budget Charging (CSAO Depository or Student Collection) *"
          id="budget-charging"
          value={fields.budgetCharging}
          onChange={setField("budgetCharging")}
          error={errors.budgetCharging}
          options={BUDGET_CHARGING_OPTIONS}
          required
        />
        <Textarea 
          label="List of Facilitators and Participants *" 
          id="facilitators-list" 
          value={fields.facilitatorsList} 
          onChange={setField("facilitatorsList")} 
          error={errors.facilitatorsList}
          required 
        />
        <FileInput 
          label="Letter of Invitation (If any) Sample Design/PubMaterial/Sample Video" 
          id="attachments" 
          onChange={(files: File[]) => setField('attachments')(files)}
          accept=".pdf,.docx,.jpg,.jpeg,.png,.gif,.mp4,.webm"
          multiple={true}
        />
        {fields.attachments.length > 0 && (
          <p style={{ fontSize: 12, color: "#1a7a4a" }}>
            {fields.attachments.length} file(s) selected
          </p>
        )}
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, color: "#333" }}>Implementation</h3>
        <Select
          label="Type of Implementation (Online -Social Media Posting; Google Meet; Zoom etc)/Face to Face *"
          id="implementation-type"
          value={fields.implementationType}
          onChange={setField("implementationType")}
          error={errors.implementationType}
          options={IMPLEMENTATION_TYPE_OPTIONS}
          required
        />
        <Input 
          label="Venue/Platform *" 
          id="venue-platform" 
          value={fields.venuePlatform} 
          onChange={setField("venuePlatform")} 
          error={errors.venuePlatform}
          required 
        />
      </Card>

      <Card>
        <Input 
          label="Prepared by: *" 
          id="prepared-by" 
          value={fields.preparedBy} 
          onChange={setField("preparedBy")} 
          error={errors.preparedBy}
          required 
        />
        <Input 
          label="Position/Designation *" 
          id="position" 
          value={fields.position} 
          onChange={setField("position")} 
          error={errors.position}
          required 
        />
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
