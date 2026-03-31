"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  leadershipMembers,
  dataResearchTeam,
  collaborationPartners,
} from "@/data/leadershipData";
import SectionHeader from "./SectionHeader";
import LeadershipCard from "./LeadershipCard";
import { InteractiveTeamTile, AccordionTeamTile } from "./InteractiveTeamTile";
import CollaborationPartnerItem from "./CollaborationPartnerItem";
import TeamDetailPanel from "./TeamDetailPanel";
import SectionCTA from "./SectionCTA";

export default function LeadershipResearchEcosystemSection() {
  const [selectedTeamId, setSelectedTeamId] = useState(dataResearchTeam[0]?.id);
  const selectedMember = dataResearchTeam.find((m) => m.id === selectedTeamId);

  return (
    <section className="section-padding bg-stone-50">
      <div className="container-narrow">
        <SectionHeader
          eyebrow="The Team That Powers Our Ecosystem"
          title="Leadership & Research Ecosystem"
          description="A collaborative team of leaders, researchers, and partners working together to advance fatherhood research and community programming."
        />

        <div className="flex flex-col gap-16">
          <div>
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-stone-400 mb-6">
              Tier 1 — Leadership Team
            </h3>
            <div
              className={
                leadershipMembers.length === 1
                  ? "max-w-2xl"
                  : "grid grid-cols-1 md:grid-cols-2 gap-6"
              }
            >
              {leadershipMembers.map((member, i) => (
                <LeadershipCard key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-stone-400 mb-6">
              Tier 2 — Data & Research Team
            </h3>

            <div className="hidden md:grid grid-cols-3 gap-6">
              <div className="col-span-2 grid grid-cols-2 gap-4">
                {dataResearchTeam.map((member, i) => (
                  <InteractiveTeamTile
                    key={member.id}
                    member={member}
                    isSelected={selectedTeamId === member.id}
                    onSelect={setSelectedTeamId}
                    index={i}
                  />
                ))}
              </div>
              <div>
                <AnimatePresence mode="wait">
                  {selectedMember && <TeamDetailPanel key={selectedMember.id} member={selectedMember} />}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
              {dataResearchTeam.map((member, i) => (
                <AccordionTeamTile key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-stone-400 mb-6">
              Tier 3 — Collaboration Partners
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaborationPartners.map((partner) => (
                <CollaborationPartnerItem key={partner.id} partner={partner} />
              ))}
            </div>
          </div>

          <SectionCTA />
        </div>
      </div>
    </section>
  );
}
