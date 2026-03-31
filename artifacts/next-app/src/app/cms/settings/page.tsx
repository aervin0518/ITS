import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CmsPageShell from "@/components/cms/CmsPageShell";
import { Settings, Link2, Shield, Mail } from "lucide-react";

export const metadata = { title: "Settings — I.T.S. CMS" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sections = [
    {
      title: "Integrations",
      icon: <Link2 size={18} />,
      items: [
        { label: "Jotform API", value: "Not configured", status: "warning" },
        { label: "Email (SMTP)", value: "Using Supabase default", status: "warning" },
        { label: "Power BI", value: "Not connected", status: "inactive" },
      ],
    },
    {
      title: "Security & Access",
      icon: <Shield size={18} />,
      items: [
        { label: "PII Masking", value: "Active (SSN & sensitive fields)", status: "active" },
        { label: "Row-Level Security", value: "Enabled via Supabase", status: "active" },
        { label: "Audit Logging", value: "Coming soon", status: "inactive" },
      ],
    },
    {
      title: "Email",
      icon: <Mail size={18} />,
      items: [
        { label: "Invitation emails", value: "Active", status: "active" },
        { label: "Password reset", value: "Active", status: "active" },
        { label: "Content approval alerts", value: "Coming soon", status: "inactive" },
      ],
    },
  ];

  const statusDot: Record<string, string> = {
    active: "bg-green-500",
    warning: "bg-amber-400",
    inactive: "bg-gray-300",
  };

  return (
    <CmsPageShell
      title="Settings"
      description="System configuration, integrations, and access control."
      icon={<Settings size={20} />}
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <span className="text-[#152A4A]">{section.icon}</span>
              <h2 className="font-semibold text-[#111114]">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {section.items.map((item) => (
                <div key={item.label} className="px-6 py-4 flex items-center justify-between">
                  <p className="text-sm text-[#111114]">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusDot[item.status]}`} />
                    <span className="text-sm text-gray-500">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Storage setup guide */}
        <div className="bg-[#152A4A]/5 border border-[#152A4A]/20 rounded-xl p-5">
          <p className="text-sm font-semibold text-[#152A4A] mb-2">Supabase Storage Setup Required</p>
          <p className="text-sm text-gray-600 mb-3">
            To enable Media Library and Transcript uploads, create these buckets in your Supabase project:
          </p>
          <div className="space-y-2">
            {[
              { bucket: "media", desc: "Images, PDFs, research documents, field videos", access: "Private" },
              { bucket: "transcripts", desc: "Interview transcripts (PDF, DOCX, TXT)", access: "Private" },
            ].map((b) => (
              <div key={b.bucket} className="bg-white rounded-lg px-4 py-3 flex items-center justify-between border border-gray-100">
                <div>
                  <code className="text-sm font-mono text-[#152A4A] font-bold">{b.bucket}</code>
                  <span className="text-sm text-gray-500 ml-2">— {b.desc}</span>
                </div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{b.access}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Supabase Dashboard → Storage → New Bucket. Set both as <strong>Private</strong>.
          </p>
        </div>
      </div>
    </CmsPageShell>
  );
}
