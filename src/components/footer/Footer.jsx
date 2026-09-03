import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaSnapchatGhost,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import logo from "../../images/logo-removebg-preview.png";

const branches = [
  {
    name: "العوالي",
    address: "العوالي النازل — بعد مستشفى الزهراء",
    phone: "0509835911",
  },
  {
    name: "الخالدية",
    address: "طريق الهجرة الفرعي — قبل مطعم شواية بلدي",
    phone: "0501804080",
  },
  {
    name: "شوران",
    address: "المدينة المنورة",
    phone: "0569413666",
  },
  {
    name: "محافظة بدر",
    address: "شارع الملك فيصل — بجوار محلات بن مسفر",
    phone: "0548416820",
  },
];

const quickLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/products", label: "منتجاتنا" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "اتصل بنا" },
  { to: "/faq", label: "الأسئلة الشائعة" },
];

const socials = [
  { href: "https://www.instagram.com/yourprofile", label: "Instagram", icon: <FaInstagram /> },
  { href: "https://www.tiktok.com/@yourprofile", label: "TikTok", icon: <SiTiktok /> },
  { href: "https://www.snapchat.com/add/yourusername", label: "Snapchat", icon: <FaSnapchatGhost /> },
  { href: "https://www.facebook.com/yourpage", label: "Facebook", icon: <FaFacebookF /> },
];

const Footer = () => {
  return (
    <footer className="site-footer" dir="rtl">
      <div className="site-footer-stripe" aria-hidden="true" />

      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link to="/" className="site-footer-logo">
              <img src={logo} alt="جفون للبصريات" />
            </Link>
            <p className="site-footer-tagline">
              متجرك الموثوق للنظارات الطبية والشمسية والعدسات اللاصقة في المدينة المنورة وبدر.
            </p>
            <div className="site-footer-hours">
              <FaClock />
              <span>يومياً من 10 صباحاً حتى 11 مساءً</span>
            </div>
            <div className="site-footer-actions">
              <a className="site-footer-hotline" href="tel:0569413666">
                <FaPhoneAlt />
                0569413666
              </a>
              <a
                className="site-footer-whatsapp"
                href="https://wa.me/966569413666"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
                واتساب
              </a>
            </div>
          </div>

          <div>
            <h4 className="site-footer-title">فروعنا</h4>
            <div className="site-footer-branches">
              {branches.map((branch) => (
                <article key={branch.name} className="site-footer-branch">
                  <h5>
                    <FaMapMarkerAlt />
                    {branch.name}
                  </h5>
                  <p>{branch.address}</p>
                  <a href={`tel:${branch.phone}`}>
                    <FaPhoneAlt />
                    {branch.phone}
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="site-footer-side">
            <div>
              <h4 className="site-footer-title">روابط سريعة</h4>
              <ul className="site-footer-links">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="site-footer-title">تابعنا</h4>
              <p className="site-footer-social-text">
                العروض والمجموعات الجديدة أولاً بأول.
              </p>
              <div className="site-footer-socials">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-bottom-inner">
          <p>© {new Date().getFullYear()} جفون للبصريات — جميع الحقوق محفوظة</p>
          <p className="site-footer-hash">#GUFOON_OPTICALS</p>
        </div>
      </div>

      <style>{`
        .site-footer {
          position: relative;
          margin-top: 2.5rem;
          background: #08140f;
          color: #e8f7ee;
          overflow: hidden;
        }

        .site-footer-stripe {
          height: 4px;
          background: linear-gradient(90deg, #004d26, #006C35, #0a8f48, #006C35, #004d26);
        }

        .site-footer-inner {
          width: min(1180px, calc(100% - 2rem));
          margin: 0 auto;
          padding: 2.6rem 0 2rem;
        }

        .site-footer-grid {
          display: grid;
          grid-template-columns: 1.05fr 1.45fr 0.85fr;
          gap: 2.2rem 2rem;
          align-items: start;
        }

        .site-footer-logo img {
          height: 52px;
          width: auto;
          max-width: 190px;
          object-fit: contain;
          display: block;
        }

        .site-footer-tagline {
          margin: 1rem 0 0.85rem !important;
          color: #c5d6cb !important;
          font-size: 0.95rem;
          line-height: 1.8 !important;
          max-width: 34ch;
        }

        .site-footer-hours {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #9fb5a6 !important;
          font-size: 0.84rem;
          margin-bottom: 1rem;
        }

        .site-footer-hours svg {
          color: #3d9a63;
          flex-shrink: 0;
        }

        .site-footer-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .site-footer-hotline,
        .site-footer-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border-radius: 999px;
          padding: 0.52rem 0.95rem;
          font-weight: 800;
          font-size: 0.88rem;
        }

        .site-footer-hotline {
          background: #006C35;
          color: #fff !important;
        }

        .site-footer-hotline:hover {
          background: #0a8f48;
          color: #fff !important;
        }

        .site-footer-whatsapp {
          background: transparent;
          color: #fff !important;
          border: 1px solid rgba(0, 108, 53, 0.7);
        }

        .site-footer-whatsapp:hover {
          background: #128c3a;
          border-color: #128c3a;
          color: #fff !important;
        }

        .site-footer-title {
          position: relative;
          margin: 0 0 1.15rem !important;
          padding-bottom: 0.55rem;
          font-size: 1.05rem !important;
          font-weight: 800 !important;
          color: #ffffff !important;
        }

        .site-footer-title::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          width: 42px;
          height: 3px;
          border-radius: 99px;
          background: #006C35;
        }

        .site-footer-branches {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .site-footer-branch {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 108, 53, 0.22);
          border-radius: 14px;
          padding: 0.85rem 0.9rem;
          min-height: 100%;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .site-footer-branch:hover {
          border-color: #006C35;
          transform: translateY(-2px);
        }

        .site-footer-branch h5 {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin: 0 0 0.35rem !important;
          font-size: 0.95rem !important;
          font-weight: 800 !important;
          color: #f3faf6 !important;
        }

        .site-footer-branch h5 svg {
          color: #3d9a63;
          flex-shrink: 0;
        }

        .site-footer-branch p {
          margin: 0 0 0.45rem !important;
          color: #a9bdb0 !important;
          font-size: 0.78rem;
          line-height: 1.55 !important;
        }

        .site-footer-branch a {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #7dce9a !important;
          font-size: 0.84rem;
          font-weight: 800;
        }

        .site-footer-branch a:hover {
          color: #fff !important;
        }

        .site-footer-side {
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        .site-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 0.45rem;
        }

        .site-footer-links a {
          color: #d4e4d9 !important;
          font-weight: 600;
          display: inline-block;
        }

        .site-footer-links a:hover {
          color: #7dce9a !important;
          transform: translateX(-3px);
        }

        .site-footer-social-text {
          margin: 0 0 0.85rem !important;
          color: #a9bdb0 !important;
          font-size: 0.86rem;
        }

        .site-footer-socials {
          display: flex;
          gap: 0.5rem;
        }

        .site-footer-socials a {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 108, 53, 0.18);
          color: #fff !important;
          border: 1px solid rgba(0, 108, 53, 0.4);
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .site-footer-socials a:hover {
          background: #006C35;
          color: #fff !important;
          transform: translateY(-2px);
        }

        .site-footer-bottom {
          background: #006C35;
        }

        .site-footer-bottom-inner {
          width: min(1180px, calc(100% - 2rem));
          margin: 0 auto;
          padding: 0.9rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .site-footer-bottom p {
          margin: 0 !important;
          color: rgba(255, 255, 255, 0.88) !important;
          font-size: 0.82rem;
        }

        .site-footer-hash {
          color: #fff !important;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        @media (max-width: 991px) {
          .site-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
          .site-footer-side {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            gap: 2rem;
          }
        }

        @media (max-width: 640px) {
          .site-footer-inner {
            padding: 2rem 0 1.4rem;
          }
          .site-footer-grid,
          .site-footer-branches {
            grid-template-columns: 1fr;
          }
          .site-footer-side {
            flex-direction: column;
            gap: 1.4rem;
          }
          .site-footer-bottom-inner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
