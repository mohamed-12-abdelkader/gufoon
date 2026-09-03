import Carousel from "react-bootstrap/Carousel";

const HERO_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 7) % 88)}%`,
  delay: `${(i * 0.55) % 6}s`,
  duration: `${9 + (i % 5)}s`,
  size: 3 + (i % 4),
}));

const SectionOne = () => {
  const heroImages = [
    {
      src: "/hero/hero-1.png",
      alt: "جفون للبصريات — اختيارك لنظارتك مو عادي",
    },
    {
      src: "/hero/hero-2.png",
      alt: "جفون للبصريات — نظارة تفرض حضورك وتعكس شخصيتك",
    },
    {
      src: "/hero/hero-3.png",
      alt: "جفون للبصريات — نختار لهم الأفضل لعيونهم",
    },
  ];

  return (
    <section className="hero-carousel-wrapper" aria-label="معرض الصور الرئيسي">
      <div className="hero-fx" aria-hidden="true">
        <span className="hero-glow hero-glow-a" />
        <span className="hero-glow hero-glow-b" />
        <span className="hero-scan" />
        {HERO_PARTICLES.map((p) => (
          <span
            key={p.id}
            className="hero-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <Carousel
        className="hero-carousel"
        fade
        interval={5500}
        indicators
        controls
        pause="hover"
      >
        {heroImages.map((image, index) => (
          <Carousel.Item key={image.src}>
            <div className="hero-image-container">
              <img
                src={image.src}
                alt={image.alt}
                className="hero-image"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>{`
        .hero-carousel-wrapper {
          width: 100%;
          max-width: none;
          margin: 0;
          position: relative;
          overflow: hidden;
          background: #04180f;
        }

        .hero-fx {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 2;
          overflow: hidden;
        }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.35;
        }

        .hero-glow-a {
          width: 280px;
          height: 280px;
          background: rgba(0, 108, 53, 0.55);
          top: -80px;
          right: 8%;
          animation: heroDriftA 14s ease-in-out infinite;
        }

        .hero-glow-b {
          width: 220px;
          height: 220px;
          background: rgba(212, 175, 119, 0.18);
          bottom: -70px;
          left: 12%;
          animation: heroDriftB 18s ease-in-out infinite;
        }

        .hero-scan {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 108, 53, 0.12) 48%,
            transparent 56%
          );
          animation: heroScan 7s ease-in-out infinite;
          mix-blend-mode: screen;
        }

        .hero-particle {
          position: absolute;
          bottom: -8px;
          border-radius: 50%;
          background: rgba(125, 206, 154, 0.7);
          box-shadow: 0 0 10px rgba(0, 108, 53, 0.55);
          animation-name: heroRise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .hero-carousel {
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .hero-carousel .carousel-inner,
        .hero-carousel .carousel-item {
          overflow: hidden;
          background: #04180f;
        }

        .hero-image-container {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #04180f;
          aspect-ratio: 1024 / 427;
        }

        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
          display: block;
          transform: none;
          image-rendering: auto;
        }

        .hero-carousel .carousel-control-prev,
        .hero-carousel .carousel-control-next {
          width: 44px;
          height: 44px;
          background: rgba(4, 24, 15, 0.55);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          backdrop-filter: blur(8px);
          opacity: 0.95;
          border: 1px solid rgba(0, 108, 53, 0.35);
          transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }

        .hero-carousel .carousel-control-prev:hover,
        .hero-carousel .carousel-control-next:hover {
          background: rgba(0, 108, 53, 0.9);
          opacity: 1;
          box-shadow: 0 0 18px rgba(0, 108, 53, 0.45);
        }

        .hero-carousel .carousel-control-prev {
          right: 16px;
          left: auto;
        }

        .hero-carousel .carousel-control-next {
          left: 16px;
          right: auto;
        }

        .hero-carousel .carousel-control-prev-icon,
        .hero-carousel .carousel-control-next-icon {
          width: 18px;
          height: 18px;
        }

        .hero-carousel .carousel-indicators {
          bottom: 10px;
          margin-bottom: 0;
          z-index: 3;
        }

        .hero-carousel .carousel-indicators button {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.8);
          margin: 0 4px;
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .hero-carousel .carousel-indicators button.active {
          background: var(--accent, #006C35);
          border-color: var(--accent, #006C35);
          transform: scale(1.25);
          animation: heroPulse 1.8s ease-in-out infinite;
        }

        @keyframes heroDriftA {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, 30px); }
        }

        @keyframes heroDriftB {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, -24px); }
        }

        @keyframes heroScan {
          0% { transform: translateY(-60%); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.4; }
          100% { transform: translateY(60%); opacity: 0; }
        }

        @keyframes heroRise {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          12% { opacity: 0.85; }
          100% { transform: translateY(-360px) scale(1); opacity: 0; }
        }

        @keyframes heroPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 108, 53, 0.55); }
          50% { box-shadow: 0 0 0 7px rgba(0, 108, 53, 0); }
        }

        @media (min-width: 992px) {
          .hero-fx {
            display: none;
          }
        }

        @media (max-width: 991px) {
          .hero-image-container {
            position: relative;
            aspect-ratio: 1024 / 427;
          }

          .hero-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            max-height: none;
            object-fit: contain;
            object-position: center center;
          }
        }

        @media (max-width: 768px) {
          .hero-image-container {
            aspect-ratio: 1024 / 427;
          }

          .hero-glow-a,
          .hero-glow-b {
            width: 160px;
            height: 160px;
          }

          .hero-carousel .carousel-control-prev,
          .hero-carousel .carousel-control-next {
            width: 34px;
            height: 34px;
          }

          .hero-carousel .carousel-control-prev {
            right: 8px;
          }

          .hero-carousel .carousel-control-next {
            left: 8px;
          }

          .hero-carousel .carousel-control-prev-icon,
          .hero-carousel .carousel-control-next-icon {
            width: 14px;
            height: 14px;
          }

          .hero-carousel .carousel-indicators {
            bottom: 6px;
          }

          .hero-carousel .carousel-indicators button {
            width: 7px;
            height: 7px;
            margin: 0 3px;
          }
        }

        @media (max-width: 480px) {
          .hero-image-container {
            aspect-ratio: 1024 / 427;
          }

          .hero-image {
            object-position: center center;
          }

          .hero-carousel .carousel-control-prev,
          .hero-carousel .carousel-control-next {
            width: 30px;
            height: 30px;
          }

          .hero-carousel .carousel-control-prev {
            right: 6px;
          }

          .hero-carousel .carousel-control-next {
            left: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-glow,
          .hero-scan,
          .hero-particle,
          .hero-carousel .carousel-item.active .hero-image,
          .hero-carousel .carousel-indicators button.active {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SectionOne;
