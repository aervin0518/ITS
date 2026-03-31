import { Metric } from "@/types";

interface MetricCardProps {
  metric: Metric;
}

export default function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <span className="text-4xl md:text-5xl font-serif text-white leading-none">
        {metric.value}
      </span>
      <span className="text-xs font-sans font-medium tracking-wider uppercase text-stone-400">
        {metric.label}
      </span>
      {metric.description && (
        <span className="text-xs font-sans text-stone-500">{metric.description}</span>
      )}
    </div>
  );
}
