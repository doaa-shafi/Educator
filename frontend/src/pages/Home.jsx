import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useCategory from '../hooks/useCategory'
import axios from '../api/axios'

//local components
import PopularCourses from '../components/PopularCourses'
import Pagination from '../components/Pagination/Pagination'
import Footer from '../components/Footer'

//external components
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

//categories icons
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import BrushIcon from '@mui/icons-material/Brush';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BlenderIcon from '@mui/icons-material/Blender';
import ScienceIcon from '@mui/icons-material/Science';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CalculateIcon from '@mui/icons-material/Calculate';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

//icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import logo from '../assets/logo_white.png'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Home = () => {
    const navigate = useNavigate()
    const categories = useCategory()
    const { auth } = useAuth();

    const goToCourse = (courseId) => {
        navigate(`/course-preview/${courseId}`);
    };

    const [searchText, setSearchText] = React.useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/courses?search=${encodeURIComponent(searchText)}`);
    };

    const [courses, setCourses] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCourses = async (page = 1) => {
        try {
            const res = await axios.get(`/courses/populer?page=${page}&limit=6`);
            setCourses(res.data.courses);
            setTotalPages(res.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching popular courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses(); // Fetch the first page on component mount
    }, []);

    const categoryIconMap = {
        "Business & Management": <QueryStatsIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Programming & Technology": <ImportantDevicesIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Design & Creativity": <BrushIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Marketing & Sales": <LocalGroceryStoreIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Health & Wellness": <MonitorHeartIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Personal Development": <PsychologyIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Languages": <GTranslateIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Finance & Accounting": <CalculateIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Data Science & Analytics": <AutoGraphIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Art & Craft": <BrushIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Cooking & Culinary Skills": <BlenderIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Engineering & Architecture": <LocationCityIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Writing & Content Creation": <CloudUploadIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Education & Teaching": <CastForEducationIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Photography & Videography": <CameraAltIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
        "Science & Research": <ScienceIcon sx={{ fill: "url(#exampleColors)", fontSize: '3.5rem' }} />,
    };


    const SampleNextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <ArrowForwardIosIcon
                className={className}
                style={{ ...style, display: 'flex', alignItems: "center", justifyContent: "center", color: '#fff', right: '10px', border: '1px solid #fff', borderRadius: '50%', padding: "3px" }}
                onClick={onClick}
            />
        );
    };

    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <ArrowBackIosIcon
                className={className}
                style={{ ...style, display: 'flex', alignItems: "center", justifyContent: "center", color: '#fff', left: '10px', border: '1px solid #fff', borderRadius: '50%', padding: "3px" }}
                onClick={onClick}
            />
        );
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false, // Disable arrows
                    swipe: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false, // Disable arrows
                    swipe: true,
                }
            }
        ]
    };


    const [isDivVisible, setIsDivVisible] = useState(false);
    const [toggleList, setToggleList] = useState()
    const navListRef = useRef(null);

    const handleClickOutside = (event) => {
        if (navListRef.current && !navListRef.current.contains(event.target)) {
            setToggleList(false);
        }
    };

    useEffect(() => {
        if (toggleList) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleList]);

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

    const [count, setCount] = useState(0);
    const [hasCounted, setHasCounted] = useState(false); // Prevent re-triggering the animation

    useEffect(() => {
        const parallaxSection = document.querySelector('.parallax');

        const handleCountUp = () => {
            const target = 6000;
            const duration = 1000; // Duration in milliseconds
            const interval = 10; // Interval between increments
            const step = target / (duration / interval);

            let currentCount = 2000;

            const countInterval = setInterval(() => {
                currentCount += step;
                if (currentCount >= target) {
                    setCount(target);
                    clearInterval(countInterval);
                } else {
                    setCount(Math.ceil(currentCount));
                }
            }, interval);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasCounted) {
                    setHasCounted(true);
                    handleCountUp();
                }
            });
        });

        if (parallaxSection) observer.observe(parallaxSection);

        return () => {
            if (parallaxSection) observer.unobserve(parallaxSection);
        };
    }, [hasCounted]);

    return (
        <div className='home-01'>
            <div class="wrapp-content">
                <header class="wrapp-header">
                    <div class="info-box-01">
                        <div class="container">
                            <div class="row">
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
                            <div class="row">
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
                                            <li class="active">
                                                <Link to={"/"}>Home</Link>
                                            </li>
                                            <li>
                                                <Link to={"/courses"}>Courses</Link>

                                            </li>
                                            {auth?.accessToken ?
                                                <li>
                                                    <Link to={auth.role === "IndividualTrainee" ? "/ITrainee-dashboard-enrollments" :
                                                        auth.role === "CorporateTrainee" ? "" : auth.role === "Corporate" ? "/corporate-dashboard/trainees" : auth.role === "Instructor" ? "/instructor-dashboard/draft-courses" : ""}>Dashboard</Link>
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
                            {!isDivVisible &&
                                <ul ref={navListRef} className={`main-nav__list_2 ${toggleList ? 'active' : ''}`}>
                                    <li style={{ color: "gray" }} onClick={handleIconClick}><CloseIcon /></li>
                                    <li>
                                        <Link style={{ color: "#4da7cc" }} to={"/teach-with-us"}>Teach with us</Link>
                                    </li>

                                    <li>
                                        <Link style={{ color: "#4da7cc" }} to={"/for-buisness"}>Try Educator for buisness</Link>
                                    </li>
                                    <hr className='menu-hr' />
                                    <li >
                                        <Link style={{ color: "#a0ce4e" }} to={"/"}>Home</Link>
                                    </li>

                                    <li>
                                        <Link style={{ color: "#4da7cc" }} to={"/courses"}>Courses</Link>

                                    </li>
                                    {auth?.accessToken ?
                                        <li>
                                            <Link style={{ color: "#4da7cc" }} to={auth.role === "IndividualTrainee" ? "/ITrainee-dashboard-enrollments" :
                                                auth.role === "CorporateTrainee" ? "" : auth.role === "Corporate" ? "/corporate-dashboard/trainees" : auth.role === "Instructor" ? "/instructor-dashboard/draft-courses" : ""}>Dashboard</Link>
                                        </li>
                                        :
                                        <> <li>
                                            <Link style={{ color: "#4da7cc" }} to={"/sign-in"}>Sign in</Link>
                                        </li>
                                            <li>
                                                <Link style={{ color: "#4da7cc" }} to={"/sign-up"}>Sign up</Link>
                                            </li></>
                                    }
                                </ul>
                            }
                            <div className="row">
                                <div className="col-lg-12">
                                    <form className="search-bg" onSubmit={handleSearchSubmit}>
                                        <label className="search-bg__title">
                                            Choose From A Range Of <span>Online Courses</span>
                                        </label>
                                        <div className='search-bg__small'>
                                            <input
                                                className="search-bg__text"
                                                type="text"
                                                name="search-bg-name"
                                                placeholder="Search for courses you'd like...."
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                            />
                                            <button className="search-bg__btn" type="submit">
                                                Search
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <Slider {...settings} className="owl-carousel owl-option-02">
                                        {categories.map((cat) => (
                                            <div className="item" key={cat.name}>
                                                <Link to={`/courses/${cat.name}`} className="owl-option-02__box-01">
                                                    <svg width={0} height={0}>
                                                        <linearGradient id="exampleColors" x1={1} y1={0} x2={1} y2={1} gradientTransform="rotate(45)">
                                                            <stop offset='0%' stopColor="#a0ce4e" />
                                                            <stop offset='50%' stopColor="#4da7cc" />
                                                            <stop offset='100%' stopColor="#47b7ba80" />
                                                        </linearGradient>
                                                    </svg>
                                                    {categoryIconMap[cat.name]}
                                                    <h3 className="owl-option-02__title">
                                                        {cat.name}
                                                    </h3>
                                                </Link>
                                            </div>
                                        ))}
                                    </Slider>


                                </div>
                            </div>
                        </div>
                    </div>
                </header>


                <main class="content-row">
                    <div class="content-box-02">
                        <div class="table-01">
                            <div class="table-01__row">
                                <div class="table-01__box-03">
                                    <div class="table-01__content">
                                        <h3 class="title-01">
                                            <span>Welcome</span> to Educator Platform</h3>
                                        <div class="content-box-03__text">
                                            <p>Unlock your potential with our wide range of online courses tailored just for you. Whether you're looking to acquire new skills, advance in your career, or explore new interests, you're in the right place.
                                                At Educator, learning is flexible and accessible from anywhere, anytime.
                                            </p>
                                        </div>
                                        <p class="author-info">
                                            - John S. Hogvaer,
                                            <span>Founder</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="table-01__box-02">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-box-01 padding-top-100 padding-sm-top-50">
                        <div class="services-container">
                            <div class="servises-item serv-item-01">
                                <h3 class="servises-item__title">Cloud Library</h3>
                                <div class="servises-item__text">
                                    <p>Access course materials anytime, anywhere with our cloud-based library. Learning has never been more flexible.</p>
                                </div>
                            </div>
                            <div class="servises-item serv-item-02">
                                <h3 class="servises-item__title">Certifications</h3>
                                <div class="servises-item__text">
                                    <p>Earn recognized certifications after completing courses, boosting your credentials and professional growth.</p>
                                </div>
                            </div>
                            <div class="servises-item serv-item-03">
                                <h3 class="servises-item__title">Video Lessons</h3>
                                <div class="servises-item__text">
                                    <p>Engage with high-quality video lessons, designed to bring concepts to life and support your learning journey.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="parallax parallax_01" data-type="background" data-speed="10">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="parallax-content-01">
                                        <h3 className="parallax-title">
                                            Trusted by Over <span>{count.toLocaleString()}+</span> Students
                                        </h3>
                                        <div className="parallax-text">
                                            <p>
                                                We have a fully qualified and very well educated teaching staff,
                                                continuous student counseling, and a very effective and enthusiastic
                                                student support staff.
                                            </p>
                                        </div>
                                        <Link to="sign-up" className="parallax-btn">
                                            Create Account
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='margin-top-80'>
                        <PopularCourses courses={courses} goToCourse={goToCourse} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => fetchCourses(page)}
                        />
                    </div>
                    <div class="content-box-01 padding-top-93 padding-bottom-63">
                        <div class="container">
                            <div class="row padding-bottom-15">
                                <div class="col-lg-12 text-center">
                                    <h3 class="title-02 title-02--mr-01">What makes Us
                                        <span> Different</span>
                                    </h3>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="news-info">
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>1</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Personalized Learning Paths
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p>Every learner is unique, and our platform recognizes that. We offer personalized learning paths tailored to individual goals, allowing users to learn at their own pace and concentrate on the skills that matter most to them.</p>
                                            </div>
                                        </div>
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>2</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Expert-Led Content
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p>All our courses are crafted by industry professionals who bring their real-world expertise to the table. Our instructors are not just teachers; they are experts actively working in their respective fields, ensuring you get the most up-to-date and relevant information.</p>
                                            </div>
                                        </div>
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>3</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Flexibility and Accessibility
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p>We understand that learning should fit into your lifestyle, not the other way around. Our courses are available anytime, anywhere, and on any device. Whether you prefer learning on your morning commute or during late-night study sessions, we make it easy for you.</p>
                                            </div>
                                        </div>
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>4</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Engaging Community
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p>Learning shouldn't be a lonely journey. We foster a supportive community where learners, instructors, and industry professionals connect, share insights, and help each other grow. Our discussion boards, live Q&A sessions, and peer reviews are designed to keep you motivated and engaged.</p>
                                            </div>
                                        </div>
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>5</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Recognized Certifications
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p> Completing our courses doesn't just bring you knowledge; it also brings you recognition. Our certifications are recognized by leading companies, helping you stand out in your job search and grow your career.</p>
                                            </div>
                                        </div>
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

export default Home