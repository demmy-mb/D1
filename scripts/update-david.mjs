// One-off: fill David's profile info in Sanity
import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

readFileSync(new URL("../.env.local", import.meta.url), "utf-8")
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

const id = await client.fetch(`*[_type == "model" && slug.current == "david"][0]._id`);
if (!id) throw new Error("David not found");

await client
  .patch(id)
  .set({
    bio:
      "David Adegbite is a Lagos-based fashion stylist and model dedicated to the art of visual storytelling. Moving seamlessly between styling editorial spreads, brand campaigns, and magazine features, he crafts looks that are both culturally relevant and creatively bold. Behind and in front of the lens, David engages both mind and body to transform creative concepts into timeless fashion imagery.\n\nDavid is versatile when it comes to crafting clothes into art; he is well known for creating different styles.",
    quote: "I am art",
    tagline: "Lagos is my New York City",
    phone: "07083221173",
    instagram: "_davidadegbite",
    contact: "davidadegbite00@gmail.com",
    emails: ["davidadegbite11@gmail.com"],
    categories: ["Streetwear"],
  })
  .commit();

console.log("Updated", id);
