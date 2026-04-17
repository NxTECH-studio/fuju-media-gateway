import sharp from "sharp";

export type IconVariant = {
  format: "webp" | "avif";
  buffer: Uint8Array;
  contentType: string;
};

export async function transformIcon(input: Uint8Array): Promise<IconVariant[]> {
  const base = sharp(input).resize(400, 400, {
    fit: "cover",
    position: "centre",
  });

  const [webp, avif] = await Promise.all([
    base.clone().webp({ quality: 85 }).toBuffer(),
    base.clone().avif({ quality: 60 }).toBuffer(),
  ]);

  return [
    { format: "webp", buffer: webp, contentType: "image/webp" },
    { format: "avif", buffer: avif, contentType: "image/avif" },
  ];
}
