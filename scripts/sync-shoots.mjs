/**
 * Syncs all categorized folders inside ./shoots to Sanity for David's profile,
 * removing old posts first and uploading the new categorized images.
 */
import { createClient } from "@sanity/client";
import { readFileSync, createReadStream, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Load .env.local
readFileSync(path.join(rootDir, ".env.local"), "utf-8")
  .split("\n")
  .forEach((line) => {
    const [key, ...vals] = line.split("=");
    if (key && vals.length) process.env[key.trim()] = vals.join("=").trim();
  });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const CATEGORY_MAP = {
  "brand": "Brand",
  "brand2 brtii distribution campaing": "BLUEBERRIFACTORI 🐇 — Disruption Campaign",
  "look book": "Lookbook",
  "New york love camp": "New York Love Campaign",
  "street wear": "Streetwear",
  "Styling cap wrk": "Styling Campaign Work",
  "Supastar symdrom": "SUPASTAR SYNDROME",
  "supastart symdrome 2": "SUPASTAR SYNDROME",
  "THE FUTURE CAMPAIGN": "The Future Campaign",
  "Featyre styling": "The Future Campaign",
};

async function main() {
  const model = await client.fetch(
    `*[_type == "model" && slug.current == "david"][0]{_id, name}`
  );
  if (!model) {
    throw new Error("Model 'david' not found in Sanity");
  }
  console.log(`Found model: ${model.name} (${model._id})`);

  // 1. Fetch and delete all existing posts for David
  const existingPosts = await client.fetch(
    `*[_type == "post" && model._ref == $modelId]{_id}`,
    { modelId: model._id }
  );
  console.log(`Deleting ${existingPosts.length} old posts...`);
  if (existingPosts.length > 0) {
    const tx = client.transaction();
    for (const p of existingPosts) {
      tx.delete(p._id);
    }
    await tx.commit();
    console.log("Deleted all old posts.");
  }

  // 2. Update David's categories array on his profile
  const categoryNames = Object.values(CATEGORY_MAP);
  await client
    .patch(model._id)
    .set({ categories: categoryNames })
    .commit();
  console.log("Updated model categories:", categoryNames.join(", "));

  // 3. Scan ./shoots folders and upload each image + create post
  const shootsDir = path.join(rootDir, "shoots");
  const entries = readdirSync(shootsDir);

  let uploadedCount = 0;
  // Use sequential timestamps so ordering is deterministic and grouped nicely
  const baseTime = Date.now();

  for (const entry of entries) {
    const folderPath = path.join(shootsDir, entry);
    if (!statSync(folderPath).isDirectory()) continue;

    const albumName = CATEGORY_MAP[entry] || entry;
    const files = readdirSync(folderPath).filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f)
    );

    console.log(`\nUploading folder "${entry}" -> Album "${albumName}" (${files.length} images)...`);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const asset = await client.assets.upload(
        "image",
        createReadStream(filePath),
        { filename: file }
      );

      const postTimestamp = new Date(baseTime - uploadedCount * 60000).toISOString();

      await client.create({
        _type: "post",
        model: { _type: "reference", _ref: model._id },
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
        caption: albumName,
        album: albumName,
        postType: "Standard",
        timestamp: postTimestamp,
      });

      uploadedCount++;
      console.log(`  [${uploadedCount}] Uploaded ${file} (${albumName})`);
    }
  }

  console.log(`\nDone! Uploaded ${uploadedCount} categorized photos for ${model.name}.`);
}

main().catch((err) => {
  console.error("Error syncing shoots:", err);
  process.exit(1);
});
