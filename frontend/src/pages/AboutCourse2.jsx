import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ReactPlayer from 'react-player';
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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const AboutCourse = () => {
    const baseURL = "http://localhost:7000";
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const courseId = location.pathname.split('/')[2];
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [totalMins, setTotalMins] = useState(0)
    const [articlesCount, setArticlesCount] = useState(0)
    const [VideosCount, setVideosCount] = useState(0)
    const [discountedPrice, setDiscountedPrice] = useState(0)
    const [daysLeft, setDaysLeft] = useState(0)
    const [error, setError] = useState()

    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);



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
                console.log(res.data)
                const res2 = await axios.get(`/lessons/get-lessons-info`, { params: { courseId } });
                setLessons(res2.data);
                let totalMins = res2.data.reduce((total, lesson) => total + lesson.mins, 0);
                setTotalMins(totalMins);
                let articlesCount = res2.data.reduce(
                    (total, lesson) =>
                        total + lesson.items.reduce((subTotal, item) => subTotal + (item.type === 2 ? 1 : 0), 0),
                    0
                );
                setArticlesCount(articlesCount);

                let videosCount = res2.data.reduce(
                    (total, lesson) =>
                        total + lesson.items.reduce((subTotal, item) => subTotal + (item.type === 1 ? 1 : 0), 0),
                    0
                );
                setVideosCount(videosCount);
                if (course?.discount?.quantity > 0 && new Date(course?.discount?.discountEnd) > new Date()) {
                    setDiscountedPrice(course.price - (course.price * course.discount.quantity / 100))
                    setDaysLeft(Math.ceil((new Date(course.discount.discountEnd) - new Date()) / (1000 * 60 * 60 * 24)))
                }

            } catch (error) {
                console.error(error);
            }
        };
        getCourse();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (!stripe || !elements) {
            setError("Stripe is not loaded");
            setIsProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Create a PaymentMethod
        const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (paymentError) {
            setError(paymentError.message);
            setIsProcessing(false);
            return;
        }

        // Send the details to the backend to create the subscription
        try {
            const response = await axiosPrivate.patch('/individualTrainees/register', { courseId, paymentMethodId: paymentMethod.id, })
            navigate('/ITrainee-dashboard-enrollments');
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred");
        }

        setIsProcessing(false);
    };


    const [isDivVisible, setIsDivVisible] = useState(false);
    const [toggleList, setToggleList] = useState()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 767) {
                setIsDivVisible(false);
            } else {
                setIsDivVisible(true);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleIconClick = () => {
        setToggleList(!toggleList) // Toggle visibility on small screens
    };


    return (
        <body data-offset="200" className='teach-with-us' >
            <div class="wrapp-content">
                <header class="wrapp-header">
                    <div class="info-box-01">
                        <div className="container">
                            <div className="row">
                                {isDivVisible &&
                                    <ul class="social-list-01">
                                        <li>
                                            <Link class="contact-block-01__link" to={"/"}>For individuals</Link>
                                        </li>

                                        <li>
                                            <Link class="contact-block-01__link" to={"/teach-with-us"}>Teach with us</Link>
                                        </li>

                                        <li>
                                            <Link class="contact-block-01__link" to={"/for-buisness"}>Try Educator for buisness</Link>
                                        </li>

                                        <li>
                                            <Link class="contact-block-01__link" href="#">Eng</Link>
                                        </li>
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                    <div class="main-nav">
                        <div class="container">
                            <div class="flex-row">
                                <Link to="/" class="logo">
                                    <img src={logo} alt="" />
                                </Link>
                                {!isDivVisible &&
                                    <div class="main-nav__btn">
                                        <MenuIcon onClick={handleIconClick} />
                                    </div>
                                }
                                {isDivVisible &&
                                    <ul class="main-nav__list">
                                        <li >
                                            <Link to={"/"}>Home</Link>
                                        </li>
                                        <li class="active">
                                            <Link to={"/courses"}>Courses</Link>

                                        </li>
                                        {auth?.accessToken ?
                                            <li>
                                                <Link to={auth.role === "IndividualTrainee" ? "/ITrainee-dashboard-enrollments" : ""}>Dashboard</Link>
                                            </li>
                                            :
                                            <> <li>
                                                <Link to={"/sign-in"}>Sign in</Link>
                                            </li>
                                                <li>
                                                    <Link to={"/sign-up"}>Sign up</Link>
                                                </li></>
                                        }
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                    {!isDivVisible && toggleList &&
                        <ul className={`main-nav__list_2 ${toggleList ? 'active' : ''}`}>
                            <li onClick={handleIconClick}><CloseIcon /></li>
                            <li>
                                <Link style={{ color: "#4da7cc" }} to={"/"}>For Individuals</Link>
                            </li>

                            <li>
                                <Link style={{ color: "#4da7cc" }} to={"/for-buisness"}>Try Educator for buisness</Link>
                            </li>
                            <li >
                                <Link to={"/"}>Home</Link>
                            </li>

                            <li>
                                <Link to={"/courses"}>Courses</Link>

                            </li>
                            {auth?.accessToken ?
                                <li>
                                    <Link to={auth.role === "IndividualTrainee" ? "/ITrainee-dashboard-enrollments" : ""}>Dashboard</Link>
                                </li>
                                :
                                <> <li>
                                    <Link to={"/sign-in"}>Sign in</Link>
                                </li>
                                    <li>
                                        <Link to={"/sign-up"}>Sign up</Link>
                                    </li></>
                            }
                        </ul>
                    }
                </header>
            </div>
            <div class="row less-padding-row">
                <div class="section-padding"></div>
                <div class="col-lg-8 col-md-12 padding-bottom-20 height">
                    {ReactPlayer.canPlay(course?.previewVideo) ? (
                        <ReactPlayer url={course?.previewVideo} width="100%" height="100%" />
                    ) : (
                        <img class="single-course-img" src={nopreviewavailable} alt="No preview video available" />
                    )}
                </div>
                <div class="col-lg-4 col-md-12 event-sidebar">
                    <div class="courses-features">
                        <h3>{course?.title}  <span style={{ color: "red" }}>{course?.status === "closed" ? "'closed'" : ""}</span></h3>
                        <Stars value={course?.avgRating} number={course?.ratings.length}></Stars>
                        <div class="featuresbox"><img src={doller_ic} alt="dolar-ic" className='icon-01' /><h3>Price : </h3><span> {discountedPrice > 0 ? discountedPrice : course?.price}</span>{discountedPrice > 0 && <span> {course?.price}</span>}{discountedPrice > 0 && <span> {daysLeft}</span>}</div>
                        <div class="featuresbox"><img src={clock_ic} alt="clock-ic" className='icon-01' /><h3>Duration : </h3><span> {formatTime(totalMins)}</span></div>
                        <div class="featuresbox"><PlayCircleOutlineIcon /><h3>Videos : </h3><span> {VideosCount}</span></div>
                        <div class="featuresbox"><InsertDriveFileOutlinedIcon /><h3>Articles : </h3><span> {articlesCount}</span></div>
                        <div class="featuresbox"><img src={user_ic} alt="user-ic" className='icon-01' /><h3>Students : </h3><span> {course?.enrolledStudents}</span></div>
                        <div class="featuresbox"><img src={cap_ic} alt="cap-ic" className='icon-01' /><h3>Certificate of Completion</h3></div>
                    </div>
                </div>
                <div class="col-md-12 col-lg-8 event-contentarea">
                    <div class="coursesdetail-block">
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
                                            <FiberManualRecordIcon className='list-icon' /> <span>{req}</span>
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
                                            <FiberManualRecordIcon className='list-icon' /><span>{learn}</span>
                                        </li>
                                    );
                                })}

                            </ul>
                        </div>
                        <div class="courses-curriculum">
                            <h3 class="course-title">Course Curriculum</h3>
                            {lessons && lessons.map((lesson, index) => {
                                return (
                                    <div className='courses-sections-block' key={index}>
                                        <h3>Lesson {index + 1} : <span>{lesson.title}</span></h3>
                                        <div>
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
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div class="courses-review">
                            <h3 class="course-title">Course Reviews</h3>
                            <div className="reviewboxes">
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
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input">
                            <CardElement options={{ hidePostalCode: true }} />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <button type="submit" className='btn-05' disabled={!stripe || isProcessing}>
                            {isProcessing ? 'Processing...' : 'Add'}
                        </button>
                    </form>
                </div>
                <div className="col-lg-4">
                    <div class="courses-staff">
                        <img src={`${baseURL}${course?.instructor?.image}` || nopreviewavailable} alt="staff" width="275" height="288" />
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

export default AboutCourse