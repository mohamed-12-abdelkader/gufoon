import Carousel from "react-bootstrap/Carousel";

const SectionOne = () => {
  const heroImages = [
    "/d05272fd-11f8-4eee-83df-1cd818c4c392.jfif",
    "/995c7807-a1c9-4507-8604-4e9bba15d9a5.jfif",
    "/5ae97612-6ebe-4db0-8abc-48db208ebab0.jfif",
  ];

  return (
    <section className="hero-carousel-wrapper" aria-label="معرض الصور الرئيسي">
      <Carousel
        className="hero-carousel"
        fade
        interval={5000}
        indicators={true}
        controls={true}
      >
        {heroImages.map((image, index) => (
          <Carousel.Item key={index}>
            <div className="hero-image-container">
              <img
                src={image}
                alt={`شريحة ${index + 1}`}
                className="hero-image"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <style>{`
        .hero-carousel-wrapper {
          width: 100%;
          margin: 0;
          position: relative;
          overflow: hidden;
        }

        .hero-carousel {
          width: 100%;
        }

        .hero-carousel .carousel-item {
          overflow: hidden;
        }

        .hero-image-container {
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #1a1a1a;
          /* Desktop: بنر عريض */
          aspect-ratio: 21 / 9;
          min-height: 280px;
        }

        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        /* Carousel Controls */
        .hero-carousel .carousel-control-prev,
        .hero-carousel .carousel-control-next {
          width: 48px;
          height: 48px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          backdrop-filter: blur(6px);
          transition: background 0.2s, opacity 0.2s;
          opacity: 0.9;
        }

        .hero-carousel .carousel-control-prev:hover,
        .hero-carousel .carousel-control-next:hover {
          background: rgba(0, 0, 0, 0.6);
          opacity: 1;
        }

        .hero-carousel .carousel-control-prev {
          right: 20px;
          left: auto;
        }

        .hero-carousel .carousel-control-next {
          left: 20px;
          right: auto;
        }

        .hero-carousel .carousel-control-prev-icon,
        .hero-carousel .carousel-control-next-icon {
          width: 20px;
          height: 20px;
        }

        .hero-carousel .carousel-indicators {
          bottom: 20px;
          margin-bottom: 0;
        }

        .hero-carousel .carousel-indicators button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.9);
          transition: transform 0.2s, background 0.2s;
          margin: 0 4px;
        }

        .hero-carousel .carousel-indicators button.active {
          background: #fff;
          transform: scale(1.25);
        }

        /* تابلت */
        @media (max-width: 991px) {
          .hero-image-container {
            aspect-ratio: 16 / 10;
            min-height: 260px;
          }
        }

        /* موبايل */
        @media (max-width: 768px) {
          .hero-image-container {
            aspect-ratio: 4 / 5;
            min-height: 320px;
          }

          .hero-carousel .carousel-control-prev,
          .hero-carousel .carousel-control-next {
            width: 40px;
            height: 40px;
          }

          .hero-carousel .carousel-control-prev {
            right: 12px;
          }

          .hero-carousel .carousel-control-next {
            left: 12px;
          }

          .hero-carousel .carousel-control-prev-icon,
          .hero-carousel .carousel-control-next-icon {
            width: 18px;
            height: 18px;
          }

          .hero-carousel .carousel-indicators {
            bottom: 16px;
          }

          .hero-carousel .carousel-indicators button {
            width: 8px;
            height: 8px;
            margin: 0 3px;
          }
        }

        /* موبايل صغير */
        @media (max-width: 480px) {
          .hero-image-container {
            aspect-ratio: 3 / 4;
            min-height: 300px;
          }

          .hero-carousel .carousel-control-prev,
          .hero-carousel .carousel-control-next {
            width: 36px;
            height: 36px;
          }

          .hero-carousel .carousel-control-prev {
            right: 8px;
          }

          .hero-carousel .carousel-control-next {
            left: 8px;
          }

          .hero-carousel .carousel-indicators {
            bottom: 12px;
          }

          .hero-carousel .carousel-indicators button {
            width: 6px;
            height: 6px;
            margin: 0 2px;
          }
        }

        /* شاشات كبيرة */
        @media (min-width: 1200px) {
          .hero-image-container {
            aspect-ratio: 21 / 8;
            max-height: 520px;
          }

          .hero-image {
            object-fit: cover;
          }
        }
      `}</style>
    </section>
  );
};

export default SectionOne;
