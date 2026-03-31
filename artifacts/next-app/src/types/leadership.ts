export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  summary: string;
  initials: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contribution: string;
  initials: string;
}

export interface CollaborationPartner {
  id: string;
  name: string;
  description: string;
  category: string;
}
