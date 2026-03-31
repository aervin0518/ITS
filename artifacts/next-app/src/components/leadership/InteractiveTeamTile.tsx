"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TeamMember } from "@/types/leadership";
import TeamDetailPanel from "./TeamDetailPanel";

interface InteractiveTeamTileProps {
  member: TeamMember;
  isSelected: boolean;
  onSelect: (id: string) => void;
  index?: number;
}

export function InteractiveTeamTile({
  member,
  isSelected,
  onSelect,
  index = 0,
}: InteractiveTeamTileProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => onSelect(member.id)}
      aria-pressed={isSelected}
      aria-label={`View details for ${member.name}`}
      className={`w-full text-left border rounded-xl p-4 flex items-center gap-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 ${
        isSelected
          ? "bg-navy-500 border-navy-500 text-white"
          : "bg-white border-stone-200 text-stone-800 hover:border-navy-300"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-serif font-bold text-sm ${
          isSelected ? "bg-navy-600 text-white" : "bg-stone-900 text-white"
        }`}
      >
        {member.initials}
      </div>
      <div className="flex-1">
        <p
          className={`font-serif text-sm font-medium leading-tight ${
            isSelected ? "text-white" : "text-stone-900"
          }`}
        >
          {member.name}
        </p>
        <p
          className={`font-sans text-xs mt-0.5 ${isSelected ? "text-navy-200" : "text-stone-500"}`}
        >
          Research
        </p>
      </div>
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          isSelected ? "bg-white" : "bg-transparent border border-stone-300"
        }`}
      />
    </motion.button>
  );
}

interface AccordionTeamTileProps {
  member: TeamMember;
  index?: number;
}

export function AccordionTeamTile({ member, index = 0 }: AccordionTeamTileProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="border border-stone-200 rounded-xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`accordion-${member.id}`}
        className="w-full flex items-center gap-3 p-4 hover:bg-stone-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2"
      >
        <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
          <span className="font-serif font-bold text-white text-sm">{member.initials}</span>
        </div>
        <div className="flex-1 text-left">
          <p className="font-serif text-sm font-medium text-stone-900">{member.name}</p>
          <p className="font-sans text-xs text-stone-500">{member.role}</p>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-stone-500 text-xl font-light leading-none"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`accordion-${member.id}`}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.24 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 font-sans text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
              {member.contribution}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
