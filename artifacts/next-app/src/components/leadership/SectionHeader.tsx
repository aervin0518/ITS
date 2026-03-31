interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 mb-12">
      <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-navy-500">
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl font-serif text-stone-900">{title}</h2>
      <div className="w-16 h-0.5 bg-navy-500" />
      <p className="text-stone-500 font-sans text-base leading-relaxed max-w-2xl mt-1">
        {description}
      </p>
    </div>
  );
}
