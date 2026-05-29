// R2 bucket binding type (Cloudflare Workers)
export interface R2Bucket {
  put(key: string, value: ReadableStream | ArrayBuffer | Blob | string, options?: R2PutOptions): Promise<R2Object>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(keys: string | string[]): Promise<void>;
  createPresignedUrl?(method: "GET" | "PUT", key: string, options?: { expiresIn?: number }): Promise<string>;
}
interface R2PutOptions { httpMetadata?: { contentType?: string }; customMetadata?: Record<string, string> }
interface R2Object { key: string; size: number; etag: string; httpEtag: string; uploaded: Date }
interface R2ObjectBody extends R2Object { body: ReadableStream; bodyUsed: boolean; arrayBuffer(): Promise<ArrayBuffer>; text(): Promise<string>; }

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "https://cdn.thewebstart.in";

export function buildPublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

export function buildObjectKey(folder: string, filename: string): string {
  const ext = filename.split(".").pop() ?? "bin";
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-");
  const uuid = crypto.randomUUID();
  return `${folder}/${uuid}-${sanitized}.${ext}`.replace(/\.+/g, ".");
}

export async function generatePresignedUploadUrl(
  bucket: R2Bucket,
  key: string,
  expiresIn = 900
): Promise<string> {
  if (!bucket.createPresignedUrl) {
    throw new Error("R2 presigned URLs require Workers runtime");
  }
  return bucket.createPresignedUrl("PUT", key, { expiresIn });
}

export async function deleteR2Object(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key);
}

export function extractKeyFromUrl(publicUrl: string): string {
  return publicUrl.replace(`${R2_PUBLIC_URL}/`, "");
}
