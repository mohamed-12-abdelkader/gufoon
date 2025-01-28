import React from "react";
import Marquee from "react-fast-marquee";
import Slider from "../slider/Slider";
const SectionTwo = () => {
  const cats = [
    {
      id: Math.random(),
      img: "th (3).jpeg",
      name: "نظارات شمسية رجالى ",
    },
    {
      id: Math.random(),
      img: "women-sunglasses.webp",
      name: "نظارات شمسية نسائى  ",
    },
    {
      id: Math.random(),
      img: "th (6).jpeg",
      name: "نظارات طبية mm رجالى ",
    },
    {
      id: Math.random(),
      img: "th (5).jpeg",
      name: "نظارات طبية  نسائى  ",
    },
    {
      id: Math.random(),
      img: "th (7).jpeg",
      name: "نظارات  اطفالى   ",
    },
    {
      id: Math.random(),
      img: "th (8).jpeg",
      name: "  عدسات لاصقة    ",
    },
    {
      id: Math.random(),
      img: "th (3).jpeg",
      name: "نظارات شمسية رجالى ",
    },
    {
      id: Math.random(),
      img: "women-sunglasses.webp",
      name: "نظارات شمسية نسائى  ",
    },
    {
      id: Math.random(),
      img: "th (6).jpeg",
      name: "نظارات طبية mm رجالى ",
    },
    {
      id: Math.random(),
      img: "th (5).jpeg",
      name: "نظارات طبية  نسائى  ",
    },
    {
      id: Math.random(),
      img: "th (7).jpeg",
      name: "نظارات  اطفالى   ",
    },
    {
      id: Math.random(),
      img: "th (8).jpeg",
      name: "  عدسات لاصقة    ",
    },
  ];

  return (
    <div className='my-[50px]'>
      <div className='flex justify-center'>
        <div>
          <h3 className='font-bold '> اقسام الموقع</h3>
          <p
            className='h-1 w-[160px] my-3 bg-slate-700'
            style={{ borderRadius: "10px" }}
          ></p>
        </div>
      </div>
      <div dir='ltr'>
        <Slider>
          {cats.map((cat) => {
            return (
              <div key={cat.id} className='m-3 text-center'>
                <img
                  src={cat.img}
                  style={{
                    height: "120px",
                    width: "120px",
                    borderRadius: "50%",
                    border: "2px solid black",
                  }}
                />
                <h6 className='my-2'>{cat.name}</h6>
              </div>
            );
          })}
        </Slider>
      </div>
      <hr className='w-[90%] m-auto' />
    </div>
  );
};

export default SectionTwo;
