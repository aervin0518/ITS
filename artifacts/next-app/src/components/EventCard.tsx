import { Event } from "@/types";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

function formatEventDate(dateStr: string): { month: string; day: string; year: string } {
  const date = new Date(dateStr + "T00:00:00");
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
  };
}

export default function EventCard({ event }: EventCardProps) {
  const { month, day, year } = formatEventDate(event.date);

  return (
    <article className="bg-white border border-stone-200 rounded-xl p-6 flex gap-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex-shrink-0 flex flex-col items-center justify-start w-14 pt-1">
        <span className="text-xs font-sans font-semibold uppercase tracking-wider text-navy-500">
          {month}
        </span>
        <span className="text-3xl font-serif text-stone-900 leading-none">{day}</span>
        <span className="text-xs font-sans text-stone-400">{year}</span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-base font-serif text-stone-900 leading-snug">{event.title}</h3>
        <p className="text-xs font-sans text-stone-500">
          {event.time} &middot; {event.location}
        </p>
        <p className="text-sm font-sans text-stone-600 leading-relaxed">{event.description}</p>
        {event.registrationUrl && (
          <Link
            href={event.registrationUrl}
            className="text-sm font-sans font-medium text-navy-500 hover:text-navy-700 transition-colors duration-200 mt-1 self-start"
          >
            Register →
          </Link>
        )}
      </div>
    </article>
  );
}
