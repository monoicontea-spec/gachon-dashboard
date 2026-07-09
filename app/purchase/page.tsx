import Link from "next/link";
import { StudentThumbnail } from "@/components/StudentThumbnail";
import { fetchSheetData } from "@/lib/sheets";
import { STUDENTS } from "@/lib/students";

async function fetchStudentTotals(): Promise<Record<string, number | null>> {
  const entries = await Promise.all(
    STUDENTS.map(async (student) => {
      if (!student.sheetConnected || !student.spreadsheetId) {
        return [student.slug, null] as const;
      }

      try {
        const data = await fetchSheetData(student.spreadsheetId);
        return [student.slug, data.totalAmount] as const;
      } catch {
        return [student.slug, null] as const;
      }
    })
  );

  return Object.fromEntries(entries);
}

export default async function PurchasePage() {
  const connectedCount = STUDENTS.filter((s) => s.sheetConnected).length;
  const totals = await fetchStudentTotals();

  return (
    <div className="min-h-full bg-black text-white">
      <header className="border-b border-white/8 px-8 py-8 sm:px-12 lg:px-20">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm text-white/40 transition hover:text-white/70"
        >
          ← 처음으로
        </Link>
        <p className="text-xs font-medium tracking-[0.3em] text-white/35 uppercase">
          Purchase Request
        </p>
        <h1 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl">
          구매신청
        </h1>
        <p className="mt-2 text-sm text-white/40">
          총 {STUDENTS.length}명 · 시트 연결 {connectedCount}명
        </p>
      </header>

      <main className="px-8 py-10 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {STUDENTS.map((student, index) => (
            <StudentThumbnail
              key={student.slug}
              student={student}
              index={index}
              totalAmount={totals[student.slug] ?? null}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
