import Link from "next/link";
import { ProjectThumbnail } from "@/components/ProjectThumbnail";
import { STUDENTS } from "@/lib/students";

export default function ProjectPage() {
  return (
    <div className="min-h-full bg-black text-white">
      <header className="border-b border-white/8 px-8 py-8 sm:px-12 lg:px-20">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm text-white/40 transition hover:text-white/70"
        >
          ← 처음으로
        </Link>
        <p className="text-xs font-medium tracking-[0.3em] text-white/35 uppercase">
          Project Slides
        </p>
        <h1 className="mt-3 text-2xl font-light tracking-tight sm:text-3xl">
          프로젝트
        </h1>
        <p className="mt-2 text-sm text-white/40">
          총 {STUDENTS.length}명 · 학생별 구글 슬라이드 공유 링크를 등록합니다.
        </p>
      </header>

      <main className="px-8 py-10 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {STUDENTS.map((student, index) => (
            <ProjectThumbnail
              key={student.slug}
              student={student}
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
