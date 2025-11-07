import Carousel from "react-bootstrap/Carousel";

const SectionOne = () => {
  const heroImages = [
    '1ca2f997-ae86-4d81-ac25-f13540de531a.jpg',
    '9ef30d56-1f51-496d-96e1-460db5c051e5.jpg',
    '4999c4b6-05ae-44c2-adae-cdfaeb883514.jpg'
  ];

  return (
    <div className="hero-carousel-wrapper">
      <Carousel 
        className='hero-carousel'
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
                alt={`Hero slide ${index + 1}`}
                className="hero-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      
      <style>{`
        .hero-carousel-wrapper {
          width: 100%;
          margin-top: 0;
          position: relative;
        }
        
        .hero-carousel {
          width: 100%;
        }
        
        .hero-image-container {
          width: 100%;
          height: 0;
          padding-bottom: 40%; /* Aspect ratio 2.5:1 */
          position: relative;
          overflow: hidden;
          background: #f0f0f0;
        }
        
        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: auto;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
        
        /* Carousel Controls Styling */
        .hero-carousel .carousel-control-prev,
        .hero-carousel .carousel-control-next {
          width: 50px;
          height: 50px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
          opacity: 0.8;
        }
        
        .hero-carousel .carousel-control-prev:hover,
        .hero-carousel .carousel-control-next:hover {
          background: rgba(0, 0, 0, 0.5);
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
        
        /* Carousel Indicators */
        .hero-carousel .carousel-indicators {
          bottom: 20px;
          margin-bottom: 0;
        }
        
        .hero-carousel .carousel-indicators button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: 2px solid rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          margin: 0 5px;
        }
        
        .hero-carousel .carousel-indicators button.active {
          background: white;
          transform: scale(1.2);
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .hero-image-container {
            padding-bottom: 60%; /* Taller aspect ratio for mobile */
          }
          
          .hero-carousel .carousel-control-prev,
          .hero-carousel .carousel-control-next {
            width: 40px;
            height: 40px;
          }
          
          .hero-carousel .carousel-control-prev {
            right: 10px;
          }
          
          .hero-carousel .carousel-control-next {
            left: 10px;
          }
          
          .hero-carousel .carousel-control-prev-icon,
          .hero-carousel .carousel-control-next-icon {
            width: 16px;
            height: 16px;
          }
          
          .hero-carousel .carousel-indicators {
            bottom: 15px;
          }
          
          .hero-carousel .carousel-indicators button {
            width: 10px;
            height: 10px;
            margin: 0 4px;
          }
        }
        
        @media (max-width: 576px) {
          .hero-image-container {
            padding-bottom: 70%; /* Even taller for small mobile */
          }
          
          .hero-carousel .carousel-control-prev,
          .hero-carousel .carousel-control-next {
            width: 35px;
            height: 35px;
          }
          
          .hero-carousel .carousel-control-prev {
            right: 5px;
          }
          
          .hero-carousel .carousel-control-next {
            left: 5px;
          }
          
          .hero-carousel .carousel-indicators {
            bottom: 10px;
          }
          
          .hero-carousel .carousel-indicators button {
            width: 8px;
            height: 8px;
            margin: 0 3px;
          }
        }
        
        @media (min-width: 1200px) {
          .hero-image-container {
            padding-bottom: 35%; /* Wider aspect ratio for large screens */
          }
        }
        
        /* High DPI Displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .hero-image {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }
      `}</style>
    </div>
  );
};

export default SectionOne;
