// Image catalog — maps files to wall posts and album data
// Managed dynamically via Sanity (see scripts/sync-shoots.mjs)

const photos = [];

export default photos;

// Helper: get all unique album names
export function getAlbums() {
  const albumMap = {};
  photos.forEach((photo) => {
    if (!albumMap[photo.album]) {
      albumMap[photo.album] = [];
    }
    albumMap[photo.album].push(photo);
  });
  return albumMap;
}
