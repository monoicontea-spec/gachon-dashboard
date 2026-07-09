"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  extractPresentationId,
  extractSpreadsheetId,
  getRegistration,
  saveRegistration,
  type RegistrationType,
} from "@/lib/registrations";

interface RegisterButtonProps {
  slug: string;
  studentName: string;
  type: RegistrationType;
  onRegistered?: () => void;
  compact?: boolean;
}

export function RegisterButton({
  slug,
  studentName,
  type,
  onRegistered,
  compact = false,
}: RegisterButtonProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const sync = () => {
      setRegistered(Boolean(getRegistration(slug, type)));
    };
    sync();
    window.addEventListener("gachon-registrations-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gachon-registrations-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug, type]);

  const label = type === "sheet" ? "구글 시트" : "구글 슬라이드";
  const placeholder =
    type === "sheet"
      ? "https://docs.google.com/spreadsheets/d/..."
      : "https://docs.google.com/presentation/d/...";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("공유 링크를 입력해 주세요.");
      return;
    }

    const resourceId =
      type === "sheet"
        ? extractSpreadsheetId(trimmed)
        : extractPresentationId(trimmed);

    if (!resourceId) {
      setError(`올바른 ${label} 공유 링크를 입력해 주세요.`);
      return;
    }

    saveRegistration({
      slug,
      type,
      url: trimmed,
      resourceId,
      registeredAt: new Date().toISOString(),
    });

    setRegistered(true);
    setOpen(false);
    setUrl("");
    onRegistered?.();
  }

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className={`${compact ? "w-full" : "mt-4 w-full"} rounded-lg border px-3 py-2 text-xs font-medium tracking-wide transition ${
          registered
            ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
            : "border-white/15 bg-white/[0.04] text-white/70 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
        }`}
      >
        {registered ? "재등록" : "등록"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs font-medium tracking-[0.25em] text-white/35 uppercase">
              Register Link
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {studentName} · {label} 등록
            </h2>
            <p className="mt-2 text-sm text-white/45">
              학생에게 받은 {label} 공유 링크
              (링크가 있는 모든 사용자 · 편집자)를 붙여넣으면 이 카드에 연결됩니다.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor={`register-${slug}-${type}`}
                  className="mb-2 block text-xs text-white/50"
                >
                  공유 링크
                </label>
                <input
                  id={`register-${slug}-${type}`}
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
