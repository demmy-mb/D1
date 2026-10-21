// Consolidated model data — each entry powers a full archive profile
// Live data is served from Sanity CMS

const models = [
  {
    slug: "david",
    name: "David",
    archiveName: "David's Archive",
    guestUsername: "Guest_Client",
    tagline: "Lagos is my New York City",
    bio: "David Adegbite is a Lagos and Abuja-based fashion stylist and model dedicated to the art of visual storytelling. Moving seamlessly between styling editorial spreads, brand campaigns, and magazine features, he crafts looks that are both culturally relevant and creatively bold. Behind and in front of the lens, David engages both mind and body to transform creative concepts into timeless fashion imagery.\n\nDavid is versatile when it comes to crafting clothes into art; he is well known for creating different styles.",
    stats: {
      height: "5'11\"",
      waist: "33/34",
      shoe: "UK 11 / US 12",
      eyes: "Brown",
      hair: "Black",
    },
    categories: [
      "Styling",
      "BLUEBERRIFACTORI 🐇 — Disruption Campaign",
      "New York Love Campaign",
      "The Future Campaign",
      "SUPASTAR SYNDROME",
      "Lookbook",
      "Brand",
      "Streetwear",
    ],
    agency: "Independent",
    location: "Lagos & Abuja, Nigeria",
    contact: "davidadegbite00@gmail.com",
    joined: "February 2026",
    profilePhoto: "",
    photos: [],
  },
];

export default models;

// Helper: find a model by slug
export function getModelBySlug(slug) {
  return models.find((m) => m.slug === slug) || null;
}

// Helper: get albums for a specific model's photos
export function getModelAlbums(photos) {
  const albumMap = {};
  photos.forEach((photo) => {
    if (!albumMap[photo.album]) {
      albumMap[photo.album] = [];
    }
    albumMap[photo.album].push(photo);
  });
  return albumMap;
}
