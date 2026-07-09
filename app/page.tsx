import Image from "next/image";
import { NewTabLink } from "@/components/NewTabLink";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.06)_0%,_transparent_50%)]" />

      <main className="relative flex flex-1 flex-col justify-between px-8 py-12 sm:px-12 sm:py-16 lg:px-24 lg:py-24 xl:px-32">
        <div className="w-full max-w-6xl">
          <p className="mb-6 text-xs font-medium tracking-[0.35em] text-white/40 uppercase">
            Gachon University · Industrial Design
          </p>

          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
            <h1 className="text-left text-3xl leading-[1.2] font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem]">
              <span className="block md:whitespace-nowrap">2026 가천대학교</span>
              <span className="block md:whitespace-nowrap">
                산업디자인과{" "}
                <span className="text-sky-300">AI</span>
                /
                <span className="text-orange-400">P</span>
                학기
              </span>
              <span className="block md:whitespace-nowrap text-white/90">
                터미널
              </span>
            </h1>

            <div className="shrink-0 self-start md:self-auto">
              <Image
                src="/dept-logo.png"
                alt="가천대학교 산업디자인과 심볼"
                width={567}
                height={567}
                priority
                className="h-[7.2rem] w-[7.2rem] object-contain sm:h-[8.4rem] sm:w-[8.4rem] md:h-[10.8rem] md:w-[10.8rem] lg:h-[12.6rem] lg:w-[12.6rem]"
              />
            </div>
          </div>

          <div className="mt-10 h-px w-16 bg-white/20" />
          <p className="mt-8 max-w-2xl text-left text-sm leading-relaxed text-white/45 sm:text-base">
            재료구매 청구와 프로젝트 발표 자료를 한곳에서 확인하고 관리합니다.
          </p>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <NewTabLink
            href="/purchase"
            className="inline-flex items-center gap-3 border border-white/25 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            구매신청
            <span aria-hidden="true" className="text-base">
              →
            </span>
          </NewTabLink>
          <NewTabLink
            href="/project"
            className="inline-flex items-center gap-3 border border-white/15 px-8 py-3.5 text-sm font-medium tracking-wide text-white/80 transition duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            프로젝트
            <span aria-hidden="true" className="text-base">
              →
            </span>
          </NewTabLink>
        </div>
      </main>

      <footer className="relative border-t border-white/8 px-8 py-5 sm:px-12 lg:px-24 xl:px-32">
        <p className="text-left text-xs text-white/25">2026 · Terminal v1.0</p>
      </footer>
    </div>
  );
}
