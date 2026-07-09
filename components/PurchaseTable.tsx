import type { PurchaseRow } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

interface PurchaseTableProps {
  rows: PurchaseRow[];
}

export function PurchaseTable({ rows }: PurchaseTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500">
        표시할 청구 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-gachon-blue text-left text-white">
            <tr>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">순번</th>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">재료명</th>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">구매사이트</th>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">옵션</th>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap text-center">수량</th>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap text-right">단가</th>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap text-right">총액</th>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap text-center">상태</th>
              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">물품수령확인</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, index) => (
              <tr
                key={`${row.순번}-${index}`}
                className="transition-colors hover:bg-slate-50/80"
              >
                <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{row.순번 || "—"}</td>
                <td className="px-4 py-3.5 font-medium text-slate-900">{row.재료명 || "—"}</td>
                <td className="px-4 py-3.5 max-w-[200px]">
                  {isUrl(row.구매사이트) ? (
                    <a
                      href={row.구매사이트.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gachon-accent underline-offset-2 hover:underline break-all"
                    >
                      {row.구매사이트}
                    </a>
                  ) : (
                    <span className="text-slate-600">{row.구매사이트 || "—"}</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-slate-600">{row.옵션 || "—"}</td>
                <td className="px-4 py-3.5 text-center text-slate-600 whitespace-nowrap">{row.수량 || "—"}</td>
                <td className="px-4 py-3.5 text-right text-slate-600 whitespace-nowrap">
                  {row.단가 ? `${formatCurrency(Number(String(row.단가).replace(/,/g, "")) || 0)}원` : "—"}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-slate-900 whitespace-nowrap">
                  {row.총액 > 0 ? `${formatCurrency(row.총액)}원` : "—"}
                </td>
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <StatusBadge status={row.상태} />
                </td>
                <td className="px-4 py-3.5 text-slate-600">
                  {isUrl(row.물품수령확인) ? (
                    <a
                      href={row.물품수령확인.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gachon-accent underline-offset-2 hover:underline break-all"
                    >
                      사진 보기
                    </a>
                  ) : (
                    row.물품수령확인 || "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
