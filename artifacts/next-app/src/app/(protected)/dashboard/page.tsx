import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Protected dashboard page.
 * Only accessible when authenticated (enforced by middleware.ts).
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">
          This is a protected page — only visible when authenticated.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Total Users", "Revenue", "Active Sessions"].map((label, i) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-gray-900">—</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
