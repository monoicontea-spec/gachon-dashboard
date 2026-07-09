import { NextRequest, NextResponse } from "next/server";
import { fetchSheetData } from "@/lib/sheets";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const spreadsheetId =
      request.nextUrl.searchParams.get("spreadsheetId") ?? undefined;
    const data = await fetchSheetData(spreadsheetId);
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "시트 데이터를 불러오는 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
