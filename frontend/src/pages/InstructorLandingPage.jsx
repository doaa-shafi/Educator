import React, { useState, useEffect } from 'react'
import {Link,useLocation} from 'react-router-dom'
import axios from '../api/axios'
import Footer from '../components/Footer'
import logo from '../assets/logo_dark.png'
import noPreviewAvailable from '../assets/no-preview-available.png'
import Stars from '../components/Stars/Stars'

const InstructorLandingPage = () => {
    const [instructor, setInstructor] = useState()
    const location=useLocation()
    const instructorId=location.pathname.split('/')[2];
    useEffect(() => {
        const getInstructor = async () => {
            try {
                const res = await axios.get(`/instructors/${instructorId}`);
                setInstructor(res.data);
                // const res2 = await axios.get(`/lessons/get-lessons-info`, { params: { courseId } });
                // setLessons(res2.data);
            } catch (error) {
                console.error(error);
            }
        };
        getInstructor();
    }, []);

    return (
        <div className='home-03'>
            <div class="wrapp-content">
                <header class="wrapp-header">
                    <div class="main-nav">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <a href="./" class="logo">
                                        <img src={logo} alt="" />
                                    </a>
                                    <div class="main-nav__btn">
                                        <div class="icon-left"></div>
                                        <div class="icon-right"></div>
                                    </div>
                                    <div class="search-block">
                                        <button class="search-btn">Search</button>
                                        <form action="./" class="search-block__form">
                                            <input class="search-block__form-text" type="text" name="search-name" placeholder="Search..." />
                                        </form>
                                    </div>
                                    <ul class="main-nav__list">
                                        <li>
                                            <a href="index.html">Home</a>
                                        </li>
                                        <li>
                                            <a href="events.html">Events</a>
                                        </li>
                                        <li class="active">
                                            <a href="#">Pages</a>
                                        </li>
                                        <li>
                                            <a href="blog_with_right_sidebar.html">News</a>
                                        </li>
                                        <li>
                                            <a href="courses.html">Courses</a>
                                        </li>
                                        <li>
                                            <a href="contacts.html">Contacts</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main class="content-row">
                    <div class="content-box-01 single-team">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-6 col-md-7 col-lg-8">
                                    <figure class="single-team__img">
                                        <img src={instructor?.image?instructor.image:noPreviewAvailable} alt="" />
                                    </figure>
                                </div>
                                <div class="col-sm-6 col-md-5 col-lg-4">
                                    <div class="single-team__info">
                                        <h3 class="single-team__info-title">{instructor?.username}</h3>
                                        <ul class="single-team__info-list">
                                            <li>
                                                <span>Department:</span> Mathematics
                                            </li>
                                            <li>
                                                <span>Appointment:</span> Professor
                                            </li>
                                            <li>
                                                <span>Job:</span> Professor of Mathematics
                                            </li>
                                            <li>
                                                <span>Experience:</span> 20 Years
                                            </li>
                                            <li>
                                                <span>Awards:</span> Teacher of the Year
                                            </li>
                                            <li>
                                                <span>Category:</span> 1 Category
                                            </li>
                                            <li>
                                                <span>Phone:</span> 856 263 4561
                                            </li>
                                            <li>
                                                <span>Email:</span>
                                                <a href="mailto:samuel.williams@edu.com">{instructor?.email}</a>
                                            </li>
                                        </ul>
                                        <Stars value={instructor?.avgRating}></Stars>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <h3 class="margin-bottom-17">Biography</h3>
                                    {instructor?.miniBiography}
                                </div>
                            </div>
                            {/* <div class="content-box-01 padding-top-93">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-12 text-center">
                                            <h3 class="title-02 title-02--mr-01">Instructor Popular
                                                <span>Courses</span>
                                            </h3>
                                            <p class="subtitle-01">Suspendisse sodales arcu velit, non pretium massa accumsan non. Proin accumsan placerat mauris sit amet condimentum. Morbi luctus risus tincidunt urna hendrerit mollis.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="content-box-01 padding-bottom-100">
                                <div class="container">
                                    <div className="row products">
                                        <div class="col-lg-12">
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
                                                        <li className="product-list__item" key={course.id} onClick={() => goToCourse(course._id)}>
                                                            <figure className="product-list__img">
                                                                <Link href="single_course.html">
                                                                    <img src={course.thumbnail} alt={course.title} />
                                                                </Link>
                                                            </figure>
                                                            <div className="product-list__content">
                                                                <Link className="product-list__category" href="#">{course.subject}</Link>
                                                                <h3 className="product-list__title">
                                                                    <Link href="single_course.html">{course.title}</Link>
                                                                </h3>
                                                                <div className='course-s-div'>
                                                                    <p className='stars-p'><Stars value={course.avgRating}></Stars>  ({course.ratings.length})</p>
                                                                    {isDiscountValid ? (
                                                                        <p className="product-list__discount-info">{daysLeft} days left</p>
                                                                    ) : <></>}
                                                                    {isDiscountValid ? (
                                                                        <>
                                                                            <p className="product-list__price">${discountedPrice}--<span style={{ textDecoration: 'line-through' }}>${course.price.toFixed(2)}</span></p>
                                                                        </>
                                                                    ) : (
                                                                        <p className="product-list__price">${course.price.toFixed(2)}</p>
                                                                    )}

                                                                </div>

                                                            </div>
                                                            <div className="product-list__item-info">
                                                                <p className="item-info__text-01">14 Lessons</p>
                                                                <p className="item-info__text-02">{course.enrolledStudents} Students</p>
                                                            </div>
                                                        </li>
                                                    );

                                                })}
                                            </ul>

                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-12 text-center">
                                            <Link href="courses.html" class="btn-01">See more</Link>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div class="row">
                                <div class="col-sm-4 col-md-4 col-lg-4">
                                    <ul class="ul-list-01">
                                        <li>Maecenas egestas feugiat nibh</li>
                                        <li>Curabitur egestas lacus convallis</li>
                                        <li>Vivamus blandit fermentum turpis</li>
                                        <li>Cras eu hendrerit justo, eu faucibus</li>
                                        <li>Suspendisse enim ligula, faucibus</li>
                                    </ul>
                                </div>
                                <div class="col-sm-4 col-md-4 col-lg-4">
                                    <ul class="ul-list-01">
                                        <li>Donec commodo lacinia mi</li>
                                        <li>Curabitur ante quam, porttitor </li>
                                        <li>Praesent et nulla dui maximus</li>
                                        <li>In ac nibh in purus maximus </li>
                                        <li>Aenean pharetra condimentum </li>
                                    </ul>
                                </div>
                                <div class="col-sm-4 col-md-4 col-lg-4"></div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <h3 class="margin-bottom-20">Languages</h3>
                                    <p>English (fluet), Spanish (fluent), Italian, Greek.</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="reply-form">
                                        <h3 class="reply-form__title margin-top-20 margin-bottom-34">Contact Me</h3>
                                        <form action="./" class="reply-form__form">
                                            <div class="reply-form__box-01">
                                                <input class="reply-form__name" type="text" name="login" placeholder="Name *" />
                                            </div>
                                            <div class="reply-form__box-02">
                                                <input class="reply-form__email" type="email" name="login" placeholder="Email *" />
                                            </div>
                                            <div class="reply-form__box-03">
                                                <input class="reply-form__url" type="url" name="website" placeholder="Website" />
                                            </div>
                                            <div class="reply-form__box-04">
                                                <textarea class="reply-form__message" name="message" cols="30" rows="10" placeholder="Message..."></textarea>
                                            </div>
                                            <div class="reply-form__box-05">
                                                <button class="btn-01" type="submit">Send message</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer></Footer>
            </div>
        </div>
    )
}

export default InstructorLandingPage