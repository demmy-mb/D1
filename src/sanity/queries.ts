// GROQ queries — all Sanity queries in one file

// Fetch all models for the Talent Gallery
export const getAllModels = `
  *[_type == "model"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    profileImage,
    tagline,
    bio,
    agency,
    location,
    contact,
    joined,
    themeColor,
    emails,
    phone,
    instagram,
    quote,
    categories,
    stats
  }
`;

// Fetch a single model by slug
export const getModelBySlug = `
  *[_type == "model" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    profileImage,
    tagline,
    bio,
    agency,
    location,
    contact,
    joined,
    themeColor,
    emails,
    phone,
    instagram,
    quote,
    categories,
    stats
  }
`;

// Fetch wall posts for a model, ordered by timestamp
export const getModelPosts = `
  *[_type == "post" && model._ref == $modelId] | order(timestamp desc) {
    _id,
    image,
    "dims": image.asset->metadata.dimensions{width, height},
    "lqip": image.asset->metadata.lqip,
    caption,
    timestamp,
    postType,
    album
  }
`;

// Fetch a private shoot by access code
export const getShootByCode = `
  *[_type == "shoot" && accessCode == $code][0] {
    _id,
    clientName,
    accessCode,
    gallery,
    exclusiveNote,
    model-> {
      _id,
      name,
      "slug": slug.current,
      profileImage
    }
  }
`;
