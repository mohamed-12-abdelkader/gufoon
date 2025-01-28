import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaPercent,
  FaBoxOpen,
  FaCheck,
  FaTruck,
  FaPlusSquare,
  FaGlasses,
  FaEye,
  FaTag,
} from "react-icons/fa";
import { FaClock } from "react-icons/fa";
const AdminLinks = ({ currentLink, setCurrentLink }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  const links = [
    {
      id: Math.random(),
      link: "اضافة خصم",
      path: "/admin/add_discount",
      icon: <FaPercent style={{ color: "#FF6347" }} />, // Tomato Red
    },
    {
      id: Math.random(),
      link: "اضافة براند",
      path: "/admin/add_brand",
      icon: <FaPlusSquare style={{ color: "#4682B4" }} />, // Steel Blue
    },
    {
      id: Math.random(),
      link: "اضافة لون عدسة النظارة",
      path: "/admin/add_color",
      icon: <FaTag style={{ color: "#FF8C00" }} />, // Dark Orange
    },
    {
      id: Math.random(),
      link: "اضافة احجام",
      path: "/admin/add_size",
      icon: <FaPlusSquare style={{ color: "#20B2AA" }} />, // Light Sea Green
    },
    {
      id: Math.random(),
      link: "اضافة لون  الاطار",
      path: "/admin/add_frame_color",
      icon: <FaGlasses style={{ color: "red" }} />, // Slate Blue
    },
    {
      id: Math.random(),
      link: "اضافة نوع الاطار",
      path: "/admin/add_frame_type",
      icon: <FaGlasses style={{ color: "#6A5ACD" }} />, // Slate Blue
    },
    {
      id: Math.random(),
      link: "اضافة متريال",
      path: "/admin/add_material",
      icon: <FaPlusSquare style={{ color: "#8B4513" }} />, // Saddle Brown
    },
    {
      id: Math.random(),
      link: "اضافة اشكال",
      path: "/admin/add_shapes",
      icon: <FaGlasses style={{ color: "#9932CC" }} />, // Dark Orchid
    },
    {
      id: Math.random(),
      link: "اضافة لون العدسة",
      path: "/admin/add_lens_color",
      icon: <FaEye style={{ color: "#DC143C" }} />, // Crimson
    },
    {
      id: Math.random(),
      link: "اضافة نوع العدسة",
      path: "/admin/add_lens_type",
      icon: <FaEye style={{ color: "#4169E1" }} />, // Royal Blue
    },
    {
      id: Math.random(),
      link: "اضافة مدة  العدسة",
      path: "/admin/add_lens_time",
      icon: <FaClock style={{ color: "red" }} />, // Royal Blue
    },
    {
      id: Math.random(),
      link: "كل الطلبات",
      path: "/admin/all_order",
      icon: <FaBoxOpen style={{ color: "#20B2AA" }} />, // Light Sea Green
    },
    {
      id: Math.random(),
      link: "الطلبات المؤكدة",
      path: "/admin/order-done",
      icon: <FaCheck style={{ color: "#32CD32" }} />, // Lime Green
    },
    {
      id: Math.random(),
      link: "الطلبات المستلمة",
      path: "/admin/order_delivery",
      icon: <FaTruck style={{ color: "#FFD700" }} />, // Gold
    },
    {
      id: Math.random(),
      link: "اضافة نظارة",
      path: "/admin/add_glasses",
      icon: <FaGlasses style={{ color: "#6A5ACD" }} />, // Slate Blue
    },
    {
      id: Math.random(),
      link: "اضافة عدسة لاصقة",
      path: "/admin/add_lenses",
      icon: <FaEye style={{ color: "#DC143C" }} />, // Crimson
    },
    {
      id: Math.random(),
      link: "ادارة الخصومات",
      path: "/admin/manage_discount",
      icon: <FaTag style={{ color: "#FF8C00" }} />, // Dark Orange
    },
  ];

  useEffect(() => {
    const initialActiveLink = links.find(
      (link) => link.path === location.pathname
    );
    if (initialActiveLink) {
      setActiveLink(initialActiveLink.path);
      setCurrentLink(initialActiveLink.path);
    }
  }, [location.pathname, links, setCurrentLink]);

  useEffect(() => {
    setActiveLink(currentLink);
  }, [currentLink]);

  const handleClick = (link) => {
    setCurrentLink(link.path);
  };

  return (
    <div className='links-container dir-rtl height-auto margin-20 margin-top-50'>
      {links.map((link) => (
        <NavLink key={link.id} to={link.path} activeClassName='active-link'>
          <div
            onClick={() => handleClick(link)}
            className='d-flex align-items-center p-3 my-2 shadow-sm rounded'
            style={{
              backgroundColor: activeLink === link.path ? "#3b82f6" : "white",
              color: activeLink === link.path ? "white" : "black",
              width: "220px",
              cursor: "pointer",
            }}
          >
            <span className='me-2 fs-5'>{link.icon}</span>
            <h6 className='mb-0 font-weight-bold'>{link.link}</h6>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default AdminLinks;
