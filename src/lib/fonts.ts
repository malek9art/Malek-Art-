/**
 * Font registry + global font application, including support for a custom
 * font uploaded from the admin panel (stored as base64 in Firestore and
 * injected at runtime as @font-face rules).
 *
 * The active font is applied via the `--font-active` CSS custom property
 * on <html> (consumed by index.css: `html { font-family: var(--font-active) }`).
 */

import { CustomFontData } from '../types';

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
    labelAr: 'خط مخصص (رفع من اللوحة)',
    labelEn: 'Custom Font (Upload)',
    family: '"Thmanyah Sans", sans-serif', // overridden at apply time by the uploaded family
    source: 'local',
    preview: 'Aa أبجد 0123',
  },
];

export function getFontById(id?: string): FontOption {
  if (!id) return FONT_OPTIONS[0];
  return FONT_OPTIONS.find((f) => f.id === id) || FONT_OPTIONS[0];
}

export interface FontConfig {
  fontFamily?: string;
  customFontFamily?: string;
}

const DYNAMIC_LINK_ID = 'dynamic-font-stylesheet';

/**
 * Apply a font choice: set --font-active and (for Google presets) inject the
 * Google Fonts <link>. For the custom uploaded font, the @font-face rules are
 * injected separately by injectCustomFontFaces().
 *
 * If the Google Fonts stylesheet fails to load (network issue, blocked by
 * ad-blocker, etc.), the CSS variable gracefully falls back to "Thmanyah Sans"
 * which is bundled locally — so Arabic text always renders properly.
 */
export function applyFont(cfg: FontConfig): void {
  if (typeof document === 'undefined') return;
  const font = getFontById(cfg.fontFamily);

  let family = font.family;
  if (cfg.fontFamily === CUSTOM_FONT_ID) {
    const name = cfg.customFontFamily?.trim();
    family = name ? `"${name}", "Thmanyah Sans", sans-serif` : font.family;
  }
  document.documentElement.style.setProperty('--font-active', family);

  const href = font.source === 'google' ? font.googleHref : undefined;
  let link = document.getElementById(DYNAMIC_LINK_ID) as HTMLLinkElement | null;
  if (href) {
    if (!link) {
      link = document.createElement('link');
      link.id = DYNAMIC_LINK_ID;
      link.rel = 'stylesheet';
      // On load error, fall back to local Thmanyah Sans (already bundled).
      link.onerror = () => {
        document.documentElement.style.setProperty(
          '--font-active',
          '"Thmanyah Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        );
      };
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  } else if (link) {
    link.remove();
  }
}

/* ===================== Custom uploaded font ===================== */

const FACES_STYLE_ID = 'custom-font-faces';

/** Map a font filename to a CSS @font-face `format()` hint. */
export function fontFormat(filename: string): string {
  const ext = (filename || '').toLowerCase().split('.').pop() || '';
  if (ext === 'woff2') return 'woff2';
  if (ext === 'woff') return 'woff';
  if (ext === 'ttf') return 'truetype';
  if (ext === 'otf') return 'opentype';
  return 'woff2';
}

/** Read a File as a base64 data URL. */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Inject (or remove) the @font-face rules for the custom uploaded font.
 * Call whenever the stored custom font changes.
 */
export function injectCustomFontFaces(data: CustomFontData | null): void {
  if (typeof document === 'undefined') return;

  const weights =
    data && data.family
      ? [
          { weight: 400, file: data.regular },
          { weight: 500, file: data.medium },
          { weight: 700, file: data.bold },
        ].filter((x) => x.file && x.file.src)
      : [];

  const existing = document.getElementById(FACES_STYLE_ID) as HTMLStyleElement | null;
  if (!weights.length) {
    existing?.remove();
    return;
  }

  const style =
    existing ?? (document.createElement('style') as HTMLStyleElement);
  style.id = FACES_STYLE_ID;
  style.textContent = weights
    .map(
      (x) =>
        `@font-face { font-family: "${data!.family}"; src: url("${x.file!.src}") format("${x.file!.fmt}"); font-weight: ${x.weight}; font-display: swap; }`
    )
    .join('\n');
  if (!existing) document.head.appendChild(style);
}
