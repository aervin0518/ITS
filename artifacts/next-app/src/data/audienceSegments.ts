export interface AudienceSegment {
  id: string;
  name: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  icon: string;
}

export const audienceSegments: AudienceSegment[] = [
  {
    id: "fathers",
    name: "Fathers",
    title: "For Fathers",
    description:
      "Join the MetaDAD cohort model — a structured mentorship and accountability experience built to activate your full potential as a father.",
    ctaText: "Join MetaDAD",
    ctaHref: "/metadad",
    icon: "User",
  },
  {
    id: "youth",
    name: "Youth",
    title: "For Youth & Families",
    description:
      "The platform tracks outcomes across the family system — including child development indicators that show the measurable impact of engaged fatherhood.",
    ctaText: "See the Research",
    ctaHref: "/research",
    icon: "Users",
  },
  {
    id: "churches",
    name: "Churches",
    title: "For Faith Communities",
    description:
      "Deploy the I.T.S. platform model inside your congregation. We provide the infrastructure, curriculum, and outcome tracking — you provide the community.",
    ctaText: "Become a Partner",
    ctaHref: "/partners",
    icon: "Building",
  },
  {
    id: "schools",
    name: "Schools",
    title: "For Schools & Districts",
    description:
      "Partner with us to activate father engagement in your school community — with data protocols that connect father involvement to student outcomes.",
    ctaText: "Partner With Us",
    ctaHref: "/partners",
    icon: "GraduationCap",
  },
  {
    id: "community-partners",
    name: "Community Partners",
    title: "For Community Organizations",
    description:
      "License the platform model for your community. We offer deployment support, training, data infrastructure, and ongoing research collaboration.",
    ctaText: "Explore Deployment",
    ctaHref: "/partners",
    icon: "Network",
  },
  {
    id: "funders",
    name: "Funders & Researchers",
    title: "For Funders & Researchers",
    description:
      "Access longitudinal data, outcome frameworks, and a research-grade intelligence platform that makes fatherhood investment measurable and defensible.",
    ctaText: "Explore the Data",
    ctaHref: "/research",
    icon: "BarChart3",
  },
];
