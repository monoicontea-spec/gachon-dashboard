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
      <PurchaseGrid students={STUDENTS} initialTotals={totals} />
    </div>
  );
}
