import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGlasses,
  FaSun,
  FaChild,
  FaEye,
  FaFemale,
  FaMale,
} from "react-icons/fa";
import { MdLens } from "react-icons/md";
import Slider from "../slider/Slider";
import baseUrl from "../../api/baseUrl";

const hasCover = (cat) => {
  const cover = cat?.cover || cat?.image;
  if (!cover || typeof cover !== "string") return false;
  const value = cover.trim().toLowerCase();
  return (
    value.length > 0 &&
    value !== "null" &&
    value !== "undefined" &&
    !value.includes("placeholder")
  );
};

const iconForCategory = (name = "", index = 0) => {
  const n = String(name).toLowerCase();
  if (n.includes("شمسي") || n.includes("sun")) return FaSun;
  if (n.includes("عدس") || n.includes("lens") || n.includes("لاصق")) return MdLens;
  if (n.includes("طفل") || n.includes("أطفال") || n.includes("kids") || n.includes("child")) return FaChild;
  if (n.includes("نسائي") || n.includes("حريمي") || n.includes("women")) return FaFemale;
  if (n.includes("رجالي") || n.includes("رجال") || n.includes("men")) return FaMale;
  if (n.includes("طبي") || n.includes("glasses") || n.includes("نظارة")) return FaGlasses;

  const fallbacks = [FaGlasses, FaEye, FaSun, MdLens];
  return fallbacks[index % fallbacks.length];
};

const CategoryChip = ({ cat, index }) => {
  const Icon = iconForCategory(cat.name, index);
  const showImage = hasCover(cat);

  return (
    <div className="home-cat-wrap">
      <Link
        to={`/categories/${cat.id}`}
        className="home-cat-chip"
        style={{ animationDelay: `${(index % 6) * 0.45}s` }}
      >
        <span className={`home-cat-avatar ${showImage ? "" : "is-icon"}`}>
          <span className="home-cat-ring" aria-hidden="true" />
          {showImage ? (
            <img src={cat.cover || cat.image} alt={cat.name} />
          ) : (
            <Icon />
          )}
        </span>
        <span className="home-cat-name">{cat.name}</span>
      </Link>
    </div>
  );
};

const SectionTwo = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const { data } = await baseUrl.get("/api/categories/sub");
        setSubCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  if (loading) {
    return (
      <div className="home-cats-loading">
        <Spinner animation="border" className="home-cats-spinner" />
      </div>
    );
  }

  if (!subCategories.length) return null;

  return (
    <section className="home-cats" dir="rtl">
      <div className="home-cats-inner">
        <motion.header
          className="home-cats-head"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          <span className="home-eyebrow">
            <span className="home-eyebrow-dot" />
            اكتشف
          </span>
          <h2>تصفح التصنيفات</h2>
        </motion.header>

        <Slider className="home-cats-slider">
          {subCategories.map((cat, index) => (
            <CategoryChip key={cat.id} cat={cat} index={index} />
          ))}
        </Slider>
      </div>
      <style>{`
        .home-cats {
          position: relative;
          z-index: 1;
          padding: 2rem 0 0.5rem;
        }
        .home-cats-inner {
          width: min(1200px, calc(100% - 2rem));
          margin: 0 auto;
        }
        .home-cats-head {
          margin-bottom: 1rem;
          text-align: center;
        }
        .home-cats-head h2 {
          margin: 0 !important;
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          color: var(--text-primary) !important;
        }
        .home-cats .home-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--accent) !important;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.14em;
        }
        .home-cats .home-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
        }
        .home-cats-loading {
          display: flex;
          justify-content: center;
          padding: 2rem 0;
        }
        .home-cats-spinner {
          color: var(--accent) !important;
        }
        .home-cats-slider .g-slider-track {
          align-items: flex-start;
          gap: 0.85rem;
          padding: 8px 4px 12px;
        }
        .home-cat-wrap {
          flex: 0 0 108px;
          width: 108px;
        }
        .home-cat-chip {
          flex: 0 0 108px;
          width: 108px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.55rem;
          text-decoration: none;
          padding: 4px;
          animation: catFloat 3.8s ease-in-out infinite;
        }
        .home-cat-avatar {
          position: relative;
          width: 78px;
          height: 78px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(145deg, var(--accent), transparent 72%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .home-cat-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px dashed rgba(125, 206, 154, 0.45);
          animation: catSpin 10s linear infinite;
          pointer-events: none;
        }
        .home-cat-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid var(--bg-primary);
          display: block;
          position: relative;
          z-index: 1;
        }
        .home-cat-avatar.is-icon {
          background: linear-gradient(145deg, #006C35, #0b1611);
          color: #fff;
          font-size: 1.7rem;
          border: 3px solid rgba(0, 108, 53, 0.45);
        }
        .home-cat-wrap:nth-child(3n+2) .home-cat-avatar.is-icon {
          background: linear-gradient(145deg, #d4af77, #1a140c);
          border-color: rgba(212, 175, 119, 0.4);
          color: #f4ead8;
        }
        .home-cat-wrap:nth-child(3n+3) .home-cat-avatar.is-icon {
          background: linear-gradient(145deg, #c4785a, #1a120f);
          border-color: rgba(196, 120, 90, 0.45);
        }
        .home-cat-wrap:nth-child(3n+2) .home-cat-ring {
          border-color: rgba(212, 175, 119, 0.5);
        }
        .home-cat-wrap:nth-child(3n+3) .home-cat-ring {
          border-color: rgba(196, 120, 90, 0.5);
        }
        .home-cat-avatar.is-icon svg {
          position: relative;
          z-index: 1;
          animation: catIconPulse 2.8s ease-in-out infinite;
        }
        .home-cat-chip:hover {
          animation-play-state: paused;
        }
        .home-cat-chip:hover .home-cat-avatar {
          transform: translateY(-4px) scale(1.06);
          box-shadow: 0 0 22px var(--accent-glow);
        }
        .home-cat-chip:hover .home-cat-ring {
          animation-duration: 2.4s;
          border-color: var(--accent);
        }
        .home-cat-name {
          width: 100%;
          color: var(--text-primary) !important;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          line-height: 1.35 !important;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.2em;
        }

        @keyframes catFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes catSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes catIconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @media (max-width: 767px) {
          .home-cat-chip {
            animation: none;
          }
          .home-cat-wrap {
            flex: 0 0 92px;
            width: 92px;
            scroll-snap-align: start;
          }
          .home-cat-chip {
            flex-basis: 92px;
            width: 92px;
          }
          .home-cat-avatar {
            width: 68px;
            height: 68px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-cat-chip,
          .home-cat-ring,
          .home-cat-avatar.is-icon svg {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SectionTwo;
