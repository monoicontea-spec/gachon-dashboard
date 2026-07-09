import { notFound } from "next/navigation";
import { DashboardView } from "@/components/DashboardView";
import { getStudentBySlug } from "@/lib/students";

interface StudentPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function StudentPage({
  params,
  searchParams,
}: StudentPageProps) {
  const { slug } = await params;
  const { mode } = await searchParams;
  const student = getStudentBySlug(slug);

  if (!student) {
    notFound();
  }

  return (
    <DashboardView
      slug={student.slug}
      studentName={student.name}
      spreadsheetId={student.spreadsheetId}
      initialMode={mode === "edit" ? "edit" : "view"}
    />
  );
}
