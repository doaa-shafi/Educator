import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const range = [];
        const delta = 2; // How many pages to show before/after the current page
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages, currentPage + delta);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        // Include "..." for large ranges
        if (start > 1) range.unshift("...");
        if (end < totalPages) range.push("...");
        return range;
    };

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
               
            >
                <ChevronLeftIcon className='pagination-icon'/>
            </button>

            {getPageNumbers().map((page, index) =>
                page === "..." ? (
                    <span key={index} className="dots">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={page === currentPage ? "active" : ""}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRightIcon className='pagination-icon'/>
            </button>
        </div>
    );
};


export default Pagination;
