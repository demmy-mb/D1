"use client";

import Image from "next/image";

export default function WallPost({ photo, model, onImageClick, priority = false }) {
  const isPolaroid = photo.postType === "Polaroid";
  const width = photo.width || 1000;
  const height = photo.height || 1250;

  return (
    <article className={`wall-post ${isPolaroid ? "wall-post--polaroid" : ""}`}>
      <div className="wall-post__header">
        {model.profilePhoto ? (
          <Image
            src={model.profilePhoto}
            alt={model.name}
            width={40}
            height={40}
            className="wall-post__avatar"
          />
        ) : (
          <div className="wall-post__avatar" />
        )}
        <div>
          <span className="wall-post__name">{model.name}</span>
          <span className="wall-post__verb"> added a new photo.</span>
          <div className="wall-post__date">{photo.date}</div>
        </div>
      </div>

      <div
        className="wall-post__image-wrap"
        onClick={() => photo.src && onImageClick(photo)}
      >
        {photo.src ? (
          <Image
            src={photo.src}
            alt={photo.caption || model.name}
            width={width}
            height={height}
            className="wall-post__image"
            sizes="(max-width: 768px) 100vw, 720px"
            placeholder={photo.lqip ? "blur" : "empty"}
            blurDataURL={photo.lqip || undefined}
            priority={priority}
          />
        ) : (
          <div className="wall-post__image wall-post__image--placeholder">
            Photo not yet uploaded
          </div>
        )}
        {isPolaroid && (
          <div className="wall-post__polaroid-footer">
            <div className="wall-post__polaroid-caption">{photo.caption}</div>
            <div className="wall-post__polaroid-date">{photo.date}</div>
          </div>
        )}
      </div>

      {!isPolaroid && photo.caption && (
        <div className="wall-post__caption">{photo.caption}</div>
      )}

    </article>
  );
}
