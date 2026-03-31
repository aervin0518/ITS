import { LeadershipMember, TeamMember, CollaborationPartner } from "@/types/leadership";

export const leadershipMembers: LeadershipMember[] = [
  {
    id: "leader-001",
    name: "Gabriel Allen Ervin Sr.",
    role: "Founder & Executive Director",
    summary:
      "Leads the vision, strategy, and ecosystem development of I.T.S. Fatherhood, integrating fatherhood research, technology, and community-based programming.",
    initials: "GA",
  },
];

export const dataResearchTeam: TeamMember[] = [
  {
    id: "team-001",
    name: "Hema",
    role: "Data & Research Team",
    contribution:
      "Supports research coordination, data organization, and analysis workflow support.",
    initials: "HE",
  },
  {
    id: "team-002",
    name: "Akshat",
    role: "Data & Research Team",
    contribution:
      "Contributes to systems thinking, research infrastructure, and research support.",
    initials: "AK",
  },
  {
    id: "team-003",
    name: "Olena",
    role: "Data & Research Team",
    contribution:
      "Supports research administration, documentation, and program coordination.",
    initials: "OL",
  },
  {
    id: "team-004",
    name: "Justin",
    role: "Data & Research Team",
    contribution:
      "Contributes to data processing, analysis support, and research execution.",
    initials: "JU",
  },
];

export const collaborationPartners: CollaborationPartner[] = [
  {
    id: "collab-001",
    name: "Program Administration Support",
    description:
      "Supports communication, scheduling, follow-up, and outreach coordination.",
    category: "Operations",
  },
  {
    id: "collab-002",
    name: "Church & Community Partners",
    description: "Extends local engagement through trusted institutions.",
    category: "Community",
  },
  {
    id: "collab-003",
    name: "Fatherhood Program Support Partners",
    description:
      "Helps strengthen program delivery, mentoring support, and engagement strategy.",
    category: "Programs",
  },
  {
    id: "collab-004",
    name: "Research Engagement Support",
    description:
      "Assists with survey participation outreach and community-informed research support.",
    category: "Research",
  },
];
