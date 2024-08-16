import React from 'react';
import {Link} from 'react-router-dom'
import './CourseCard.css';

const CourseCard = ({ id,image, title, rating }) => {
    const generateStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>★</span>
            );
        }
        return stars;
    };

    return (
        <Link className="course-card" to={`/course-preview/${id}`}>
            <img src={image} alt={title} />
            <h3>{title}</h3>
            <div className="rating">
                {generateStars(rating)}
                <span className="rating-value">({rating})</span>
            </div>
        </Link>
    );
};

export default CourseCard;
