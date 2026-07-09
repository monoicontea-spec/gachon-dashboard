export interface PurchaseRow {
  순번: string;
  재료명: string;
  구매사이트: string;
  옵션: string;
  수량: string;
  단가: string;
  총액: number;
  상태: string;
  물품수령확인: string;
}

export interface SheetData {
  headers: string[];
  rows: PurchaseRow[];
  totalAmount: number;
  lastUpdated: string;
}
