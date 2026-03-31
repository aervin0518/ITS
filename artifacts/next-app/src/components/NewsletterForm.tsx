"use client";

interface NewsletterFormProps {
  variant?: "light" | "dark";
}

export default function NewsletterForm({ variant = "light" }: NewsletterFormProps) {
  const isDark = variant === "dark";
  return (
    <form
      className="flex flex-col sm:flex-row gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        className={`flex-1 border px-4 py-3 text-sm font-sans focus:outline-none rounded ${
          isDark
            ? "bg-stone-800 border-stone-700 text-white placeholder-stone-500 focus:border-navy-400"
            : "bg-white border-stone-300 text-stone-800 focus:border-navy-400 focus:ring-1 focus:ring-navy-400"
        }`}
      />
      <button type="submit" className="btn-primary whitespace-nowrap">
        Subscribe
      </button>
    </form>
  );
}
