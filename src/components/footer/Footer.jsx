import React from "react";

const Footer = () => {
  return (
    <div style={{ backgroundColor: "rgb(235, 238, 240)", direction: "rtl" }}>
      <div className='w-[95%] m-auto md:flex p-5 '>
        <div className='m-2'>
          <h5 className='text-'> عناويننا </h5>
          <p className='text-'>
            - المدينة المنورة - العوالى النازل -بعد مستشفى الزهراء
          </p>
          <p className='text-'>- 0569413666</p>
          <p className='text-'>
            {" "}
            - الخالدية -طريق الهجرة الفرعى قبل مطعم شواية بلدى
          </p>
          <p className='text-'> - 0501804080</p>
          <p className='text-'>
            - محافظة بدر- ش الملك فيصل بجوار محلات بن مسفر للملابس
          </p>
          <p className='text-'> - 0548416820</p>
        </div>
        <div className='m-2  md:mx-5'>
          <h5 className='text-'> اهم الفئات </h5>
          <p className='text-'> - نظارات طبية</p>
          <p className='text-'>- نظارات شمسية</p>
          <p className='text-'> - عدسات لاصقة </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
