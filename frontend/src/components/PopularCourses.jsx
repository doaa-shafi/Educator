import React from 'react';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import Stars from './Stars/Stars'; // Assuming you have a Stars component

const PopularCourses = ({ courses, goToCourse }) => {
    return (
        <div className="content-box-01">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h3 className="title-02 title-02--mr-01">Our Popular
                            <span> Courses</span>
                        </h3>
                        <p className="subtitle-01">Discover our top-rated courses, chosen for their high enrollments and excellent ratings. Dive into engaging content and enhance your skills with ease!</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <ul className="product-list">
                            {courses.length > 0 && courses.map(course => {
                                const isDiscountValid = course?.discount?.quantity > 0 && new Date(course?.discount?.discountEnd) > new Date();
                                const discountedPrice = isDiscountValid
                                    ? (course.price - (course.price * course.discount.quantity / 100).toFixed(2))
                                    : null;
                                const daysLeft = isDiscountValid
                                    ? Math.ceil((new Date(course.discount.discountEnd) - new Date()) / (1000 * 60 * 60 * 24))
                                    : null;
                                return (
                                    <li
                                        className="product-list__item"
                                        key={course.id}
                                        onClick={() => goToCourse(course._id)}
                                    >
                                        <img src={course.thumbnail} alt={course.title} />
                                        <div className="product-list__content">
                                            <div className="product-list__category" >{course.subject}</div>
                                            <h3 className="product-list__title">{course.title}</h3>
                                            <p className="product-list__info-piece">
                                                <Stars value={course.avgRating} number={course.ratings.length} />
                                            </p>
                                            {isDiscountValid ? (
                                                <p className="product-list__info-piece flex-row">
                                                    <span className="flex-row">
                                                        <span>${discountedPrice}</span>
                                                        <span style={{ textDecoration: 'line-through' }}>${course.price.toFixed(2)}</span>
                                                    </span>
                                                    <span>{daysLeft} days left</span>
                                                </p>
                                            ) : (
                                                <p className="product-list__info-piece">${course.price.toFixed(2)}</p>
                                            )}
                                        </div>
                                        <div className="product-list__item-info" style={{ textAlign: "center" }}>
                                            <p className="product-list__info-piece">
                                                <PeopleIcon />
                                                <span> {course.enrolledStudents} Students</span>
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularCourses;
