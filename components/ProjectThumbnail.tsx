import type { Student } from "@/lib/students";
import {
  getPresentationThumbnailUrl,
  getPresentationUrl,
} from "@/lib/slides";

interface ProjectThumbnailProps {
  student: Student;
  index: number;
}

export function ProjectThumbnail({ student, index }: ProjectThumbnailProps) {
  const content = (
    <>
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="text-xs font-medium tracking-widest text-white/30">
          {String(index + 1).padStart(2, "0")}
        </span>
        {student.slideConnected && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
            연결됨
          </span>
        )}
      </div>

      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-lg border border-white/8 bg-white/[0.04]">
        {student.slideConnected && student.presentationId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getPresentationThumbnailUrl(student.presentationId)}
            alt={`${student.name} 프로젝트 슬라이드`}
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
            <div className="h-16 w-24 rounded border border-white/10 bg-white/[0.03]" />
            <div className="h-1.5 w-20 rounded-full bg-white/10" />
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold tracking-tight text-white">
        {student.name}
      </h3>
      <p className="mt-1 text-sm text-white/40">
        {student.slideConnected ? "프로젝트 발표" : "슬라이드 연결 예정"}
      </p>
    </>
  );

  const className =
    "group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.06]";

  if (student.slideConnected && student.presentationId) {
    return (
      <a
        href={getPresentationUrl(student.presentationId)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={`${className} cursor-default opacity-50`}
      aria-disabled="true"
    >
      {content}
    </div>
  );
}
