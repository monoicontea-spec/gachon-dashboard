import Link from "next/link";
import type { StudentSheet } from "@/lib/students";

interface StudentThumbnailProps {
  student: StudentSheet;
  index: number;
}

export function StudentThumbnail({ student, index }: StudentThumbnailProps) {
  const content = (
    <>
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="text-xs font-medium tracking-widest text-white/30">
          {String(index + 1).padStart(2, "0")}
        </span>
        {student.connected && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
            연결됨
          </span>
        )}
      </div>

      <div className="mb-6 aspect-[4/3] rounded-lg border border-white/8 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4">
        <div className="flex h-full flex-col justify-between">
          <div className="space-y-2">
            <div className="h-1.5 w-12 rounded-full bg-white/20" />
            <div className="h-1.5 w-full rounded-full bg-white/10" />
            <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
            <div className="h-1.5 w-3/5 rounded-full bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="h-6 rounded bg-white/5" />
            <div className="h-6 rounded bg-white/5" />
            <div className="h-6 rounded bg-white/5" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-white">
        {student.name}
      </h3>
      <p className="mt-1 text-sm text-white/40">
        {student.connected ? "재료구매 청구서" : "시트 연결 예정"}
      </p>
    </>
  );

  const className =
    "group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.06]";

  if (student.connected) {
    return (
      <Link href={`/students/${student.slug}`} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`${className} cursor-default opacity-50`}
      aria-disabled="true"
    >
      {content}
    </div>
  );
}
