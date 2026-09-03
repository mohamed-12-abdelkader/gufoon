import React, { useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { FaPercent, FaClipboardList, FaChartLine, FaBell, FaFileImport } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { MdCategory, MdColorLens, MdOutlineBrandingWatermark } from "react-icons/md";

const AdminLinks = ({ currentLink, setCurrentLink }) => {
  const location = useLocation();

  const links = [
    { link: "لوحة تحكم المبيعات", path: "/admin/sales", icon: <FaChartLine className="text-indigo-600" /> },
    { link: "لوحة تحكم التصنيفات", path: "/admin/categories", icon: <FaChartLine className="text-indigo-600" /> },
    { link: "كل الطلبات", path: "/admin/all_order", icon: <FaClipboardList className="text-teal-500" /> },
    { link: "واتساب", path: "/admin/whatsapp", icon: <FaWhatsapp className="text-success" /> },
    { link: "الإشعارات", path: "/admin/notifications", icon: <FaBell className="text-yellow-500" /> },
    { link: "اضافة منتج", path: "/admin/add_product", icon: <AiOutlineAppstoreAdd className="text-red-500" /> },
    { link: "استيراد المنتجات", path: "/admin/import_products", icon: <FaFileImport className="text-green-500" /> },
    { link: "اضافة خصم", path: "/admin/add_discount", icon: <FaPercent className="text-purple-500" /> },
    { link: "كوبونات الخصم", path: "/admin/coupons", icon: <FaPercent className="text-green-600" /> },
    { link: "اضافة فئة", path: "/admin/add_category", icon: <MdCategory className="text-green-500" /> },
    { link: "اضافة براند", path: "/admin/add_brand", icon: <MdOutlineBrandingWatermark className="text-blue-600" /> },
    { link: "اضافة لون", path: "/admin/add_color", icon: <MdColorLens className="text-orange-500" /> },
  ];

  useEffect(() => {
    setCurrentLink(location.pathname);
  }, [location.pathname, setCurrentLink]);

  return (
    <div className="dir-rtl p-5 space-y-3">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded shadow-sm transition admin-side-link ${isActive ? "is-active" : ""}`
          }
          onClick={() => setCurrentLink(link.path)}
        >
          <span className="text-lg">{link.icon}</span>
          <h6 className="font-bold">{link.link}</h6>
        </NavLink>
      ))}
      <style>{`
        .admin-side-link {
          background: var(--card-bg);
          color: var(--text-primary) !important;
          border: 1px solid var(--border-color);
        }
        .admin-side-link h6 {
          color: inherit !important;
          margin: 0 !important;
        }
        .admin-side-link.is-active {
          background: #006C35;
          color: #fff !important;
          border-color: #006C35;
        }
      `}</style>
    </div>
  );
};

export default AdminLinks;
