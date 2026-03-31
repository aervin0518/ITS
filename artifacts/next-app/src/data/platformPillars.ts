export interface PlatformPillar {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  capabilities: string[];
  color: string;
}

export const platformPillars: PlatformPillar[] = [
  {
    id: "data",
    number: "01",
    name: "Data",
    tagline: "Measure what others ignore.",
    description:
      "We build and deploy community-based data collection systems — surveys, structured interviews, assessments — that generate the first real longitudinal fatherhood dataset at the community level.",
    capabilities: [
      "Longitudinal outcome tracking",
      "Community-based survey deployment",
      "Structured interview protocols",
      "Assessment and screening tools",
    ],
    color: "navy",
  },
  {
    id: "activation",
    number: "02",
    name: "Activation",
    tagline: "Turn insight into intervention.",
    description:
      "The MetaDAD cohort model is our primary activation layer — a research-backed mentorship system that converts data into structured, measurable interventions that improve father engagement and family stability.",
    capabilities: [
      "MetaDAD mentor/mentee cohort system",
      "Evidence-based curriculum delivery",
      "Cohort intake and outcome tracking",
      "Peer accountability structures",
    ],
    color: "amber",
  },
  {
    id: "technology",
    number: "03",
    name: "Technology",
    tagline: "Infrastructure that scales what works.",
    description:
      "We build the digital infrastructure to collect, analyze, and act on fatherhood data — including intake systems, dashboards, NLP-assisted pattern analysis, and partner-facing reporting tools.",
    capabilities: [
      "Survey intake and data pipeline",
      "Outcome dashboard infrastructure",
      "Partner reporting portal (roadmap)",
      "NLP-assisted insight extraction (roadmap)",
    ],
    color: "blue",
  },
  {
    id: "ecosystem",
    number: "04",
    name: "Ecosystem",
    tagline: "Deploy at the community level.",
    description:
      "No single organization can solve fatherhood absence. Our ecosystem model connects churches, schools, community orgs, civic partners, and funders into a coordinated, data-sharing network with shared outcome goals.",
    capabilities: [
      "Multi-site deployment protocols",
      "Church and school partnership models",
      "Funder intelligence and reporting",
      "Cross-site data comparison",
    ],
    color: "green",
  },
];

export interface HowItWorksStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "collect",
    step: "01",
    title: "Collect",
    description:
      "Deploy structured surveys, assessments, and interviews across community sites — generating real baseline and longitudinal data on father engagement, family stability, and child outcomes.",
  },
  {
    id: "analyze",
    step: "02",
    title: "Analyze",
    description:
      "Run incoming data through our outcome framework — surfacing patterns, identifying high-risk cohorts, tracking progress over time, and generating intelligence for both local teams and research partners.",
  },
  {
    id: "activate",
    step: "03",
    title: "Activate",
    description:
      "Deploy MetaDAD cohort interventions, guided by data insights. Match fathers with mentors. Run structured curriculum. Track engagement and outcomes at the individual and cohort level.",
  },
  {
    id: "improve",
    step: "04",
    title: "Improve",
    description:
      "Feed outcome data back into the system. Publish findings. Refine interventions. Share intelligence with ecosystem partners. Continuously improve what gets deployed across communities.",
  },
];
