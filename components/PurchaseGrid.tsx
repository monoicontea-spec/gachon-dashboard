"use client";

import { useEffect, useMemo, useState } from "react";
import { StudentThumbnail } from "@/components/StudentThumbnail";
import type { Student } from "@/lib/students";
import { getRegistrations } from "@/lib/registrations";

interface PurchaseGridProps {
  students: Student[];
  initialTotals: Record<string, number | null>;
}

export function PurchaseGrid({ students, initialTotals }: PurchaseGridProps) {
  const [extraTotals, setExtraTotals] = useState<Record<string, number | null>>(
    {}
  );
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const sync = () => setVersion((value) => value + 1);
    window.addEventListener("gachon-registrations-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gachon-registrations-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    const registrations = getRegistrations().filter(
      (item) => item.type === "sheet"
    );

    const missing = registrations.filter(
      (item) =>
        !students.find(
          (student) =>
            student.slug === item.slug && student.sheetConnected
        )
    );

    if (missing.length === 0) return;

    let cancelled = false;

    async function loadExtras() {
      const entries = await Promise.all(
        missing.map(async (item) => {
          try {
            const response = await fetch(
              `/api/sheets?spreadsheetId=${encodeURIComponent(item.resourceId)}`
            );
            if (!response.ok) return [item.slug, null] as const;
            const data = (await response.json()) as { totalAmount: number };
            return [item.slug, data.totalAmount] as const;
          } catch {
            return [item.slug, null] as const;
          }
        })
      );

      if (!cancelled) {
        setExtraTotals(Object.fromEntries(entries));
      }
    }

    void loadExtras();
    return () => {
      cancelled = true;
    };
  }, [students, version]);

  const totals = useMemo(
    () => ({ ...initialTotals, ...extraTotals }),
    [initialTotals, extraTotals]
  );

  const grandTotal = useMemo(
    () =>
      students.reduce((sum, student) => {
        const amount = totals[student.slug];
        return sum + (typeof amount === "number" ? amount : 0);
      }, 0),
    [students, totals]
  );

  const connectedCount = useMemo(() => {
    const registeredSlugs = new Set(
      getRegistrations()
        .filter((item) => item.type === "sheet")
        .map((item) => item.slug)
    );
    return students.filter(
      (student) => student.sheetConnected || registeredSlugs.has(student.slug)
    ).length;
  }, [students, version]);

  return (
    <>
      <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 sm:px-8">
        <p className="text-xs font-medium tracking-[0.25em] text-white/35 uppercase">
          Total Purchase Amount
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {new Intl.NumberFormat("ko-KR").format(grandTotal)}
            <span className="ml-1 text-xl font-medium text-white/50">원</span>
          </p>
          <p className="text-sm text-white/40">
            총 {students.length}명 · 시트 연결 {connectedCount}명
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {students.map((student, index) => (
          <StudentThumbnail
            key={student.slug}
            student={student}
            index={index}
            totalAmount={totals[student.slug] ?? null}
          />
        ))}
      </div>
    </>
  );
}
