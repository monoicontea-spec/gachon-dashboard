"use client";

import { useEffect, useState } from "react";
import { RegisterButton } from "@/components/RegisterButton";
import type { Student } from "@/lib/students";
import { getRegistration } from "@/lib/registrations";
import {
  getPresentationThumbnailUrl,
  getPresentationUrl,
} from "@/lib/slides";

interface ProjectThumbnailProps {
  student: Student;
  index: number;
}

export function ProjectThumbnail({ student, index }: ProjectThumbnailProps) {
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const entry = getRegistration(student.slug, "slide");
      setRegisteredId(entry?.resourceId ?? null);
    };
    sync();
    window.addEventListener("gachon-registrations-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gachon-registrations-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [student.slug]);

  const presentationId = registeredId ?? student.presentationId;
  const isConnected = student.slideConnected || Boolean(registeredId);

  const content = (
    <>
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className="text-xs font-medium tracking-widest text-white/30">
          {String(index + 1).padStart(2, "0")}
        </span>
        {isConnected && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
            연결됨
          </span>
        )}
      </div>

      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-lg border border-white/8 bg-white/[0.04]">
        {presentationId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getPresentationThumbnailUrl(presentationId)}
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
        {isConnected ? "프로젝트 발표" : "슬라이드 연결 예정"}
      </p>
    </>
  );

  const className =
    "group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-white/20 hover:bg-white/[0.06]";

  return (
    <div className={`${className} ${isConnected ? "" : "opacity-70"}`}>
      {presentationId ? (
        <a
          href={getPresentationUrl(presentationId)}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      ) : (
        <div>{content}</div>
      )}
      <RegisterButton
        slug={student.slug}
        studentName={student.name}
        type="slide"
        onRegistered={() => {
          const entry = getRegistration(student.slug, "slide");
          setRegisteredId(entry?.resourceId ?? null);
        }}
      />
    </div>
  );
}
