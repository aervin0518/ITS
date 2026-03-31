"use client";

const subjects = [
  "General Inquiry",
  "Research Inquiry",
  "Partnership",
  "Media",
  "Speaking Request",
];

export default function ContactForm() {
  return (
    <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">
            Full Name
          </label>
          <input
            type="text"
            required
            className="border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-sans text-stone-800 focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400 rounded"
            placeholder="Your full name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">
            Email Address
          </label>
          <input
            type="email"
            required
            className="border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-sans text-stone-800 focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400 rounded"
            placeholder="you@organization.org"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">
          Organization
        </label>
        <input
          type="text"
          className="border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-sans text-stone-800 focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400 rounded"
          placeholder="Your institution or organization (optional)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">
          Subject
        </label>
        <select className="border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-sans text-stone-800 focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400 rounded">
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500">
          Message
        </label>
        <textarea
          required
          rows={6}
          className="border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-sans text-stone-800 focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400 rounded resize-none"
          placeholder="How can we help you?"
        />
      </div>

      <div>
        <button type="submit" className="btn-primary">
          Send Message
        </button>
      </div>
    </form>
  );
}
