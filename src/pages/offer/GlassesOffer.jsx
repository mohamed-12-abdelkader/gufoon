import React, { useState } from "react";
import ViewAllOffer from "../../components/ViewAllProducts/ViewAllOffer";

const GlassesOffer = () => {
  const [priceRange, setPriceRange] = useState(null);
  const [sortOrder, setSortOrder] = useState("descending");

  const handlePriceFilterChange = (event) => {
    const value = event.target.value;
    let range = null;
    if (value === "low") range = { min: 0, max: 50 };
    else if (value === "mid") range = { min: 50, max: 100 };
    else if (value === "high") range = { min: 100, max: Infinity };
    setPriceRange(range);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div dir="rtl" className="flex">
      {/* Sidebar for Filtering */}
      <aside className="w-[20%] p-4 bg-gray-100 my-5">
        <h2>فلترة حسب السعر</h2>
        <label>
          <input
            type="radio"
            name="price"
            value="low"
            onChange={handlePriceFilterChange}
          />{" "}
          أقل من 50
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="price"
            value="mid"
            onChange={handlePriceFilterChange}
          />{" "}
          من 50 إلى 100
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="price"
            value="high"
            onChange={handlePriceFilterChange}
          />{" "}
          أكثر من 100
        </label>

        <h2 className="mt-4">ترتيب حسب السعر</h2>
        <select onChange={handleSortOrderChange} value={sortOrder}>
          <option value="descending">من الأعلى إلى الأقل</option>
          <option value="ascending">من الأقل إلى الأعلى</option>
        </select>
      </aside>

      {/* Products List */}
      <div className="w-[80%]">
        <ViewAllOffer id={1} priceRange={priceRange} sortOrder={sortOrder} />
      </div>
    </div>
  );
};

export default GlassesOffer;
