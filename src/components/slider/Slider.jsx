import { useRef, useState } from "react";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";

const Slider = ({ children, className = "" }) => {
  const sliderRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (e.pointerType === "touch") return;
    setIsDown(true);
    sliderRef.current.classList.add("active");
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const stopDrag = () => {
    setIsDown(false);
    sliderRef.current?.classList.remove("active");
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    sliderRef.current.scrollLeft = scrollLeft - (x - startX);
  };

  const scrollByTrack = (dir) => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: dir * sliderRef.current.offsetWidth * 0.7,
      behavior: "smooth",
    });
  };

  return (
    <div dir="rtl" className={`g-slider ${className}`.trim()}>
      <div
        className="g-slider-track"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>

      <button
        type="button"
        className="g-slider-btn prev"
        onClick={() => scrollByTrack(-1)}
        aria-label="السابق"
      >
        <GoChevronLeft />
      </button>
      <button
        type="button"
        className="g-slider-btn next"
        onClick={() => scrollByTrack(1)}
        aria-label="التالي"
      >
        <GoChevronRight />
      </button>

      <style>{`
        .g-slider {
          position: relative;
          margin: 0;
          padding: 0 52px;
        }
        .g-slider-track {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
          padding: 10px 4px 14px;
        }
        .g-slider-track::-webkit-scrollbar {
          display: none;
        }
        .g-slider-track.active {
          cursor: grabbing;
          scroll-behavior: auto;
        }
        .g-slider-track > * {
          flex: 0 0 auto;
        }
        .g-slider-track > .product-card {
          flex: 0 0 250px;
          width: 250px;
          max-width: 250px;
        }
        .g-slider-btn {
          position: absolute;
          top: 46%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: #006C35;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
        }
        .g-slider-btn.prev { left: 0; }
        .g-slider-btn.next { right: 0; }
        .g-slider-btn svg {
          width: 22px;
          height: 22px;
        }
        @media (max-width: 767px) {
          .g-slider {
            padding: 0;
          }
          .g-slider-btn {
            display: none;
          }
          .g-slider-track {
            gap: 0.7rem;
            padding: 6px 2px 12px;
            scroll-snap-type: x mandatory;
            scroll-behavior: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Slider;
