"use client";

import Image from "next/image";

// Masonry grid — photos keep their real shape instead of being cropped square
export default function PhotoGrid({ photos, onPhotoClick }) {
  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="photo-grid__item"
          onClick={() => photo.src && onPhotoClick(photo)}
        >
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.caption}
              width={photo.width || 600}
              height={photo.height || 750}
              className="photo-grid__img"
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 300px"
              placeholder={photo.lqip ? "blur" : "empty"}
              blurDataURL={photo.lqip || undefined}
            />
          ) : (
            <div className="photo-grid__missing">Missing Image</div>
          )}
        </div>
      ))}
    </div>
  );
}
