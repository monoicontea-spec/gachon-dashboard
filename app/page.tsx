import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.06)_0%,_transparent_50%)]" />

      <main className="relative flex flex-1 flex-col justify-between px-8 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-24">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs font-medium tracking-[0.35em] text-white/40 uppercase">
            Gachon University · Industrial Design
          </p>
          <h1 className="text-left text-3xl leading-[1.15] font-light tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            2026 가천대학교
            <br />
            산업디자인과 AI/P학기
            <br />
            <span className="font-normal text-white/90">터미널</span>
          </h1>
          <div className="mt-10 h-px w-16 bg-white/20" />
          <p className="mt-8 max-w-md text-left text-sm leading-relaxed text-white/45 sm:text-base">
            35명의 재료구매 청구 시트를 한곳에서 확인하고 관리합니다.
          </p>
        </div>

        <div className="mt-16">
          <Link
            href="/terminal"
            className="inline-flex items-center gap-3 border border-white/25 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
          >
            시작
            <span aria-hidden="true" className="text-base">
              →
            </span>
          </Link>
        </div>
      </main>

      <footer className="relative border-t border-white/8 px-8 py-5 sm:px-12 lg:px-20">
        <p className="text-left text-xs text-white/25">2026 · Terminal v1.0</p>
      </footer>
    </div>
  );
}
