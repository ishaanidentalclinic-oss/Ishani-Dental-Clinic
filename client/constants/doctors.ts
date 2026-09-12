import type { Doctor } from "@/types";

export const DOCTORS: Doctor[] = [
  {
    id: "raghavendra-medikeri",
    name: "Dr. Raghavendra S Medikeri",
    role: "Founder & CEO — Periodontist & Implantologist",
    photo: "/images/doctors/dr-raghavendra-medikeri.jpg",
    experience: "19+ years experience",
    credentials: [
      "BDS — Bapuji Dental College, Davangere",
      "MDS — A.B. Shetty Dental College Hospital, Mangalore",
      "5 patents & 2 copyrights · Professor, Sinhgad Dental College",
      "Maharashtra Prerna Award (2025)",
    ],
    tags: ["Periodontal Therapy", "Lasers", "Dental Implants"],
  },
  {
    id: "manjushri-w",
    name: "Dr. Manjushri W",
    role: "Oral Physician & Radiologist",
    photo: "/images/doctors/dr-manjushri-w.jpg",
    experience: "15+ years experience",
    credentials: [
      "BDS — KLE Dental College",
      "MDS — P.M.N.M. Dental College Hospital, Karnataka",
      "Professor, Sinhgad Dental College",
      "Active research grants & journal publications",
    ],
    tags: ["Oral Medicine", "Radiology", "TMJ Disorders"],
  },
];
