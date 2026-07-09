export interface Student {
  slug: string;
  name: string;
  sheetConnected: boolean;
  spreadsheetId?: string;
  slideConnected: boolean;
  presentationId?: string;
}

const PLACEHOLDER_NAMES = [
  "김민준",
  "이서연",
  "박지호",
  "최유나",
  "정도윤",
  "강하은",
  "조시우",
  "윤서아",
  "장준서",
  "임지우",
  "한예준",
  "오수아",
  "신건우",
  "권다은",
  "황민재",
  "송채원",
  "배현우",
  "류지민",
  "홍승현",
  "문소율",
  "양태양",
  "구나연",
  "노우진",
  "마서진",
  "백지안",
  "서동현",
  "안소희",
  "유재원",
  "허수빈",
  "남태민",
  "심예린",
  "곽준혁",
  "차은서",
  "편민서",
];

const SAMPLE_PRESENTATION_ID = "17EneufgkJUPFi6KHC3uSS0lIcOo1Rey_";

export const STUDENTS: Student[] = [
  {
    slug: "sample",
    name: "샘플",
    sheetConnected: true,
    spreadsheetId: process.env.SPREADSHEET_ID,
    slideConnected: true,
    presentationId: SAMPLE_PRESENTATION_ID,
  },
  ...PLACEHOLDER_NAMES.map((name, index) => ({
    slug: `student-${String(index + 2).padStart(2, "0")}`,
    name,
    sheetConnected: false,
    slideConnected: false,
  })),
];

export function getStudentBySlug(slug: string): Student | undefined {
  return STUDENTS.find((student) => student.slug === slug);
}
