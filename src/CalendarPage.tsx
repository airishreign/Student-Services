import { useState } from "react";
import { CalendarEvent, FormApplication, Role, FORM_LABELS } from "./types";
import { Btn, Card, PageTitle } from "./components";
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react";

export function CalendarPage({
  events,
  forms,
  role,
}: {
  events: CalendarEvent[];
  forms: FormApplication[];
  role: Role;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const eventsByDate: Record<string, CalendarEvent[]> = {};
  events.forEach((ev) => {
    const d = ev.date.slice(0, 10);
    if (!eventsByDate[d]) eventsByDate[d] = [];
    eventsByDate[d].push(ev);
  });

  // Add approved POA forms to calendar for all roles
  forms.forEach((f) => {
    if (f.type === "program_of_activities" && f.status === "approved") {
      const d = f.date;
      if (!eventsByDate[d]) eventsByDate[d] = [];
      // Check if this POA event already exists in calendar
      const eventExists = eventsByDate[d].some((ev) => ev.formId === f.id);
      if (!eventExists) {
        eventsByDate[d].push({
          id: `poa-${f.id}`,
          title: f.details.activityName || "Program of Activities",
          date: d,
          type: "activity",
          org: f.details.venue || f.details.org,
          formId: f.id,
        });
      }
    }
  });

  if (role !== "STUDENT") {
    forms.forEach((f) => {
      if (f.status === "pending") {
        const d = f.date;
        if (!eventsByDate[d]) eventsByDate[d] = [];
        eventsByDate[d].push({ id: f.id, title: `${FORM_LABELS[f.type]} (${f.studentName})`, date: d, type: "deadline", formId: f.id });
      }
    });
  }

  // Get upcoming events sorted by date
  const allEvents = Object.entries(eventsByDate)
    .flatMap(([date, dateEvents]) => dateEvents.map((ev) => ({ ...ev, dateStr: date })))
    .sort((a, b) => new Date(a.dateStr).getTime() - new Date(b.dateStr).getTime());

  const upcomingEvents = allEvents.filter((ev) => new Date(ev.dateStr) >= today);

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const selectedDateEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
      <div>
        <PageTitle>Calendar of Activities</PageTitle>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Btn size="sm" variant="outline" onClick={() => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); }}><ChevronLeft size={16} /></Btn>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1a7a4a" }}>{monthNames[month]} {year}</span>
            <Btn size="sm" variant="outline" onClick={() => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); }}><ChevronRight size={16} /></Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "#4b7a62", padding: "4px 0" }}>{d}</div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayEvents = eventsByDate[dateStr] ?? [];
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = selectedDate === dateStr;
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    minHeight: 80,
                    border: `2px solid ${isSelected ? "#1a7a4a" : isToday ? "#1a7a4a" : "#e6f5ee"}`,
                    borderRadius: 8,
                    padding: "6px 6px",
                    background: isSelected ? "#d4e8df" : isToday ? "#e6f5ee" : "#fff",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    if (!isSelected && !isToday) {
                      target.style.borderColor = "#4b7a62";
                      target.style.background = "#f0f9f6";
                    }
                  }}
                  onMouseOut={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    if (!isSelected && !isToday) {
                      target.style.borderColor = "#e6f5ee";
                      target.style.background = "#fff";
                    }
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: isToday || isSelected ? 800 : 600, color: isToday || isSelected ? "#1a7a4a" : "#1a1a1a", marginBottom: 4 }}>{day}</div>
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                    {dayEvents.length > 0 ? (
                      dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          style={{
                            background: ev.type === "activity" ? "#1a7a4a" : ev.type === "deadline" ? "#d97706" : "#0369a1",
                            color: "#fff",
                            borderRadius: 4,
                            fontSize: 10,
                            padding: "3px 5px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            wordBreak: "break-word",
                            lineHeight: 1.3,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                          title={ev.title}
                          onMouseOver={(e) => {
                            const target = e.currentTarget as HTMLDivElement;
                            target.style.opacity = "0.8";
                            target.style.transform = "scale(1.02)";
                          }}
                          onMouseOut={(e) => {
                            const target = e.currentTarget as HTMLDivElement;
                            target.style.opacity = "1";
                            target.style.transform = "scale(1)";
                          }}
                        >
                          {ev.type === "activity" ? <Calendar size={10} /> : ev.type === "deadline" ? <Clock size={10} /> : <User size={10} />}
                          {ev.title.length > 25 ? `${ev.title.slice(0, 22)}...` : ev.title}
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 10, color: "#ccc", fontStyle: "italic" }}></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
            {[{ color: "#1a7a4a", label: "Activity" }, { color: "#d97706", label: "Deadline/Form" }, { color: "#0369a1", label: "Counseling" }].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <div style={{ width: 12, height: 12, background: l.color, borderRadius: 3 }} />
                <span style={{ color: "#4b7a62" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sidebar with selected date events and upcoming events */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Selected Date Events */}
        {selectedDate && (
          <Card>
            <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#1a7a4a" }}>
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </h3>
            {selectedDateEvents.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedDateEvents.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      background: ev.type === "activity" ? "#e6f5ee" : ev.type === "deadline" ? "#fef3c7" : "#eff6ff",
                      border: `1px solid ${ev.type === "activity" ? "#1a7a4a" : ev.type === "deadline" ? "#d97706" : "#0369a1"}`,
                      borderRadius: 6,
                      padding: "10px",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 12, color: ev.type === "activity" ? "#1a7a4a" : ev.type === "deadline" ? "#92400e" : "#1e40af", marginBottom: 4 }}>
                      {ev.type === "activity" ? "Activity" : ev.type === "deadline" ? "Form Submission" : "Counseling"}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 2 }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
                      Date: {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      {ev.time && <> • Time: {ev.time}</>}
                    </div>
                    {ev.venue && <div style={{ fontSize: 11, color: "#4b7a62", marginBottom: 4 }}>Venue: {ev.venue}</div>}
                    {ev.org && <div style={{ fontSize: 11, color: "#4b7a62", marginBottom: 4 }}>Organization: {ev.org}</div>}
                    {ev.formId && forms.find((f) => f.id === ev.formId?.replace("poa-", "")) && (() => {
                      const form = forms.find((f) => f.id === ev.formId?.replace("poa-", ""));
                      return form ? (
                        <div style={{ fontSize: 10, color: "#666", marginTop: 6, paddingTop: 6, borderTop: "1px solid #ddd" }}>
                          <div>Student: {form.studentName}</div>
                          {form.details.numberOfParticipants && <div>{form.details.numberOfParticipants} participants</div>}
                        </div>
                      ) : null;
                    })()}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>No events scheduled</div>
            )}
          </Card>
        )}

        {/* Upcoming Events */}
        <Card>
          <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#1a7a4a" }}>Upcoming Events</h3>
          {upcomingEvents.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }}>
              {upcomingEvents.map((ev) => {
                const eventDate = new Date(ev.dateStr + "T00:00:00");
                const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isToday = ev.dateStr === todayStr;
                const isTomorrow = daysUntil === 1;

                let dateLabel = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                if (isToday) dateLabel = "Today";
                if (isTomorrow) dateLabel = "Tomorrow";

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedDate(ev.dateStr)}
                    style={{
                      background: ev.type === "activity" ? "#e6f5ee" : ev.type === "deadline" ? "#fef3c7" : "#eff6ff",
                      border: `1px solid ${ev.type === "activity" ? "#1a7a4a" : ev.type === "deadline" ? "#d97706" : "#0369a1"}`,
                      borderRadius: 6,
                      padding: "9px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      const target = e.currentTarget as HTMLDivElement;
                      target.style.transform = "translateX(4px)";
                      target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                    onMouseOut={(e) => {
                      const target = e.currentTarget as HTMLDivElement;
                      target.style.transform = "translateX(0)";
                      target.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, color: ev.type === "activity" ? "#1a7a4a" : ev.type === "deadline" ? "#92400e" : "#1e40af", marginBottom: 3 }}>
                      {dateLabel}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: 9, color: "#666", marginBottom: 2 }}>
                      {ev.type === "activity" && "Activity"}
                      {ev.type === "deadline" && "Form Submission"}
                      {ev.type === "counseling" && "Counseling"}
                    </div>
                    {ev.time && <div style={{ fontSize: 9, color: "#666", marginBottom: 2 }}>Time: {ev.time}</div>}
                    {ev.venue && <div style={{ fontSize: 9, color: "#4b7a62", marginBottom: 2 }}>Venue: {ev.venue}</div>}
                    {ev.org && <div style={{ fontSize: 9, color: "#4b7a62" }}>Organization: {ev.org}</div>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>No upcoming events</div>
          )}
        </Card>
      </div>
    </div>
  );
}
