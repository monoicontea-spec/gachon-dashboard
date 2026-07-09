import { notFound } from "next/navigation";
import { DashboardView } from "@/components/DashboardView";
import { getStudentBySlug } from "@/lib/students";

interface StudentPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { slug } = await params;
  const student = getStudentBySlug(slug);

  if (!student || !student.sheetConnected) {
    notFound();
  }

  return (
    <DashboardView
      studentName={student.name}
      spreadsheetId={student.spreadsheetId}
    />
  );
}
