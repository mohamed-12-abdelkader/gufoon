import React from "react";
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Pagnation.css";

const Pagnation = ({ setPage, pageCount, currentPage }) => {
  const handlePageClick = (data) => {
    setPage(data.selected + 1);
  };

  if (pageCount < 2) return null;

  return (
    <nav className="products-pagination" dir="rtl" aria-label="تصفح الصفحات">
      <ReactPaginate
        breakLabel="…"
        nextLabel={
          <span className="products-pagination__nav-inner">
            <span className="products-pagination__nav-text">التالي</span>
            <FaChevronLeft className="products-pagination__icon" aria-hidden />
          </span>
        }
        onPageChange={handlePageClick}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        disabledClassName="is-disabled"
        forcePage={currentPage - 1}
        previousLabel={
          <span className="products-pagination__nav-inner">
            <FaChevronRight className="products-pagination__icon" aria-hidden />
            <span className="products-pagination__nav-text">السابق</span>
          </span>
        }
        containerClassName="products-pagination__list"
        renderOnZeroPageCount={null}
        pageClassName="products-pagination__page"
        pageLinkClassName="products-pagination__link"
        previousClassName="products-pagination__prev"
        previousLinkClassName="products-pagination__link products-pagination__link--nav"
        nextClassName="products-pagination__next"
        nextLinkClassName="products-pagination__link products-pagination__link--nav"
        breakClassName="products-pagination__break"
        breakLinkClassName="products-pagination__link products-pagination__link--break"
        activeClassName="is-active"
      />
    </nav>
  );
};

export default Pagnation;
