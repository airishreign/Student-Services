import { Card, PageTitle, Alert } from "./components";
import { Shirt, Calendar, School, Gavel, Users, HandHeart } from "lucide-react";

export function HandbookPage() {
    const sections = [
    {
      title: "Student Code of Conduct",
      icon: <Users size={24} strokeWidth={1.5} />,
      content: [
        "Every student is expected to uphold the Lasallian values of faith, service, and communion in community.",
        "Students must maintain academic integrity at all times. Any form of cheating, plagiarism, or academic dishonesty is strictly prohibited.",
        "Respectful conduct toward all members of the DLSL community is required at all times.",
      ],
    },
    {
      title: "Dress Code & Uniform Policy",
      icon: <Shirt size={24} strokeWidth={1.5} />,
      content: [
        "All students must wear the prescribed DLSL uniform on regular school days.",
        "PE uniform must only be worn during PE classes or school-sanctioned physical activities.",
        "Exceptions to the uniform policy require a properly approved Non-Uniform Form.",
      ],
    },
    {
      title: "Attendance Policy",
      icon: <Calendar size={24} strokeWidth={1.5} />,
      content: [
        "Students must maintain at least 80% attendance in each subject to be eligible for the final examination.",
        "Absences due to official school activities shall not be counted against the student provided proper documentation is submitted.",
        "Three consecutive absences without notice will require a parent/guardian conference.",
      ],
    },
    {
      title: "Use of Facilities",
      icon: <School size={24} strokeWidth={1.5} />,
      content: [
        "School facilities must be used for academic and school-sanctioned purposes only.",
        "Students must obtain proper permits before using school facilities for organizational activities.",
        "Any damage to school property is the responsibility of the student or organization involved.",
      ],
    },
    {
      title: "Disciplinary Procedures",
      icon: <Gavel size={24} strokeWidth={1.5} />,
      content: [
        "Minor offenses are subject to verbal warnings and guidance counseling.",
        "Major offenses are subject to formal investigation and may result in suspension or expulsion.",
        "Students have the right to be heard and present their side during disciplinary proceedings.",
      ],
    },
    {
      title: "Student Rights & Responsibilities",
      icon: <HandHeart size={24} strokeWidth={1.5} />,
      content: [
        "Students have the right to quality education, safe learning environment, and fair treatment.",
        "Students are responsible for contributing positively to the DLSL community.",
        "Active participation in student activities is encouraged but should not compromise academic performance.",
      ],
    },
  ];

  return (
    <div>
      <PageTitle>Student Handbook</PageTitle>
      <Alert type="info">
        This is a summary of the DLSL Student Handbook. For the complete handbook, please visit the CSAO office or request a printed copy.
      </Alert>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {sections.map((s) => (
          <Card key={s.title}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <h3 style={{ margin: 0, fontSize: 15, color: "#1a7a4a", fontWeight: 700 }}>{s.title}</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {s.content.map((c, i) => (
                <li key={i} style={{ color: "#374151", fontSize: 13, lineHeight: 1.7, marginBottom: 4 }}>{c}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
