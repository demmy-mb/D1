"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import TabNav from "@/components/TabNav";
import { sanityClient } from "@/sanity/client";
import { getModelBySlug as getModelBySlugQuery } from "@/sanity/queries";

function Row({ label, children }) {
  if (!children) return null;
  return (
    <div className="info-table__row">
      <span className="info-table__label">{label}:</span>
      <span className="info-table__value">{children}</span>
    </div>
  );
}

export default function ArchiveInfo({ params }) {
  const { slug } = use(params);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(getModelBySlugQuery, { slug })
      .then((data) => {
        setModel(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="fb-box">
        <div className="fb-box__body" style={{ padding: "20px", textAlign: "center" }}>
          Loading info...
        </div>
      </div>
    );
  }

  if (!model) return null;

  const baseUrl = `/archive/${slug}`;
  const emails = [model.contact, ...(model.emails || [])].filter(Boolean);
  const stats = model.stats || {};
  const hasStats = Object.values(stats).some(Boolean);

  return (
    <>
      <TabNav baseUrl={baseUrl} />

      <div className="fb-box">
        <div className="fb-box__header">About</div>
        <div className="fb-box__body">
          <p className="info-bio">{model.bio}</p>
          {model.quote && (
            <blockquote className="info-quote">“{model.quote}”</blockquote>
          )}
        </div>
      </div>

      {model.categories?.length > 0 && (
        <div className="fb-box">
          <div className="fb-box__header">Categories</div>
          <div className="fb-box__body">
            <div className="info-tags">
              {model.categories.map((cat) => (
                <span key={cat} className="info-tag">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fb-box">
        <div className="fb-box__header">Contacts</div>
        <div className="fb-box__body">
          <Row label="Phone">
            {model.phone && <a href={`tel:${model.phone}`}>{model.phone}</a>}
          </Row>
          <Row label="Instagram">
            {model.instagram && (
              <a
                href={`https://instagram.com/${model.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{model.instagram.replace(/^@/, "")}
              </a>
            )}
          </Row>
          <Row label={emails.length > 1 ? "Emails" : "Email"}>
            {emails.length > 0 &&
              emails.map((email) => (
                <a key={email} href={`mailto:${email}`} className="info-email">
                  {email}
                </a>
              ))}
          </Row>
        </div>
      </div>

      <div className="fb-box">
        <div className="fb-box__header">Basic Information</div>
        <div className="fb-box__body">
          <Row label="Name">{model.name}</Row>
          <Row label="Tagline">{model.tagline}</Row>
          <Row label="Location">{model.location}</Row>
          <Row label="Agency">{model.agency}</Row>
          <Row label="Member Since">{model.joined}</Row>
        </div>
      </div>

      {hasStats && (
        <div className="fb-box">
          <div className="fb-box__header">Measurements</div>
          <div className="fb-box__body">
            <Row label="Height">{stats.height}</Row>
            <Row label="Bust">{stats.bust}</Row>
            <Row label="Waist">{stats.waist}</Row>
            <Row label="Hips">{stats.hips}</Row>
            <Row label="Shoe Size">{stats.shoe}</Row>
            <Row label="Eye Color">{stats.eyes}</Row>
            <Row label="Hair Color">{stats.hair}</Row>
          </div>
        </div>
      )}
    </>
  );
}
