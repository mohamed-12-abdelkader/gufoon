import React from "react";
import { FaFacebookF, FaInstagram, FaSnapchatGhost } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const Footer = () => {
  return (
    <footer dir="rtl" className="bg-[#0078FF] text-white py-8">
      <div className="container mx-auto px-5 md:flex md:justify-between">
        {/* عناوين */}
        <div className="mb-6 md:mb-0 md:w-1/3">
          <h5 className="text-lg font-semibold mb-4">عناويننا</h5>
          <p className="mb-2">- المدينة المنورة - العوالى النازل - بعد مستشفى الزهراء</p>
          <p className="mb-2">- 0569413666</p>
          <p className="mb-2">- الخالدية - طريق الهجرة الفرعي قبل مطعم شواية بلدي</p>
          <p className="mb-2">- 0501804080</p>
          <p className="mb-2">- محافظة بدر - ش الملك فيصل بجوار محلات بن مسفر للملابس</p>
          <p>- 0548416820</p>
        </div>

        {/* أهم الفئات */}
        <div className="mb-6 md:mb-0 md:w-1/3">
          <h5 className="text-lg font-semibold mb-4">أهم الفئات</h5>
          <ul>
            <li className="mb-2 cursor-pointer hover:text-gray-300">نظارات طبية</li>
            <li className="mb-2 cursor-pointer hover:text-gray-300">نظارات شمسية</li>
            <li className="cursor-pointer hover:text-gray-300">عدسات لاصقة</li>
          </ul>
        </div>

        {/* روابط الصفحات */}
        <div className="md:w-1/3">
          <h5 className="text-lg font-semibold mb-4">روابط سريعة</h5>
          <ul>
            <li className="mb-2 cursor-pointer hover:text-gray-300">
              <a href="/about">من نحن</a>
            </li>
            <li className="mb-2 cursor-pointer hover:text-gray-300">
              <a href="/products">منتجاتنا</a>
            </li>
            <li className="mb-2 cursor-pointer hover:text-gray-300">
              <a href="/contact">اتصل بنا</a>
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <a href="/faq">الأسئلة الشائعة</a>
            </li>
          </ul>
        </div>
      </div>

      {/* قسم التواصل الاجتماعي */}
      <div className="container mx-auto px-5 mt-8 border-t border-blue-300 pt-6 flex justify-center space-x-6">
        <a
          href="https://www.facebook.com/yourpage"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 text-2xl"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://www.tiktok.com/@yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 text-2xl"
          aria-label="TikTok"
        >
          <SiTiktok />
        </a>
        <a
          href="https://www.snapchat.com/add/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 text-2xl"
          aria-label="Snapchat"
        >
          <FaSnapchatGhost />
        </a>
        <a
          href="https://www.instagram.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 text-2xl"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
      </div>

      {/* حقوق الملكية */}
      <div className="text-center text-sm mt-8 text-gray-200">
        © 2025 جميع الحقوق محفوظة
      </div>
    </footer>
  );
};

export default Footer;
