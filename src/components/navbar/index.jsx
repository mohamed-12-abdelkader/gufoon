import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navsearch from "./Navsearch";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import ChatNotificationBadge from "../chat/ChatNotificationBadge";
import baseUrl from "../../api/baseUrl";

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.categories)) return data.categories;
  return [];
};

const normalize = (items) =>
  toList(items)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      children: toList(cat.children || cat.subCategories || cat.subs),
    }))
    .filter((cat) => cat.id && cat.name);

function NavbarComponent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isAuthenticated } = useAuth();
  const { isConnected } = useChat();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const endpoints = [
        "/api/categories/hierarchy",
        "/api/categories/main",
        "/api/categories",
        "/api/categories/homepage",
      ];

      for (const url of endpoints) {
        try {
          const { data } = await baseUrl.get(url);
          const list = normalize(data);
          if (list.length) {
            setCategories(list);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("Navbar categories:", url, error);
        }
      }

      setCategories([]);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="sticky top-0" style={{ zIndex: 1050 }}>
      <Navsearch />

      <nav className="site-cats-bar" dir="rtl" aria-label="تصنيفات الموقع">
        <div className="site-cats-inner">
          {loading ? (
            <span className="site-cats-status">جاري تحميل التصنيفات...</span>
          ) : categories.length === 0 ? (
            <span className="site-cats-status">لا توجد تصنيفات</span>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="site-cat">
                <Link to={`/categories/${category.id}`} className="site-cat-link">
                  {category.name}
                </Link>
                {category.children.length > 0 && (
                  <div className="site-cat-menu">
                    <Link to={`/categories/${category.id}`} className="site-cat-child">
                      عرض الكل
                    </Link>
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        to={`/categories/${child.id}`}
                        className="site-cat-child"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}

          {isAdmin() && (
            <Link to="/admin" className="site-cat-link site-cat-extra">
              صفحة الأدمن
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to={isAdmin() ? "/admin/chat" : "/chat"}
              className="site-cat-link site-cat-extra"
            >
              {isAdmin() ? "إدارة المحادثات" : "الدردشة"}
              <span className={`site-cat-dot ${isConnected ? "on" : "off"}`} />
              <ChatNotificationBadge />
            </Link>
          )}
        </div>
      </nav>

      <style>{`
        .site-cats-bar {
          background: linear-gradient(180deg, #0a7a3e 0%, #006C35 100%);
          border-top: 1px solid rgba(212, 175, 119, 0.35);
          border-bottom: 1px solid rgba(244, 234, 216, 0.12);
        }
        .site-cats-inner {
          width: min(1400px, calc(100% - 1.5rem));
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.15rem 0.2rem;
          min-height: 48px;
          padding: 0.25rem 0;
        }
        .site-cats-status {
          color: #fff !important;
          font-weight: 600;
          padding: 0.5rem;
        }
        .site-cat {
          position: relative;
        }
        .site-cat-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #ffffff !important;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.55rem 0.9rem;
          border-radius: 8px;
          white-space: nowrap;
        }
        .site-cat-link:hover,
        .site-cat:hover > .site-cat-link {
          background: rgba(244, 234, 216, 0.16);
          color: #f4ead8 !important;
        }
        .site-cat-menu {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 210px;
          background: #161412;
          border: 1px solid rgba(212, 175, 119, 0.28);
          border-radius: 12px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
          padding: 0.4rem;
          z-index: 1200;
        }
        .site-cat:hover .site-cat-menu,
        .site-cat:focus-within .site-cat-menu {
          display: flex;
          flex-direction: column;
        }
        .site-cat-child {
          color: #f3faf6 !important;
          font-weight: 600;
          padding: 0.5rem 0.8rem;
          border-radius: 8px;
          text-align: right;
        }
        .site-cat-child:hover {
          background: rgba(212, 175, 119, 0.16);
          color: #d4af77 !important;
        }
        .site-cat-extra {
          font-size: 0.88rem;
        }
        .site-cat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .site-cat-dot.on { background: #86efac; }
        .site-cat-dot.off { background: #f87171; }
        @media (max-width: 767px) {
          .site-cats-inner {
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .site-cats-inner::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  );
}

export default NavbarComponent;
