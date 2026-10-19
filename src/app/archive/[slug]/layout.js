"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { sanityClient } from "@/sanity/client";
import { getModelBySlug as getModelBySlugQuery } from "@/sanity/queries";

export default function ArchiveLayout({ children, params }) {
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
          Loading archive...
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="fb-box">
        <div className="fb-box__body">Archive not found.</div>
      </div>
    );
  }

  const baseUrl = `/archive/${slug}`;
  const themeStyles = model.themeColor ? {
    "--fb-blue": model.themeColor,
    "--fb-blue-dark": `color-mix(in srgb, ${model.themeColor}, black 20%)`,
    "--fb-blue-light": `color-mix(in srgb, ${model.themeColor}, white 20%)`,
    "--fb-blue-pale": `color-mix(in srgb, ${model.themeColor}, white 85%)`,
    "--fb-text-link": model.themeColor,
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={themeStyles}
    >
      {/* Profile Bar */}
      <div className="profile-bar profile-bar--archive">
        <div className="profile-bar__inner">
          <span>Profile · {model.name}</span>
          <span className="profile-bar__right">{model.location}</span>
        </div>
      </div>

      {/* Archive Layout — Sidebar + Content */}
      <div className="archive-layout">
        <Sidebar model={model} baseUrl={baseUrl} />
        <main className="fb-content">{children}</main>
      </div>
    </motion.div>
  );
}
