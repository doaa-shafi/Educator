import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ReactPlayer from 'react-player';
import StripeCheckout from "react-stripe-checkout"
import Modal from 'react-modal';
import Footer from '../components/Footer'
import Stars from '../components/Stars/Stars';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import axios from '../api/axios';
import logo from '../assets/logo_dark.png'
import nopreviewavailable from '../assets/no-preview-available.png';
//icons
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import cap_ic from "../assets/icon3/cap-ic.png"
import doller_ic from "../assets/icon3/dolar-ic.png"
import clock_ic from '../assets/icon3/clock-ic.png'
import user_ic from '../assets/icon3/user-ic.png'


const AboutCourse2 = () => {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const courseId = location.pathname.split('/')[2];
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [activeTab, setActiveTab] = useState(0); // 0 for Overview, 1 for Curriculum, 2 for Instructor

    const handleTabClick = (index) => {
        setActiveTab(index);
    };
    const formatTime = (totalMins) => {
        const totalSeconds = totalMins * 60;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axiosPrivate.get(`/courses/about/${courseId}`);
                setCourse(res.data);
                const res2 = await axios.get(`/lessons/get-lessons-info`, { params: { courseId } });
                setLessons(res2.data);
            } catch (error) {
                console.error(error);
            }
        };
        getCourse();
    }, []);

    const enroll = async (token) => {
        if (!auth.accessToken) {
            navigate('/login'); // Redirect to the login page
            return;
        }
        try {
            await axiosPrivate.patch('/individualTrainees/register', { courseId, token });
            alert('Enrollment successful!');
            navigate('/ITrainee-dashboard-enrollments');
        } catch (error) {
            console.error(error)
        }
    };
    const renderPrice = () => {
        if (course?.discount?.quantity > 0 && new Date(course?.discount?.discountEnd) > new Date()) {
            const discountedPrice = course.price - (course.price * course.discount.quantity / 100);
            const daysLeft = Math.ceil((new Date(course.discount.discountEnd) - new Date()) / (1000 * 60 * 60 * 24));
            return (
                <div className="price-section">
                    <div className="price-container">
                        <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
                        <span className="original-price">${course.price.toFixed(2)}</span>
                    </div>
                    <div className="discount-info">
                        Save {course.discount.quantity}%
                    </div>
                    <div className="discount-info">
                        {daysLeft} days left
                    </div>

                </div>
            );
        }
        return (
            <div className="price-section">
                <div className="price-container">
                    <span className="discounted-price">${course?.price?.toFixed(2)}</span>
                </div>
            </div>
        );
    };
    return (
        <body data-offset="200">

            <header class="home-03">

                <div class="container">
                    <div class="row">
                        <div class="col-lg-12">
                            <Link href="./" class="logo">
                                <img src={logo} alt="" />
                            </Link>
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
                                    <Link href="index.html">Home</Link>
                                </li>
                                <li>
                                    <Link href="events.html">Events</Link>
                                </li>
                                <li class="active">
                                    <Link href="#">Pages</Link>
                                </li>
                                <li>
                                    <Link href="blog_with_right_sidebar.html">News</Link>
                                </li>
                                <li>
                                    <Link href="courses.html">Courses</Link>
                                </li>
                                <li>
                                    <Link href="contacts.html">Contacts</Link>
                                </li>
                            </ul>
                        </div>
                        <div class="menu-search">
                            <div id="sb-search" class="sb-search">
                                <form>
                                    <input class="sb-search-input" placeholder="Enter your search term..." type="text" value="" name="search" id="search" />
                                    <button class="sb-search-submit"><i class="fa fa-search"></i></button>
                                    <span class="sb-icon-search"></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div class="container coursesdetail-section">
                <div class="section-padding"></div>

                <div class="col-md-9 col-sm-8 event-contentarea">
                    <div class="coursesdetail-block">
                        {ReactPlayer.canPlay(course?.previewVideo) ? (
                            <ReactPlayer url={course?.previewVideo} width="100%" height="100%" />
                        ) : (
                            <img class="single-course-img" src={nopreviewavailable} alt="No preview video available" />
                        )}
                        <div class="course-description">
                            <h3 class="course-title">Course Description</h3>
                            <p>{course?.description}</p>
                        </div>
                        <div class="courses-summary">
                            <h3 class="course-title">Course Requirements</h3>
                            <ul>
                                {course?.requirements.length > 0 && course?.requirements.map(req => {
                                    return (
                                        <li>
                                            <a href="#" title="Over 94 lectures and 6 hours">{req}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div class="courses-summary">
                            <h3 class="course-title">Course Outcomes</h3>
                            <ul>
                                {course?.learnings.length > 0 && course?.learnings.map(learn => {
                                    return (
                                        <li>
                                            <a href="#" title="Over 94 lectures and 6 hours">{learn}</a>
                                        </li>
                                    );
                                })}

                            </ul>
                        </div>
                        <div class="courses-curriculum">
                            <h3 class="course-title">Course Curriculum</h3>
                            {lessons && lessons.map(lesson => {
                                return (
                                    <div className='courses-sections-block'>
                                        <h3>Lesson 1: <span>{lesson.title}</span></h3>
                                        <ul>
                                            {lesson.items && lesson.items.map(item => {
                                                return (
                                                    <div class="courses-lecture-box">
                                                        {item.type == 1 ?
                                                            <PlayCircleOutlineIcon className='lecture-icon' /> :
                                                            <InsertDriveFileOutlinedIcon className='lecture-icon' />}
                                                        <span class="lecture-no">Lecture 1.1</span>
                                                        <span class="lecture-title">{item.title}</span>
                                                        <span class="lecture-time">{formatTime(item.duration)}</span>
                                                    </div>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                        <div class="courses-review">
                            <h3 class="course-title">Course Reviews</h3>
                            <div class="reviewbox">
                                <h3>Average Rating</h3>
                                <div class="average-review">
                                    <h2>{course?.avgRating}</h2>
                                    <Stars value={course?.avgRating} number={-1}></Stars>
                                    <span>{course?.ratings.length} Reviews </span>
                                </div>
                            </div>
                            <div class="reviewbox">
                                <h3>Detailed Rating</h3>
                                <div class="detail-review">
                                    <ul>
                                        <li><a href="#" title="5 stars">5 stars</a><span>5</span></li>
                                        <li><a href="#" title="4 stars">4 stars</a><span>0</span></li>
                                        <li><a href="#" title="3 stars">3 stars</a><span>0</span></li>
                                        <li><a href="#" title="2 stars">2 stars</a><span>0</span></li>
                                        <li><a href="#" title="1 stars">1 stars</a><span>0</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="enroll-now">
                        <StripeCheckout
                            name="Payment"
                            description="Course Payment"
                            amount={course?.price}
                            currency={"USD"}
                            token={enroll}
                            stripeKey='pk_test_51MEakIBldv5L7zd6VIwU8t8Ss5p8oj0gX0gkNbEXdSa5QfdRY4U8Yu4R0qFVjz9FlHBfaBqe8Ljbc5xzzFqXgmaa00bFSEVehl'
                        >
                            <button className='btn-04'>Enroll now</button>
                        </StripeCheckout>

                    </div>
                </div>
                <div class="col-md-3 col-sm-4 event-sidebar">
                    <div class="courses-features">
                        <h3>{course?.title}</h3>
                        <Stars value={course?.avgRating} number={course?.ratings.length}></Stars>
                        <div class="featuresbox"><img src={doller_ic} alt="dolar-ic" className='icon-01' /><h3>Price : </h3><span> Free</span></div>
                        <div class="featuresbox"><img src={clock_ic} alt="clock-ic" className='icon-01' /><h3>Duration : </h3><span> {formatTime(course?.totalMins)}</span></div>
                        <div class="featuresbox"><PlayCircleOutlineIcon /><h3>Videos : </h3><span> 10</span></div>
                        <div class="featuresbox"><InsertDriveFileOutlinedIcon /><h3>Articles : </h3><span> 10</span></div>
                        <div class="featuresbox"><img src={user_ic} alt="user-ic" className='icon-01' /><h3>Students : </h3><span> {course?.enrolledStudents}</span></div>
                        <div class="featuresbox"><img src={cap_ic} alt="cap-ic" className='icon-01' /><h3>Certificate of Completion</h3></div>
                    </div>
                    <div class="courses-staff">
                        <img src={course?.instructor?.image || nopreviewavailable} alt="staff" width="275" height="288" />
                        <h3>{course?.instructor.firstName} {course?.instructor.lastName}</h3>
                        <span>{course?.instructor.category}</span>
                        <p>{course?.instructor.miniBiography}…</p>
                    </div>
                </div>

            </div>

            <Footer></Footer>

        </body>

    )
}

export default AboutCourse2