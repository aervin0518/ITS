"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CollaborationPartner } from "@/types/leadership";

interface CollaborationPartnerItemProps {
  partner: CollaborationPartner;
}

function getCategoryStyles(category: string): string {
  switch (category) {
    case "Operations":
      return "bg-stone-100 text-stone-600";
    case "Community":
      return "bg-blue-50 text-navy-600";
    case "Programs":
      return "bg-navy-50 text-navy-700";
    case "Research":
      return "bg-stone-100 text-navy-600";
    default:
      return "bg-stone-100 text-stone-600";
  }
}

export default function CollaborationPartnerItem({ partner }: CollaborationPartnerItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`collab-${partner.id}`}
        className="w-full flex items-center gap-3 p-4 hover:bg-stone-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2"
      >
        <span
          className={`inline-block px-2.5 py-1 text-xs font-sans font-medium tracking-wider uppercase flex-shrink-0 rounded ${getCategoryStyles(partner.category)}`}
        >
          {partner.category}
        </span>
        <span className="flex-1 text-left font-serif text-sm text-stone-900">{partner.name}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.24 }}
          className="flex-shrink-0 text-stone-400"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`collab-${partner.id}`}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.24 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 font-sans text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
              {partner.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
