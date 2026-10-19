"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Image from "next/image";
import TabNav from "@/components/TabNav";
import WallPost from "@/components/WallPost";
import Lightbox from "@/components/Lightbox";
import { sanityClient } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { postToPhoto } from "@/sanity/photo";
import {
  getModelBySlug as getModelBySlugQuery,
  getModelPosts,
} from "@/sanity/queries";

export default function ArchiveWall({ params }) {
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
          Loading wall...
        </div>
      </div>
    );
  }

  if (!model) return null;

  const baseUrl = `/archive/${slug}`;

  const profileImageUrl = model.profileImage
    ? urlFor(model.profileImage).width(240).height(300).url()
    : null;

  const profileAvatarUrl = model.profileImage
    ? urlFor(model.profileImage).width(80).height(80).url()
    : null;

  const photos = posts.map((post) => postToPhoto(post, 1200));

  return (
    <>
      {/* Compact profile header — keeps the photos above the fold */}
      <div className="fb-box profile-hero">
        <div className="profile-hero__pic">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={model.name}
              width={120}
              height={150}
              priority
            />
          ) : (
            <div className="profile-hero__pic-empty" />
          )}
        </div>
        <div className="profile-hero__info">
          <h1 className="profile-hero__name">{model.name}</h1>
          {model.tagline && (
            <div className="profile-hero__tagline">{model.tagline}</div>
          )}
          <div className="profile-hero__meta">
            {[model.location, model.stats?.height, `${posts.length} photos`]
              .filter(Boolean)
              .join(" · ")}
          </div>
          <div className="profile-hero__actions">
            <a className="fb-btn" href={`mailto:${model.contact}`}>
              Book Me
            </a>
            <a className="fb-btn fb-btn--ghost" href={`${baseUrl}/info`}>
              Info
            </a>
          </div>
        </div>
      </div>

      {/* Tabs + Wall */}
      <TabNav baseUrl={baseUrl} />
      <div className="fb-box fb-box--wall">
        <div className="fb-box__header">
          The Wall
          <span className="fb-box__header-edit">{posts.length} posts</span>
        </div>
        <div className="fb-box__body">
          {photos.map((photo, index) => (
            <WallPost
              key={photo.id}
              photo={photo}
              priority={index === 0}
              model={{
                name: model.name,
                profilePhoto: profileAvatarUrl || "",
              }}
              onImageClick={() => setLightboxPhoto(photo)}
            />
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
