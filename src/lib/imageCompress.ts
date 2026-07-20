/**
 * Client-side image compression utility.
 *
 * WHY THIS EXISTS
 * --------------
 * Firestore has a HARD limit of ~1 MiB (1,048,487 bytes) per document. The
 * admin panel stores media as base64 data URLs inside Firestore fields, and
 * base64 inflates the original file by ~33%. So any image larger than ~750KB
 * made the Firestore write fail SILENTLY (rejected with INVALID_ARGUMENT)
 * while the UI still showed a success message — and large payloads could also
 * overflow the browser localStorage (~5MB) budget.
 *
 * This utility resizes + recompresses images in the browser (via Canvas)
 * BEFORE they are stored, keeping each image well under the Firestore document
 * limit and the localStorage budget, and validates type/size up front.
 *
 * No external service, no API key, no cost — pure client-side processing.
 */

export interface CompressOptions {
  /** Maximum dimension (width or height) in pixels. Default 1400. */
  maxDim?: number;
  /** Output quality 0..1 (used for JPEG/WebP). Default 0.75. */
  quality?: number;
  /** Output MIME type. Default 'image/jpeg'. */
  mimeType?: 'image/jpeg' | 'image/webp';
  /** Reject source files larger than this many bytes. Default 8MB. */
  maxSourceBytes?: number;
}

export interface CompressResult {
  /** base64 data URL of the compressed image. */
  dataUrl: string;
  width: number;
  height: number;
  /** Approximate size of the resulting data URL string (characters). */
  bytes: number;
}

const DEFAULTS: Required<CompressOptions> = {
  maxDim: 1400,
  quality: 0.75,
  mimeType: 'image/jpeg',
  maxSourceBytes: 8 * 1024 * 1024, // 8MB
};

/** Thrown when the supplied file is not a valid/acceptable image. */
export class ImageValidationError extends Error {}

function loadImg(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image.'));
    img.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Read, validate, resize and compress an image file into a base64 data URL.
 * Throws `ImageValidationError` for bad types or oversized source files.
 */
export async function compressImage(
  file: File,
  opts: CompressOptions = {}
): Promise<CompressResult> {
  const o = { ...DEFAULTS, ...opts };

  if (!file.type.startsWith('image/')) {
    throw new ImageValidationError('File is not an image.');
  }
  if (file.size > o.maxSourceBytes) {
    throw new ImageValidationError(
      `Image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is ${(o.maxSourceBytes / 1024 / 1024).toFixed(0)}MB.`
    );
  }

  const sourceDataUrl = await readFileAsDataUrl(file);
  const img = await loadImg(sourceDataUrl);

  // Scale down preserving aspect ratio if any dimension exceeds maxDim.
  let { width, height } = { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
  if (width > o.maxDim || height > o.maxDim) {
    if (width >= height) {
      height = Math.round((height * o.maxDim) / width);
      width = o.maxDim;
    } else {
      width = Math.round((width * o.maxDim) / height);
      height = o.maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  // Fill white so transparent PNGs don't turn black when encoded as JPEG.
  if (o.mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);

  const dataUrl = canvas.toDataURL(o.mimeType, o.quality);
  return { dataUrl, width, height, bytes: dataUrl.length };
}

/** Approximate decoded byte size of a base64 data URL string. */
export function dataUrlBytes(dataUrl: string): number {
  if (!dataUrl || !dataUrl.startsWith('data:')) return 0;
  const comma = dataUrl.indexOf(',');
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - padding;
}
