import Link from "next/link";
import { PurchaseTable } from "@/components/PurchaseTable";
import { fetchSheetData } from "@/lib/sheets";
import type { SheetData } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

interface DashboardViewProps {
  studentName: string;
  spreadsheetId?: string;
}

export async function DashboardView({
  studentName,
  spreadsheetId,
}: DashboardViewProps) {
  let data: SheetData | undefined;
  let errorMessage: string | null = null;

  try {
    data = await fetchSheetData(spreadsheetId);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "데이터를 불러오는 중 오류가 발생했습니다.";
  }

  const completedCount =
    data?.rows.filter((row) => row.상태.trim() === "완료").length ?? 0;
  const inProgressCount =
    data?.rows.filter((row) =>
      ["접수", "진행중"].includes(row.상태.trim())
    ).length ?? 0;

  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-gachon-blue/20 bg-gachon-blue text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/purchase"
            className="inline-flex w-fit items-center gap-1 text-sm text-blue-100/80 transition hover:text-white"
          >
            ← 구매신청으로 돌아가기
          </Link>
          <p className="text-sm font-medium text-blue-100">가천대학교 산업디자인학과</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {studentName} · 재료구매 청구 대시보드
          </h1>
          <p className="max-w-2xl text-sm text-blue-100/90">
            구글 시트와 연동된 재료구매 청구 현황을 한눈에 확인할 수 있습니다.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">
            <p className="font-semibold">데이터를 불러올 수 없습니다</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>
        ) : (
          <>
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-xl border border-gachon-blue/10 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-2">
                <p className="text-sm font-medium text-slate-500">현재 청구 총액</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-gachon-blue">
                  {formatCurrency(data!.totalAmount)}
                  <span className="ml-1 text-2xl font-semibold">원</span>
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  마지막 갱신: {formatDateTime(data!.lastUpdated)}
                </p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">청구 항목 수</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {data!.rows.length}
                  <span className="ml-1 text-lg font-medium text-slate-500">건</span>
                </p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">처리 현황</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                    완료 {completedCount}
                  </span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-700">
                    진행 {inProgressCount}
                  </span>
                </div>
              </article>
            </section>

            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">청구 내역</h2>
                <p className="mt-1 text-sm text-slate-500">
                  구글 시트에서 실시간으로 불러온 재료구매 청구 목록입니다.
                </p>
              </div>
              <PurchaseTable rows={data!.rows} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
