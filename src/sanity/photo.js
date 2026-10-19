// Turns a Sanity post into the photo shape used by WallPost, PhotoGrid and Lightbox

import { urlFor } from "./image";

export function postToPhoto(post, width = 1200) {
  const dims = post.dims;
  return {
    id: post._id,
    src: post.image ? urlFor(post.image).width(width).auto("format").url() : null,
    fullSrc: post.image ? urlFor(post.image).width(2000).auto("format").url() : null,
    width: dims ? width : undefined,
    height: dims ? Math.round((width * dims.height) / dims.width) : undefined,
    lqip: post.lqip || null,
    caption: post.caption || "",
    postType: post.postType,
    album: (post.album || "Uncategorized").trim(),
    date: post.timestamp
      ? new Date(post.timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
  };
}
