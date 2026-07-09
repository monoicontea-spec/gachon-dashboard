export interface StudentSheet {
  slug: string;
  name: string;
  connected: boolean;
  spreadsheetId?: string;
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

export const STUDENTS: StudentSheet[] = [
  {
    slug: "sample",
    name: "샘플",
    connected: true,
    spreadsheetId: process.env.SPREADSHEET_ID,
  },
  ...PLACEHOLDER_NAMES.map((name, index) => ({
    slug: `student-${String(index + 2).padStart(2, "0")}`,
    name,
    connected: false,
  })),
];

export function getStudentBySlug(slug: string): StudentSheet | undefined {
  return STUDENTS.find((student) => student.slug === slug);
}
