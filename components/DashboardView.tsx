"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PurchaseTable } from "@/components/PurchaseTable";
import { getRegistration } from "@/lib/registrations";
import {
  getSpreadsheetEditUrl,
  getSpreadsheetEmbedUrl,
} from "@/lib/sheetLinks";
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
  slug: string;
  studentName: string;
  spreadsheetId?: string;
  initialMode?: "view" | "edit";
}

export function DashboardView({
  slug,
  studentName,
  spreadsheetId: initialSpreadsheetId,
  initialMode = "view",
}: DashboardViewProps) {
  const [spreadsheetId, setSpreadsheetId] = useState<string | undefined>(
    initialSpreadsheetId
  );
  const [data, setData] = useState<SheetData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "edit">(initialMode);

  useEffect(() => {
    const sync = () => {
      const registered = getRegistration(slug, "sheet");
      setSpreadsheetId(registered?.resourceId ?? initialSpreadsheetId);
    };
    sync();
    window.addEventListener("gachon-registrations-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gachon-registrations-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug, initialSpreadsheetId]);

  useEffect(() => {
    if (!spreadsheetId) {
      setLoading(false);
      setErrorMessage("등록된 구글 시트가 없습니다. 구매신청 페이지에서 먼저 등록해 주세요.");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(
          `/api/sheets?spreadsheetId=${encodeURIComponent(spreadsheetId!)}`
        );
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? "시트 데이터를 불러오지 못했습니다.");
        }
        if (!cancelled) setData(payload as SheetData);
      } catch (error) {
        if (!cancelled) {
          setData(null);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "데이터를 불러오는 중 오류가 발생했습니다."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [spreadsheetId]);

  const completedCount = useMemo(
    () => data?.rows.filter((row) => row.상태.trim() === "완료").length ?? 0,
    [data]
  );
  const inProgressCount = useMemo(
    () =>
      data?.rows.filter((row) =>
        ["접수", "진행중"].includes(row.상태.trim())
      ).length ?? 0,
    [data]
  );

  const editUrl = spreadsheetId ? getSpreadsheetEditUrl(spreadsheetId) : null;
  const embedUrl = spreadsheetId
    ? getSpreadsheetEmbedUrl(spreadsheetId)
    : null;

  return (
    <div className="min-h-full bg-black text-white">
      <header className="border-b border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/purchase"
            className="inline-flex w-fit items-center gap-1 text-sm text-white/50 transition hover:text-white"
          >
            ← 구매신청으로 돌아가기
          </Link>
          <p className="text-sm font-medium text-white/50">가천대학교 산업디자인학과</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {studentName} · 재료구매 청구 대시보드
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/45">
                학생이 편집 권한으로 공유한 구글 시트에서 청구 현황 확인과 직접 수정이 가능합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMode("view")}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  mode === "view"
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                미리보기
              </button>
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  mode === "edit"
                    ? "border-orange-400 bg-orange-400 text-black"
                    : "border-orange-400/40 text-orange-300 hover:border-orange-400 hover:bg-orange-400/10"
                }`}
              >
                시트 수정
              </button>
              {editUrl && (
                <a
                  href={editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-sky-400/40 px-4 py-2 text-sm text-sky-300 transition hover:border-sky-300 hover:bg-sky-400/10"
                >
                  새 창에서 수정
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center text-white/45">
            시트 데이터를 불러오는 중...
          </div>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-300">
            <p className="font-semibold">데이터를 불러올 수 없습니다</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
            {editUrl && (
              <a
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex text-sm text-sky-300 underline-offset-2 hover:underline"
              >
                구글 시트 직접 열기 →
              </a>
            )}
          </div>
        ) : (
          <>
            <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:col-span-2 lg:col-span-2">
                <p className="text-sm font-medium text-white/45">현재 청구 총액</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-white">
                  {formatCurrency(data!.totalAmount)}
                  <span className="ml-1 text-2xl font-semibold">원</span>
                </p>
                <p className="mt-3 text-xs text-white/30">
                  마지막 갱신: {formatDateTime(data!.lastUpdated)}
                </p>
              </article>

              <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-medium text-white/45">청구 항목 수</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {data!.rows.length}
                  <span className="ml-1 text-lg font-medium text-white/45">건</span>
                </p>
              </article>

              <article className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-medium text-white/45">처리 현황</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-medium text-emerald-400">
                    완료 {completedCount}
                  </span>
                  <span className="rounded-full bg-orange-500/15 px-3 py-1 font-medium text-orange-400">
                    진행 {inProgressCount}
                  </span>
                </div>
              </article>
            </section>

            {mode === "edit" && embedUrl ? (
              <section className="mb-8">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">시트 직접 수정</h2>
                    <p className="mt-1 text-sm text-white/45">
                      학생이 편집 권한으로 공유한 시트입니다. 아래에서 바로 수정하거나
                      새 창에서 구글 시트를 열어 편집할 수 있습니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
                  >
                    미리보기 새로고침
                  </button>
                </div>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white">
                  <iframe
                    title={`${studentName} 구글 시트 편집`}
                    src={embedUrl}
                    className="h-[70vh] w-full min-h-[560px]"
                  />
                </div>
              </section>
            ) : (
              <section>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">청구 내역</h2>
                    <p className="mt-1 text-sm text-white/45">
                      구글 시트에서 불러온 목록입니다. 수정이 필요하면 &quot;시트 수정&quot;을 눌러 주세요.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMode("edit")}
                    className="rounded-lg border border-orange-400/40 px-4 py-2 text-sm text-orange-300 transition hover:border-orange-400 hover:bg-orange-400/10"
                  >
                    시트 내용 수정하기
                  </button>
                </div>
                <PurchaseTable rows={data!.rows} />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
