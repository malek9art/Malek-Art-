/**
 * Font registry + global font application.
 *
 * Fonts are split into:
 *  - "local" fonts: bundled in the repo (Thmanyah Sans, and Thmanyah Serif Text
 *    once its .woff2 files are dropped into src/assets/fonts/thmanyah/).
 *  - "google" fonts: loaded on demand via a <link> to fonts.googleapis.com.
 *
 * The active font is applied by setting the `--font-active` CSS custom property
 * on <html> (consumed by index.css: `html { font-family: var(--font-active) }`).
 */

export type FontSource = 'local' | 'google';

export interface FontOption {
  id: string;
  labelAr: string;
  labelEn: string;
  /** CSS font-family stack. */
  family: string;
  source: FontSource;
  /** Google Fonts CSS URL (only for source === 'google'). */
  googleHref?: string;
  /** Sample text for the picker. */
  preview: string;
}

export const CUSTOM_FONT_ID = 'custom';

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'thmanyah-sans',
    labelAr: 'ثمانية سانس (الافتراضي)',
    labelEn: 'Thmanyah Sans (Default)',
    family:
      '"Thmanyah Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    source: 'local',
    preview: 'Aa أبجد 0123',
  },
  {
    id: 'thmanyah-serif',
    labelAr: 'ثمانية سيريف تكست (الخط المرفق)',
    labelEn: 'Thmanyah Serif Text (Attached)',
    // Falls back to a true serif (Georgia) until the bundled @font-face files
    // for "Thmanyah Serif Text" are added — see index.css.
    family: '"Thmanyah Serif Text", Georgia, "Times New Roman", serif',
    source: 'local',
    preview: 'Aa أبجد 0123',
  },
  {
    id: 'cairo',
    labelAr: 'القاهرة (Cairo)',
    labelEn: 'Cairo',
    family: '"Cairo", "Thmanyah Sans", sans-serif',
    source: 'google',
    googleHref:
      'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;800&display=swap',
    preview: 'Aa أبجد 0123',
  },
  {
    id: 'tajawal',
    labelAr: 'تجوال (Tajawal)',
    labelEn: 'Tajawal',
    family: '"Tajawal", "Thmanyah Sans", sans-serif',
    source: 'google',
    googleHref:
      'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
    preview: 'Aa أبجد 0123',
  },
  {
    id: 'ibm-plex-arabic',
    labelAr: 'IBM بلك سانس عربي',
    labelEn: 'IBM Plex Sans Arabic',
    family: '"IBM Plex Sans Arabic", "Thmanyah Sans", sans-serif',
    source: 'google',
    googleHref:
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap',
    preview: 'Aa أبجد 0123',
  },
  {
    id: CUSTOM_FONT_ID,
    labelAr: 'خط مخصص (Google Fonts)',
    labelEn: 'Custom (Google Fonts)',
    family: '"Thmanyah Sans", sans-serif', // overridden at apply time
    source: 'local',
    preview: 'Aa أبجد 0123',
  },
];

export function getFontById(id?: string): FontOption {
  if (!id) return FONT_OPTIONS[0];
  return FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0];
}

const DYNAMIC_LINK_ID = 'dynamic-font-stylesheet';

export interface FontConfig {
  fontFamily?: string;
  customFontFamily?: string;
  customFontUrl?: string;
}

/**
 * Resolve the chosen font to a CSS family stack + optional Google Fonts URL.
 */
export function resolveFont(cfg: FontConfig): { family: string; href?: string } {
  const font = getFontById(cfg.fontFamily);

  if (cfg.fontFamily === CUSTOM_FONT_ID && cfg.customFontFamily?.trim()) {
    const family = `"${cfg.customFontFamily.trim()}", "Thmanyah Sans", sans-serif`;
    return { family, href: cfg.customFontUrl?.trim() || undefined };
  }

  return {
    family: font.family,
    href: font.source === 'google' ? font.googleHref : undefined,
  };
}

/**
 * Apply a font choice to the document: sets --font-active and injects/removes
 * a Google Fonts <link> as needed. Safe to call from multiple consumers
 * (App on config change, AdminPanel for live preview).
 */
export function applyFont(cfg: FontConfig): void {
  if (typeof document === 'undefined') return;
  const { family, href } = resolveFont(cfg);
  document.documentElement.style.setProperty('--font-active', family);

  let link = document.getElementById(DYNAMIC_LINK_ID) as HTMLLinkElement | null;
  if (href) {
    if (!link) {
      link = document.createElement('link');
      link.id = DYNAMIC_LINK_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  } else if (link) {
    link.remove();
  }
}
