"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { sanityClient } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { getAllModels } from "@/sanity/queries";

export default function TalentGallery() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch(getAllModels).then((data) => {
      setModels(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="fb-box">
        <div className="fb-box__header">Talent Gallery</div>
        <div className="fb-box__body">
          <p style={{ padding: "20px", textAlign: "center", color: "#999" }}>
            Loading profiles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fb-box">
        <div className="fb-box__header">
          Talent Gallery
          <span className="fb-box__header-edit">
            {models.length} archived profiles
          </span>
        </div>
        <div className="fb-box__body">
          <div className="talent-gallery">
            {models.map((model, i) => (
              <Link
                key={model._id}
                href={`/archive/${model.slug}`}
                className="talent-card"
              >
                <motion.div
                  className="talent-card__inner"
                  style={model.themeColor ? { "--fb-blue": model.themeColor, borderColor: "var(--fb-blue)" } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <div className="talent-card__image-wrap">
                    {model.profileImage ? (
                      <Image
                        src={urlFor(model.profileImage)
                          .width(900)
                          .height(1125)
                          .url()}
                        alt={model.name}
                        width={900}
                        height={1125}
                        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 360px"
                        priority={i < 2}
                        className="talent-card__image"
                      />
                    ) : (
                      <div
                        className="talent-card__image"
                        style={{
                          width: 300,
                          height: 375,
                          background: "#eee",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="talent-card__info">
                    <div className="talent-card__name">{model.name}</div>
                    <div className="talent-card__tagline">{model.tagline}</div>
                    <div className="talent-card__cta">View Archive →</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
