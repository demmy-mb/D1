"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import TabNav from "@/components/TabNav";
import PhotoGrid from "@/components/PhotoGrid";
import Lightbox from "@/components/Lightbox";
import { sanityClient } from "@/sanity/client";
import { postToPhoto } from "@/sanity/photo";
import {
  getModelBySlug as getModelBySlugQuery,
  getModelPosts,
} from "@/sanity/queries";

const STYLING_SUBGROUPS = [
  "BLUEBERRIFACTORI 🐇 — Disruption Campaign",
  "New York Love Campaign",
  "The Future Campaign",
  "Styling Campaign Work",
];

export default function ArchivePhotos({ params }) {
  const { slug } = use(params);
  const [model, setModel] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const modelData = await sanityClient.fetch(getModelBySlugQuery, { slug });
      if (modelData) {
        const postsData = await sanityClient.fetch(getModelPosts, {
          modelId: modelData._id,
        });
        setModel(modelData);
        setPosts(postsData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="fb-box">
        <div className="fb-box__body" style={{ padding: "20px", textAlign: "center" }}>
          Loading photos...
        </div>
      </div>
    );
  }

  if (!model) return null;

  const baseUrl = `/archive/${slug}`;

  const photos = posts.map((post) => postToPhoto(post, 800));

  // Group photos by album
  const albums = {};
  photos.forEach((photo) => {
    if (!albums[photo.album]) {
      albums[photo.album] = [];
    }
    albums[photo.album].push(photo);
  });

  // Separate Styling sub-groups from standalone albums
  const stylingEntries = STYLING_SUBGROUPS.filter((name) => albums[name]?.length).map(
    (name) => [name, albums[name]]
  );
  const stylingTotalCount = stylingEntries.reduce(
    (sum, [, list]) => sum + list.length,
    0
  );

  const otherEntries = Object.entries(albums).filter(
    ([albumName]) => !STYLING_SUBGROUPS.includes(albumName)
  );

  return (
    <>
      <TabNav baseUrl={baseUrl} />

      <div className="fb-box">
        <div className="fb-box__header">
          Photos of {model.name}
          <span className="fb-box__header-edit">{photos.length} photos</span>
        </div>
        <div className="fb-box__body">
          {stylingEntries.length > 0 && (
            <div className="category-group">
              <div className="category-group__title">
                <span>Styling</span>
                <span className="category-group__count">
                  {stylingTotalCount} photos · {stylingEntries.length} campaigns
                </span>
              </div>
              {stylingEntries.map(([albumName, albumPhotos]) => (
                <div key={albumName} className="album-section">
                  <div className="album-header">
                    <span>{albumName}</span>
                    <span className="album-header__count">
                      {albumPhotos.length} photos
                    </span>
                  </div>
                  <PhotoGrid photos={albumPhotos} onPhotoClick={setLightboxPhoto} />
                </div>
              ))}
            </div>
          )}

          {otherEntries.map(([albumName, albumPhotos]) => (
            <div key={albumName} className="category-group">
              <div className="category-group__title">
                <span>{albumName}</span>
                <span className="category-group__count">
                  {albumPhotos.length} photos
                </span>
              </div>
              <div className="album-section">
                <PhotoGrid photos={albumPhotos} onPhotoClick={setLightboxPhoto} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxPhoto && (
        <Lightbox
          photos={photos}
          currentPhoto={lightboxPhoto}
          onClose={() => setLightboxPhoto(null)}
          onNavigate={setLightboxPhoto}
        />
      )}
    </>
  );
}
