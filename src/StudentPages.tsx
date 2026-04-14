import { useState, useEffect } from "react";
import { User, CounselorSchedule, ActivityEvaluation, CalendarEvent } from "./types";
import { genId, validate, statusBadge } from "./utils";
import { Input, Select, Textarea, Btn, Card, PageTitle, Alert } from "./components";

// ─── Counselor Page ───────────────────────────────────────────────────────────

export function CounselorPage({
  user,
  schedules,
  onSubmit,
}: {
  user: User;
  schedules: CounselorSchedule[];
  onSubmit: (s: CounselorSchedule) => void;
}) {
  const [fields, setFields] = useState({ date: "", time: "", concern: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: string) => (v: string) => setFields((f) => ({ ...f, [k]: v }));
  const mySchedules = schedules.filter((s) => s.studentId === user.id);
  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

  const handleSubmit = () => {
    const errs = validate(fields, { date: "required", time: "required", concern: "required" });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const conflict = schedules.find((s) => s.date === fields.date && s.time === fields.time && s.status !== "cancelled");
    if (conflict) { setErrors((e) => ({ ...e, time: "This slot is already taken. Please choose another time." })); return; }
    onSubmit({ id: genId(), studentId: user.id, studentName: user.name, date: fields.date, time: fields.time, concern: fields.concern, status: "pending" });
    setFields({ date: "", time: "", concern: "" });
    setDone(true);
  };

  return (
    <div>
      <PageTitle>Schedule Counselor Appointment</PageTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <Card>
          <h3 style={{ margin: "0 0 14px", color: "#1a7a4a" }}>Book an Appointment</h3>
          {done && <Alert type="success">Appointment request submitted! The counselor will confirm your schedule.</Alert>}
          <Alert type="info">Appointments are with the College Guidance and Counseling Center. Sessions are strictly confidential.</Alert>
          <Input label="Preferred Date" id="cs-date" type="date" value={fields.date} onChange={set("date")} error={errors.date} required />
          <Select
            label="Preferred Time"
            id="cs-time"
            value={fields.time}
            onChange={set("time")}
            error={errors.time}
            options={availableTimes.map((t) => ({ value: t, label: t }))}
            required
          />
          <Textarea label="Nature of Concern" id="cs-concern" value={fields.concern} onChange={set("concern")} error={errors.concern} placeholder="Briefly describe your concern (kept confidential)..." required />
          <Btn onClick={handleSubmit} fullWidth>Request Appointment</Btn>
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 14px", color: "#1a7a4a" }}>My Appointments</h3>
          {mySchedules.length === 0 && <p style={{ color: "#4b7a62", fontSize: 13 }}>No appointments yet.</p>}
          {mySchedules.map((s) => (
            <div key={s.id} style={{ padding: "10px 0", borderBottom: "1px solid #e6f5ee" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.date} · {s.time}</div>
                  <div style={{ color: "#4b7a62", fontSize: 12, marginTop: 2 }}>{s.concern.slice(0, 60)}...</div>
                </div>
                {statusBadge(s.status)}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Evaluation Page ──────────────────────────────────────────────────────────

export function EvaluationPage({
  user,
  evaluations,
  events,
  onSubmit,
}: {
  user: User;
  evaluations: ActivityEvaluation[];
  events: CalendarEvent[];
  onSubmit: (e: ActivityEvaluation) => void;
}) {
  const [fields, setFields] = useState({ selectedEvent: "", activityName: "", date: "", overallRating: "", organization: "", relevance: "", comments: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: string) => (v: string) => setFields((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (fields.selectedEvent) {
      const event = events.find(e => e.id === fields.selectedEvent);
      if (event) {
        setFields(f => ({ ...f, activityName: event.title, date: event.date }));
      }
    } else {
      setFields(f => ({ ...f, activityName: "", date: "" }));
    }
  }, [fields.selectedEvent, events]);

  const handleSubmit = () => {
    const errs = validate(fields, { selectedEvent: "required", overallRating: "required,rating", organization: "required,rating", relevance: "required,rating", comments: "required" });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({
      id: genId(),
      studentId: user.id,
      studentName: user.name,
      activityName: fields.activityName,
      date: fields.date,
      overallRating: Number(fields.overallRating),
      organization: Number(fields.organization),
      relevance: Number(fields.relevance),
      comments: fields.comments,
      submittedAt: new Date().toISOString(),
    });
    setFields({ selectedEvent: "", activityName: "", date: "", overallRating: "", organization: "", relevance: "", comments: "" });
    setDone(true);
  };

  const RatingInput = ({ label, id, val, onChange, err }: { label: string; id: string; val: string; onChange: (v: string) => void; err?: string }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#1a7a4a", display: "block", marginBottom: 5 }}>
        {label} <span style={{ color: "#dc2626" }}>*</span>
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(String(n))}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: `2px solid ${val === String(n) ? "#1a7a4a" : "#c6e8d8"}`,
              background: val === String(n) ? "#1a7a4a" : "#fff",
              color: val === String(n) ? "#fff" : "#1a7a4a",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {n}
          </button>
        ))}
        <span style={{ fontSize: 12, color: "#4b7a62", alignSelf: "center" }}>(1=Poor, 5=Excellent)</span>
      </div>
      {err && <p style={{ color: "#dc2626", fontSize: 12, margin: "4px 0 0" }}>{err}</p>}
    </div>
  );

  const pastActivities = events.filter(e => e.type === "activity" && new Date(e.date) < new Date());

  return (
    <div>
      <PageTitle>Activity Evaluation</PageTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        <Card>
          <h3 style={{ margin: "0 0 14px", color: "#1a7a4a" }}>Evaluate an Activity</h3>
          {done && <Alert type="success">Thank you for your feedback! Your evaluation has been submitted.</Alert>}
          {pastActivities.length === 0 ? (
            <Alert type="info">No completed activities available for evaluation yet. Activities can only be evaluated after they have occurred.</Alert>
          ) : (
            <>
              <Select
                label="Select Activity to Evaluate"
                id="ev-event"
                value={fields.selectedEvent}
                onChange={set("selectedEvent")}
                error={errors.selectedEvent}
                options={[
                  { value: "", label: "Choose an activity..." },
                  ...pastActivities.map(e => ({ value: e.id, label: `${e.title} (${e.date})` }))
                ]}
                required
              />
              <Input label="Activity Name" id="ev-name" value={fields.activityName} onChange={set("activityName")} error={errors.activityName} disabled />
              <Input label="Activity Date" id="ev-date" type="date" value={fields.date} onChange={set("date")} error={errors.date} disabled />
              <RatingInput label="Overall Rating" id="ev-overall" val={fields.overallRating} onChange={set("overallRating")} err={errors.overallRating} />
              <RatingInput label="Organization & Preparation" id="ev-org" val={fields.organization} onChange={set("organization")} err={errors.organization} />
              <RatingInput label="Relevance to Students" id="ev-rel" val={fields.relevance} onChange={set("relevance")} err={errors.relevance} />
              <Textarea label="Comments / Suggestions" id="ev-comments" value={fields.comments} onChange={set("comments")} error={errors.comments} placeholder="Share your thoughts on the activity..." required />
              <Btn onClick={handleSubmit} fullWidth>Submit Evaluation</Btn>
            </>
          )}
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 14px", color: "#1a7a4a" }}>My Evaluations</h3>
          {evaluations.filter((e) => e.studentId === user.id).length === 0 && (
            <p style={{ color: "#4b7a62", fontSize: 13 }}>No evaluations submitted yet.</p>
          )}
          {evaluations.filter((e) => e.studentId === user.id).map((ev) => (
            <div key={ev.id} style={{ padding: "10px 0", borderBottom: "1px solid #e6f5ee" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{ev.activityName}</div>
              <div style={{ color: "#4b7a62", fontSize: 12 }}>{ev.date}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  {["Overall", "Org", "Rel"].map((l, i) => (
                  <span key={l} style={{ background: "#e6f5ee", color: "#1a7a4a", borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>
                    {l}: {i === 0 ? ev.overallRating : i === 1 ? ev.organization : ev.relevance}/5
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
