interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-serif text-stone-900 leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-stone-500 font-sans text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-navy-500 mt-1" />
    </div>
  );
}
