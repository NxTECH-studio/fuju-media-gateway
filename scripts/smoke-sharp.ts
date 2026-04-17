import sharp from "sharp";

console.log("sharp versions:", sharp.versions);

const input = await sharp({
  create: {
    width: 800,
    height: 800,
    channels: 3,
    background: { r: 128, g: 64, b: 200 },
  },
})
  .png()
  .toBuffer();
console.log("source png bytes:", input.length);

const [webp, avif] = await Promise.all([
  sharp(input).resize(400, 400).webp({ quality: 85 }).toBuffer(),
  sharp(input).resize(400, 400).avif({ quality: 60 }).toBuffer(),
]);

console.log("webp bytes:", webp.length);
console.log("avif bytes:", avif.length);
console.log("ok");
