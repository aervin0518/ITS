"use client";

import { motion } from "framer-motion";
import { TeamMember } from "@/types/leadership";

interface TeamDetailPanelProps {
  member: TeamMember;
}

export default function TeamDetailPanel({ member }: TeamDetailPanelProps) {
  return (
    <motion.div
      key={member.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.28 }}
      className="bg-navy-50 border border-navy-100 rounded-xl p-6 flex flex-col gap-3"
      role="region"
      aria-live="polite"
      aria-label={`Details for ${member.name}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-navy-500 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-serif font-bold text-white">{member.initials}</span>
        </div>
        <div>
          <h4 className="text-lg font-serif text-stone-900">{member.name}</h4>
          <p
            className="font-sans font-semibold text-navy-500 uppercase tracking-[0.18em]"
            style={{ fontSize: "10px" }}
          >
            {member.role}
          </p>
        </div>
      </div>
      <p className="font-sans text-stone-600 leading-relaxed text-sm">{member.contribution}</p>
    </motion.div>
  );
}
