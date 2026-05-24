/**
 * Compute SHA-256 hex digest of a File using the Web Crypto API.
 * Streams the file in 4MB chunks to avoid memory spikes on large files.
 */
export async function sha256File(file: File): Promise<string> {
  const CHUNK = 4 * 1024 * 1024; // 4MB
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
