import React from "react";
import { FaFacebookF, FaInstagram, FaSnapchatGhost, FaPhone, FaEnvelope } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const Footer = () => {
  return (
    <footer dir="rtl" className="bg-blue-600 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white" style={{ fontFamily: 'var(--font-primary)' }}>
              جوفون
            </h3>
            <p className="text-white mb-4" style={{ fontFamily: 'var(--font-primary)' }}>
              متجرك الموثوق للنظارات الطبية والشمسية والعدسة اللاصقة
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-blue-100">
                <FaPhone className="text-white" />
                <span className="text-white" style={{ fontFamily: 'var(--font-primary)' }}>0569413666</span>
              </div>
             
            </div>
          </div>

          {/* Branches */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-primary)' }}>
              فروعنا
            </h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-white mb-1" style={{ fontFamily: 'var(--font-primary)' }}>
                  المدينة المنورة
                </h5>
                <p className="text-white text-sm" style={{ fontFamily: 'var(--font-primary)' }}>
                  العوالى النازل - بعد مستشفى الزهراء
                </p>
                <p className="text-white text-sm" style={{ fontFamily: 'var(--font-primary)' }}>0569413666</p>
              </div>
              
              <div>
                <h5 className="font-medium text-white mb-1" style={{ fontFamily: 'var(--font-primary)' }}>
                  الخالدية
                </h5>
                <p className="text-white text-sm" style={{ fontFamily: 'var(--font-primary)' }}>
                  طريق الهجرة الفرعي قبل مطعم شواية بلدي
                </p>
                <p className="text-white text-sm" style={{ fontFamily: 'var(--font-primary)' }}>0501804080</p>
              </div>
              
              <div>
                <h5 className="font-medium text-white mb-1" style={{ fontFamily: 'var(--font-primary)' }}>
                  بدر
                </h5>
                <p className="text-white text-sm" style={{ fontFamily: 'var(--font-primary)' }}>
                  ش الملك فيصل بجوار محلات بن مسفر للملابس
                </p>
                <p className="text-white text-sm" style={{ fontFamily: 'var(--font-primary)' }}>0548416820</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white" style={{ fontFamily: 'var(--font-primary)' }}>
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-blue-100 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-primary)' }}>
                  منتجاتنا
                </a>
              </li>
              <li>
                <a href="/about" className="text-blue-100 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-primary)' }}>
                  من نحن
                </a>
              </li>
              <li>
                <a href="/contact" className="text-blue-100 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-primary)' }}>
                  اتصل بنا
                </a>
              </li>
              <li>
                <a href="/faq" className="text-blue-100 hover:text-white transition-colors" style={{ fontFamily: 'var(--font-primary)' }}>
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-blue-500 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="TikTok"
              >
                <SiTiktok />
              </a>
              <a
                href="https://www.snapchat.com/add/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-500 hover:bg-blue-400 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Snapchat"
              >
                <FaSnapchatGhost />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-blue-200 text-sm" style={{ fontFamily: 'var(--font-primary)' }}>
              © 2025 جوفون. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;