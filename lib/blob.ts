import { del, put } from "@vercel/blob";

const MAX_BYTES = 4_000_000;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type BlobUploadResult = { ok: true; url: string } | { ok: false; message: string };

export async function uploadPublicImage(file: File, prefix: string): Promise<BlobUploadResult> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, message: "Image storage is not connected yet. Ask IT to set BLOB_READ_WRITE_TOKEN." };
  }
  if (!file || file.size === 0) {
    return { ok: false, message: "Choose an image file." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "Keep photos under 4 MB." };
  }
  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return { ok: false, message: "Use a JPEG, PNG, WebP or GIF." };
  }
  const ext = type.split("/")[1] === "jpeg" ? "jpg" : type.split("/")[1];
  const pathname = `${prefix}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const blob = await put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    contentType: type,
  });
  return { ok: true, url: blob.url };
}

export async function deletePublicImage(url: string | null | undefined) {
  if (!url || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch {
    // Blob may already be gone; do not fail the parent action.
  }
}
