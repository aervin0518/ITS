import { Partner } from "@/types";

interface PartnerLogoProps {
  partner: Partner;
}

export default function PartnerLogo({ partner }: PartnerLogoProps) {
  return (
    <div className="bg-stone-100 border border-stone-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 min-h-[100px]">
      <span className="text-sm font-sans font-medium text-stone-600 text-center leading-snug">
        {partner.name}
      </span>
      <span className="text-xs font-sans text-stone-400 uppercase tracking-wider">
        {partner.type}
      </span>
    </div>
  );
}
