"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { StudentThumbnail } from "@/components/StudentThumbnail";
import {
  clearBudgetTotal,
  getBudgetTotal,
  saveBudgetTotal,
} from "@/lib/budget";
import type { Student } from "@/lib/students";
import { getRegistrations } from "@/lib/registrations";

interface PurchaseGridProps {
  students: Student[];
  initialTotals: Record<string, number | null>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function PurchaseGrid({ students, initialTotals }: PurchaseGridProps) {
  const [extraTotals, setExtraTotals] = useState<Record<string, number | null>>(
    {}
  );
  const [version, setVersion] = useState(0);
  const [budgetTotal, setBudgetTotal] = useState<number | null>(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [editingBudget, setEditingBudget] = useState(false);

  useEffect(() => {
    const syncRegistrations = () => setVersion((value) => value + 1);
    const syncBudget = () => {
      const saved = getBudgetTotal();
      setBudgetTotal(saved);
      setBudgetInput(saved != null ? String(saved) : "");
    };

    syncBudget();
    window.addEventListener("gachon-registrations-updated", syncRegistrations);
    window.addEventListener("storage", syncRegistrations);
    window.addEventListener("gachon-budget-updated", syncBudget);
    window.addEventListener("storage", syncBudget);

    return () => {
      window.removeEventListener(
        "gachon-registrations-updated",
        syncRegistrations
      );
      window.removeEventListener("storage", syncRegistrations);
      window.removeEventListener("gachon-budget-updated", syncBudget);
      window.removeEventListener("storage", syncBudget);
    };
  }, []);

  useEffect(() => {
    const registrations = getRegistrations().filter(
      (item) => item.type === "sheet"
    );

    const missing = registrations.filter(
      (item) =>
        !students.find(
          (student) => student.slug === item.slug && student.sheetConnected
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

  const requestTotal = useMemo(
    () =>
      students.reduce((sum, student) => {
        const amount = totals[student.slug];
        return sum + (typeof amount === "number" ? amount : 0);
      }, 0),
    [students, totals]
  );

  const remaining =
    budgetTotal != null ? budgetTotal - requestTotal : null;

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

  function handleBudgetSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = Number(String(budgetInput).replace(/,/g, "").trim());
    if (!Number.isFinite(parsed) || parsed < 0) return;
    saveBudgetTotal(parsed);
    setBudgetTotal(parsed);
    setEditingBudget(false);
  }

  return (
    <>
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

        <div className="mt-3 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-8">
              <h1 className="shrink-0 text-2xl font-light tracking-tight sm:text-3xl">
                구매신청
              </h1>

              <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
                      예산 총액
                    </p>
                    <button
                      type="button"
                      onClick={() => setEditingBudget((value) => !value)}
                      className="text-[10px] text-sky-300 transition hover:text-sky-200"
                    >
                      {editingBudget ? "닫기" : "입력"}
                    </button>
                  </div>
                  {editingBudget ? (
                    <form onSubmit={handleBudgetSubmit} className="mt-2 flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={budgetInput}
                        onChange={(event) => setBudgetInput(event.target.value)}
                        placeholder="예: 5000000"
                        className="w-full rounded-lg border border-white/15 bg-black px-2.5 py-1.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black"
                      >
                        저장
                      </button>
                    </form>
                  ) : (
                    <p className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {budgetTotal != null ? (
                        <>
                          {formatCurrency(budgetTotal)}
                          <span className="ml-0.5 text-sm font-medium text-white/45">
                            원
                          </span>
                        </>
                      ) : (
                        <span className="text-white/30">미입력</span>
                      )}
                    </p>
                  )}
                  {budgetTotal != null && !editingBudget && (
                    <button
                      type="button"
                      onClick={() => {
                        clearBudgetTotal();
                        setBudgetTotal(null);
                        setBudgetInput("");
                      }}
                      className="mt-1 text-[10px] text-white/30 transition hover:text-white/50"
                    >
                      초기화
                    </button>
                  )}
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
                    현재 신청 총액
                  </p>
                  <p className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {formatCurrency(requestTotal)}
                    <span className="ml-0.5 text-sm font-medium text-white/45">
                      원
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
                    잔액
                  </p>
                  <p
                    className={`mt-2 text-xl font-bold tracking-tight sm:text-2xl ${
                      remaining == null
                        ? "text-white/30"
                        : remaining >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                    }`}
                  >
                    {remaining != null ? (
                      <>
                        {formatCurrency(remaining)}
                        <span className="ml-0.5 text-sm font-medium text-white/45">
                          원
                        </span>
                      </>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-white/40">
              학생별 편집 가능 구글 시트 링크를 등록하고, 청구 현황 확인·수정을
              진행합니다. · 총 {students.length}명 · 시트 연결 {connectedCount}명
            </p>
          </div>
        </div>
      </header>

      <main className="px-8 py-10 sm:px-12 lg:px-20">
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
      </main>
    </>
  );
}
