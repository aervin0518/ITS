import { Program } from "@/types";

export const programs: Program[] = [
  {
    id: "prog-001",
    name: "MetaDad Virtual Mentorship",
    tagline: "Structured mentorship grounded in research, delivered through technology",
    description:
      "MetaDad pairs experienced fathers with younger and first-time fathers via a structured virtual mentorship platform. The program is informed by longitudinal research on father identity development and the demonstrated impact of peer support on parenting confidence. Each mentorship pairing follows a curriculum developed from our published findings on young father engagement and identity formation.",
    outcomes: [
      "87% reported increased parenting confidence after 12 weeks",
      "72% strengthened engagement with their children",
      "64% improved employment status during program participation",
    ],
    evidenceSummary:
      "Draws from the 2024 qualitative study on young father identity formation (pub-005) and longitudinal findings on peer support efficacy in fatherhood programming.",
  },
  {
    id: "prog-002",
    name: "The Father's Table",
    tagline: "Facilitated community dialogues informed by lived experience and data",
    description:
      "The Father's Table hosts recurring facilitated roundtable discussions where fathers, researchers, and practitioners come together to examine fatherhood research topics in depth. Each session is structured around a published research theme, creating a bridge between academic findings and lived community experience. The conversations generate insights that directly inform subsequent research directions and briefs.",
    outcomes: [
      "40+ sessions held in 6 cities since 2022",
      "Insights directly informed 3 published research briefs",
      "92% of participants rated sessions as highly valuable",
    ],
    evidenceSummary:
      "Developed from 2024 community listening sessions documented in The Father's Voice (pub-007), which identified peer dialogue as the most valued form of fatherhood support.",
  },
  {
    id: "prog-003",
    name: "Co-Parenting Support Circles",
    tagline: "Evidence-based workshops for healthier co-parenting relationships",
    description:
      "Co-Parenting Support Circles deliver structured workshops covering communication strategies, conflict resolution techniques, collaborative decision-making frameworks, and child-centered planning for co-parenting pairs. The 8-week curriculum is grounded in validated co-parenting research and adapted through community input from Father's Table sessions. Sessions are facilitated by trained practitioners using a strength-based, culturally responsive approach.",
    outcomes: [
      "78% reported improved communication after the 8-week series",
      "65% developed a written co-parenting plan by program completion",
      "Children of participants showed improved school attendance rates",
    ],
    evidenceSummary:
      "Grounded in the 2024 Insight on co-parenting dynamics (pub-004), which identified communication breakdown as the primary driver of disengagement in unmarried households.",
  },
];
