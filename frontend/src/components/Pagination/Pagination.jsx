import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './Pagination.css'

const Pagination = ({ page, totalPages, handlePageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Max number of page buttons to show at once
        const halfMaxPages = Math.floor(maxPagesToShow / 2);

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (page <= halfMaxPages) {
                for (let i = 1; i <= maxPagesToShow; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (page > totalPages - halfMaxPages) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = page - halfMaxPages; i <= page + halfMaxPages; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        return pageNumbers;
    };

    return (
        <div className="pagination-container">
            <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
                aria-label="Previous Page"
            >
                <ChevronLeftIcon />
            </button>
            {getPageNumbers().map((number, index) =>
                number === '...' ? (
                    <span key={index} className="pagination-dots">...</span>
                ) : (
                    <button 
                        key={index} 
                        onClick={() => handlePageChange(number)} 
                        className={number === page ? 'active' : ''}
                    >
                        {number}
                    </button>
                )
            )}
            <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
                aria-label="Next Page"
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
};

export default Pagination;
