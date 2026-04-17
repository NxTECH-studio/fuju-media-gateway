import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
if (!accountId) throw new Error("R2_ACCOUNT_ID is required");

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const bucket = process.env.R2_BUCKET!;
export const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL ?? "";

export async function putObject(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return publicBaseUrl ? `${publicBaseUrl}/${key}` : key;
}
