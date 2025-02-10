import React, { useEffect, useState } from "react";
import Slider from "../slider/Slider";
import { getTopLevelCategories } from "../../utils/services";
import { Link } from "react-router-dom";

const SectionTwo = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getTopLevelCategories().then((result) => setCategories(result))
  }, [])

  return (
    <>
      {categories.length && <div className='my-[50px]'>
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
            {categories.map((category) => {
              return (
                <Link key={category.id} to={`/categories/${category.slug}`}>
                  <div className='m-3 text-center'>
                    <img
                      src={category.cover}
                      alt={category.name}
                      style={{
                        height: "120px",
                        width: "120px",
                        borderRadius: "50%",
                        border: "2px solid black",
                      }}
                    />
                    <h6 className='my-2'>{category.name}</h6>
                  </div>
                </Link>
              );
            })}
          </Slider>
        </div>
        <hr className='w-[90%] m-auto' />
      </div>}

    </>
  );
};

export default SectionTwo;
