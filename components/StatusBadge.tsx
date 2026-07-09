const STATUS_STYLES: Record<string, string> = {
  신청: "bg-amber-100 text-amber-800 ring-amber-200",
  접수: "bg-sky-100 text-sky-800 ring-sky-200",
  진행중: "bg-orange-100 text-orange-800 ring-orange-200",
  완료: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

const DEFAULT_STYLE = "bg-slate-100 text-slate-700 ring-slate-200";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.trim();
  const style = STATUS_STYLES[normalized] ?? DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {normalized || "—"}
    </span>
  );
}
