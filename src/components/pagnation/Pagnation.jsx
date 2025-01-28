import React from "react";
import ReactPaginate from "react-paginate";

const Pagnation = ({ id, setPage, pageCount, currentPage }) => {
  const handlePageClick = (data) => {
    setPage(data.selected + 1);
  };

  return (
    <div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="التالى >"
        onPageChange={handlePageClick}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        forcePage={currentPage - 1} // تحديث الصفحة الحالية
        previousLabel="< السابق"
        containerClassName="pagination justify-content-center p-3"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
      />
    </div>
  );
};

export default Pagnation;
