import PropTypes from "prop-types";
import { useTheme } from "../theme/Theme";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

const CustomPagination = ({ totalPages, currentPage, onChange }) => {
  const { color } = useTheme()
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= Math.floor(maxPagesToShow / 2)) {
      endPage = maxPagesToShow;
    } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
      startPage = totalPages - maxPagesToShow + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (startPage > 1) {
      pageNumbers.unshift("...");
    }
    if (endPage < totalPages) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page === "..." || page === currentPage) {
      return;
    }
    scrollToTop()
    onChange(page);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <button
        style={{
          margin: "0 5px",
          padding: "5px 10px",
          borderRadius: "5px",
          backgroundColor: "transparent",
          color: color.primary,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          border: "1px solid #ddd",
        }}
        onClick={() => currentPage === 1 ? null : handlePageChange(1)}
      >
        {"<<"}
      </button>
      <button
        style={{
          margin: "0 5px",
          padding: "5px 10px",
          borderRadius: "5px",
          backgroundColor: "transparent",
          color: color.primary,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          border: "1px solid #ddd",
        }}
        onClick={() => currentPage === 1 ? null : handlePageChange(currentPage - 1)}
      >
        {"<"}
      </button>
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          style={{
            margin: "0 5px",
            padding: "5px 10px",
            borderRadius: "5px",
            backgroundColor: currentPage === page ? color.primary : "transparent",
            color: currentPage === page ? "#fff" : color.primary,
            cursor: page === "..." ? "default" : "pointer",
            border: "1px solid #ddd",
          }}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
      <button
        style={{
          margin: "0 5px",
          padding: "5px 10px",
          borderRadius: "5px",
          backgroundColor: "transparent",
          color: color.primary,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          border: "1px solid #ddd",
        }}
        onClick={() => currentPage === totalPages ? null : handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
      <button
        style={{
          margin: "0 5px",
          padding: "5px 10px",
          borderRadius: "5px",
          backgroundColor: "transparent",
          color: color.primary,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          border: "1px solid #ddd",
        }}
        onClick={() => currentPage === totalPages ? null : handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </button>
    </div>
  );
};

CustomPagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomPagination;
