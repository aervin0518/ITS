import { Program } from "@/types";

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <article className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div>
        <h3 className="text-xl font-serif text-stone-900 mb-1">{program.name}</h3>
        <p className="text-sm font-sans italic text-stone-500">{program.tagline}</p>
      </div>

      <p className="text-sm font-sans text-stone-700 leading-relaxed">{program.description}</p>

      <div>
        <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500 mb-2">
          Key Outcomes
        </h4>
        <ul className="flex flex-col gap-1.5">
          {program.outcomes.map((outcome, i) => (
            <li key={i} className="text-sm font-sans text-stone-700 flex gap-2">
              <span className="text-navy-500 mt-0.5">—</span>
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs font-sans italic text-stone-400 border-t border-stone-100 pt-3">
        Evidence: {program.evidenceSummary}
      </p>
    </article>
  );
}
