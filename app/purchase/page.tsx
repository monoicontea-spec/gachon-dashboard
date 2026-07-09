import Link from "next/link";
import { PurchaseGrid } from "@/components/PurchaseGrid";
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
          학생별 구글 시트 공유 링크를 등록하고 청구 현황을 확인합니다.
        </p>
      </header>

      <main className="px-8 py-10 sm:px-12 lg:px-20">
        <PurchaseGrid students={STUDENTS} initialTotals={totals} />
      </main>
    </div>
  );
}
