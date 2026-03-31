import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import EventCard from "@/components/EventCard";
import NewsCard from "@/components/NewsCard";
import { events } from "@/data/events";
import { newsPosts } from "@/data/news";

export const metadata: Metadata = {
  title: "News & Events",
};

export default function NewsEventsPage() {
  return (
    <>
      <div className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">News & Events</h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl">
            Research updates, program milestones, upcoming events, and opportunities to engage
            with the I.T.S. Fatherhood Research Center community.
          </p>
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Join us for research symposia, community dialogues, and program workshops."
            className="mb-10"
          />
          <div className="flex flex-col gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-stone-50 divider">
        <div className="container-narrow">
          <SectionHeading
            title="Latest News"
            subtitle="Research releases, program updates, and media coverage."
            className="mb-10"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsPosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
