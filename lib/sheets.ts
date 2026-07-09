import type { PurchaseRow, SheetData } from "./types";

const DEFAULT_SHEET_NAME =
  "[양식] 가천대 산디과 P학기 재료구매 청구서 (학번_이름) V3";
const DEFAULT_RANGE = "A7:I17";

interface GvizCell {
  v?: string | number | null;
  f?: string | number | null;
}

interface GvizResponse {
  table: {
    cols: { label: string }[];
    rows: { c: (GvizCell | null)[] }[];
  };
}

function getCellText(cell: GvizCell | null | undefined): string {
  if (!cell) return "";
  if (cell.f != null && cell.f !== "") return String(cell.f);
  if (cell.v != null && cell.v !== "") return String(cell.v);
  return "";
}

function getCellNumber(cell: GvizCell | null | undefined): number {
  if (!cell) return 0;
  if (typeof cell.v === "number") return cell.v;
  const raw = cell.f ?? cell.v;
  if (raw == null || raw === "") return 0;
  const parsed = Number(String(raw).replace(/,/g, ""));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parseGvizResponse(text: string): GvizResponse {
  const match = text.match(
    /google\.visualization\.Query\.setResponse\(([\s\S]+)\);?\s*$/
  );
  if (!match) {
    throw new Error("구글 시트 응답 형식을 파싱할 수 없습니다.");
  }
  return JSON.parse(match[1]) as GvizResponse;
}

function mapRow(cells: (GvizCell | null)[]): PurchaseRow {
  return {
    순번: getCellText(cells[0]),
    재료명: getCellText(cells[1]),
    구매사이트: getCellText(cells[2]),
    옵션: getCellText(cells[3]),
    수량: getCellText(cells[4]),
    단가: getCellText(cells[5]),
    총액: getCellNumber(cells[6]),
    상태: getCellText(cells[7]),
    물품수령확인: getCellText(cells[8]),
  };
}

function isDataRow(row: PurchaseRow): boolean {
  return Boolean(
    row.재료명 || row.구매사이트 || row.총액 > 0 || row.상태
  );
}

export async function fetchSheetData(spreadsheetId?: string): Promise<SheetData> {
  const id = spreadsheetId ?? process.env.SPREADSHEET_ID;
  if (!id) {
    throw new Error("SPREADSHEET_ID 환경 변수가 설정되지 않았습니다.");
  }

  const sheetName = process.env.SHEET_NAME ?? DEFAULT_SHEET_NAME;
  const range = process.env.SHEET_RANGE ?? DEFAULT_RANGE;

  const params = new URLSearchParams({
    tqx: "out:json",
    sheet: sheetName,
    range,
  });

  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?${params.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`구글 시트 데이터를 불러오지 못했습니다. (${response.status})`);
  }

  const text = await response.text();
  const parsed = parseGvizResponse(text);
  const rows = parsed.table.rows
    .map((row) => mapRow(row.c))
    .filter(isDataRow);

  const totalAmount = rows.reduce((sum, row) => sum + row.총액, 0);

  return {
    headers: parsed.table.cols.map((col) => col.label),
    rows,
    totalAmount,
    lastUpdated: new Date().toISOString(),
  };
}
