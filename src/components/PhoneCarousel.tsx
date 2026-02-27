"use client";

import { useEffect, useState, useCallback } from "react";

// Screenshot filenames that will be in /screenshots/{locale}/
// These map to the test methods in ScreenshotTests.swift
const SCREENSHOTS = [
  { file: "02_card_list_iPhone.png", alt: "Card list with digital business cards" },
  { file: "03_card_detail_iPhone.png", alt: "Business card detail with QR code" },
  { file: "04_create_card_iPhone.png", alt: "Create a new digital business card" },
  { file: "06_settings_iPhone.png", alt: "App settings and profile" },
  { file: "01_onboarding_iPhone.png", alt: "Welcome to eCardify onboarding" },
];

const CYCLE_MS = 3500;

export function PhoneCarousel({ locale }: { locale: string }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SCREENSHOTS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SCREENSHOTS.length) % SCREENSHOTS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, CYCLE_MS);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  // Map landing page locale to fastlane screenshot directory
  const screenshotLocale = mapLocale(locale);

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Phone Frame */}
      <div className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] flex-shrink-0">
        {/* Outer bezel */}
        <div className="absolute inset-0 rounded-[3rem] bg-gray-900 dark:bg-gray-700 shadow-2xl shadow-gray-900/40 dark:shadow-black/60" />

        {/* Screen area */}
        <div className="absolute inset-[4px] rounded-[2.8rem] overflow-hidden bg-black">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-full z-20" />

          {/* Screenshot images with crossfade */}
          {SCREENSHOTS.map((shot, idx) => (
            <img
              key={shot.file}
              src={`/screenshots/${screenshotLocale}/${shot.file}`}
              alt={shot.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                idx === current ? "opacity-100" : "opacity-0"
              }`}
              loading={idx === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex items-center gap-2 mt-6">
        <button
          onClick={prev}
          aria-label="Previous screenshot"
          className="p-1 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {SCREENSHOTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Screenshot ${idx + 1}`}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? "w-8 h-2.5 bg-brand-600 dark:bg-brand-400"
                : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
            }`}
          />
        ))}

        <button
          onClick={next}
          aria-label="Next screenshot"
          className="p-1 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Maps landing page i18n locale code to fastlane screenshot directory name. */
function mapLocale(locale: string): string {
  const map: Record<string, string> = {
    en: "en-US",
    de: "de-DE",
    es: "es-MX",
    fr: "fr-FR",
    it: "it",
    ja: "ja",
    ko: "ko",
    pt: "pt-BR",
    zh: "zh-Hans",
    ru: "ru",
  };
  return map[locale] ?? "en-US";
}
