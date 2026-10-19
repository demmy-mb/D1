"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const SWIPE_DISTANCE = 60;

export default function Lightbox({ photos, currentPhoto, onClose, onNavigate }) {
  const currentIndex = photos.findIndex((p) => p.id === currentPhoto?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(photos[currentIndex - 1]);
  }, [hasPrev, currentIndex, photos, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(photos[currentIndex + 1]);
  }, [hasNext, currentIndex, photos, onNavigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [onClose, goPrev, goNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!currentPhoto) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {hasPrev && (
          <button
            className="lightbox-nav lightbox-prev"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            ‹
          </button>
        )}

        <motion.div
          className="lightbox-content"
          onClick={(e) => e.stopPropagation()}
          key={currentPhoto.id}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(e, info) => {
            if (info.offset.x < -SWIPE_DISTANCE) goNext();
            if (info.offset.x > SWIPE_DISTANCE) goPrev();
          }}
        >
          <Image
            src={currentPhoto.fullSrc || currentPhoto.src}
            alt={currentPhoto.caption}
            width={currentPhoto.width || 1200}
            height={currentPhoto.height || 1600}
            className="lightbox-image"
            sizes="100vw"
            draggable={false}
            priority
          />
          <div className="lightbox-caption">
            {currentPhoto.caption}
            <span className="lightbox-counter">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>
        </motion.div>

        {hasNext && (
          <button
            className="lightbox-nav lightbox-next"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            ›
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
