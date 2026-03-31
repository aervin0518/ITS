"use client";

import { motion } from "framer-motion";
import { LeadershipMember } from "@/types/leadership";

interface LeadershipCardProps {
  member: LeadershipMember;
  index?: number;
}

export default function LeadershipCard({ member, index = 0 }: LeadershipCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -3 }}
      className="relative bg-white border border-stone-200 rounded-xl p-6 overflow-hidden group cursor-default"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-navy-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col gap-4">
        <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-serif font-bold text-white">{member.initials}</span>
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-serif text-stone-900 mb-1">{member.name}</h3>
          <p
            className="font-sans font-semibold text-navy-500 uppercase tracking-[0.18em] mb-3"
            style={{ fontSize: "11px" }}
          >
            {member.role}
          </p>
          <p className="font-sans text-stone-500 leading-relaxed" style={{ fontSize: "14px" }}>
            {member.summary}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
