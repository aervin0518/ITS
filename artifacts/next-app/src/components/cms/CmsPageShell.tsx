"use client";

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: Action;
  children: React.ReactNode;
}

export default function CmsPageShell({ title, description, icon, action, children }: Props) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-[#152A4A]/10 flex items-center justify-center text-[#152A4A]">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-[#111114]">{title}</h1>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
          </div>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1E3A5F] transition-colors"
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
