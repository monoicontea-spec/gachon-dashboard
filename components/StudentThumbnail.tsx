import Link from "next/link";
import type { Student } from "@/lib/students";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

interface StudentThumbnailProps {
  student: Student;
  index: number;
  totalAmount?: number | null;
}

export function StudentThumbnail({
  student,
  index,
  totalAmount = null,
}: StudentThumbnailProps) {
  const hasTotal = totalAmount != null;
  const isActive = hasTotal && totalAmount > 0;

  const content = (
    <>
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="text-xs font-medium tracking-widest text-white/30">
          {String(index + 1).padStart(2, "0")}
        </span>
        {student.sheetConnected && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
            연결됨
          </span>
        )}
      </div>

      <div
        className={`relative mb-6 aspect-[4/3] overflow-hidden rounded-lg border p-4 ${
          isActive
            ? "border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-white/[0.04] to-transparent"
            : "border-white/8 bg-gradient-to-br from-white/[0.06] to-white/[0.02]"
        }`}
      >
        {hasTotal ? (
          <div className="flex h-full flex-col justify-between">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-white/35 uppercase">
              신청 총액
            </p>
            <div>
              <p className="text-2xl font-bold tracking-tight tabular-nums text-white sm:text-3xl">
                {formatCurrency(totalAmount)}
                <span className="ml-0.5 text-base font-medium text-white/50 sm:text-lg">
                  원
                </span>
              </p>
              {totalAmount === 0 && (
                <p className="mt-1 text-xs text-white/30">청구 항목 없음</p>
              )}
            </div>
            <div className="flex gap-1">
              <span
                className={`h-1 flex-1 rounded-full ${
                  isActive ? "bg-emerald-400/60" : "bg-white/10"
                }`}
              />
              <span className="h-1 w-8 rounded-full bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-white/25 uppercase">
              신청 총액
            </p>
            <p className="text-3xl font-light text-white/20">—</p>
            <p className="text-xs text-white/25">시트 연결 예정</p>
          </div>
        )}

        {isActive && (
          <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-emerald-400/10 blur-2xl" />
        )}
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-white">
        {student.name}
      </h3>
      <p className="mt-1 text-sm text-white/40">
        {student.sheetConnected ? "재료구매 청구서" : "시트 연결 예정"}
      </p>
    </>
  );

  const className =
    "group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.06]";

  if (student.sheetConnected) {
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
