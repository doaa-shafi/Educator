import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useCategory from '../hooks/useCategory'
import axios from '../api/axios'
import Footer from '../components/Footer'
import Stars from '../components/Stars/Stars'
import logo from '../assets/logo_dark.png'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';

const Courses = () => {
    const { auth, setAuth } = useAuth()
    const navigate = useNavigate()
    const categories = useCategory()
    const [courses, setCourses] = useState([])
    const goToCourse = (courseId) => {
        navigate(`/course-preview/${courseId}`);
    };
    useEffect(() => {
        const getCourses = async () => {
            const res = await axios.get("courses/populer");
            console.log(res.data)
            setCourses(res.data);
        };

        getCourses();

    }, [])

    const [searchKeyWord, setSearchKeyWord] = useState("")

    // const fetchCourses = async (searchKeyWord, filters) => {
    //     let url = `/api/courses?`;

    //     if (searchKeyWord!=="") {
    //         url += `search=${encodeURIComponent(searchKeyWord)}&`;
    //     }
    //     if (filters.level.length>0) {
    //         url += `level=${filters.level}&`;
    //     }
    //     if (filters.priceMin) {
    //         url += `priceMin=${filters.priceMin}&`;
    //     }
    //     if (filters.priceMax) {
    //         url += `priceMax=${filters.priceMax}&`;
    //     }
    //     if (filters.subject.length>0) {
    //         url += `subject=${filters.subject}&`;
    //     }

    //     // const response = await axios.get(url);
    //     // setCourses(response.data);
    // };


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
        <body className='teach-with-us'>
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
                                        <li>
                                            <Link href="events.html">Categories</Link>

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
                                <Link href="events.html">Categories</Link>

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
                <main class="content-row">
                    <div class="page-title-wrapp">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h1 class="page-title-01">Courses</h1>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <ul class="breadcrumbs">
                                        <li class="active">
                                            <a href="index.html">Home</a>
                                        </li>
                                        <li>Courses</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <form class="search-bg-02">
                                <input class="search-bg__text-02" type="text" name="search-bg-name" placeholder="Search for courses you'd like...."
                                    value={searchKeyWord} onChange={(e) => setSearchKeyWord(e.target.value)} />
                                <button class="search-bg__btn" type="submit" >Search</button>
                            </form>
                        </div>
                    </div>
                    <div class="content-box-01 padding-bottom-100">
                        <div className="row less-padding-row">
                            <div className="col-lg-3">
                                <div className="section" style={{ borderTop: "1px solid lightgray", paddingTop: '15px' }}>
                                    <p style={{ fontWeight: "500", color: "black", fontSize: '20px' }}>Categories</p>
                                    <div className="padding-bottom-10"></div>
                                    {categories.map((cat, index) =>
                                        <div style={{ display: "flex", alignItems: 'baseline', gap: "10px" }}>
                                            <input
                                                type="checkbox"
                                            />
                                            <p style={{ fontWeight: "500" }}>{cat.name}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="section" style={{ borderTop: "1px solid lightgray", paddingTop: '15px' }}>
                                    <p style={{ fontWeight: "500", color: "black", fontSize: '20px' }}>Price</p>
                                </div>
                                <div className="section" style={{ borderTop: "1px solid lightgray", paddingTop: '15px' }}>
                                    <p style={{ fontWeight: "500", color: "black", fontSize: '20px' }}>Level</p>
                                    <div className="padding-bottom-10"></div>
                                    <div style={{ display: "flex", alignItems: 'baseline', gap: "10px" }}>
                                        <input
                                            type="checkbox"
                                        />
                                        <p style={{ fontWeight: "500" }}>Beginner</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: 'baseline', gap: "10px" }}>
                                        <input
                                            type="checkbox"
                                        />
                                        <p style={{ fontWeight: "500" }}>Intermediate</p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: 'baseline', gap: "10px" }}>
                                        <input
                                            type="checkbox"
                                        />
                                        <p style={{ fontWeight: "500" }}>Advanced</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9">
                                <ul className="product-list" style={{ justifyContent: "flex-start" }}>
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
                                                <img src={course.thumbnail} alt={course.title} />
                                                <div className="product-list__content">
                                                    <Link className="product-list__category" href="#">{course.subject}</Link>
                                                    <h3 className="product-list__title">
                                                        {course.title}
                                                    </h3>

                                                    <p className="product-list__info-piece"><Stars value={course.avgRating} number={course.ratings.length}></Stars></p>
                                                    {isDiscountValid ? (
                                                        <>
                                                            <p className="product-list__info-piece flex-row"><span className="flex-row"><span>${discountedPrice}</span><span style={{ textDecoration: 'line-through' }}>${course.price.toFixed(2)}</span> </span><span>{daysLeft} days left</span></p>
                                                        </>
                                                    ) : (
                                                        <p className="product-list__info-piece">${course.price.toFixed(2)}</p>
                                                    )}
                                                </div>
                                                <div className="product-list__item-info" style={{ textAlign: "center" }}>
                                                    <p className="product-list__info-piece"><PeopleIcon /><span>   </span>{course.enrolledStudents} Students</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <Link href="courses.html" class="btn-01">See more</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer></Footer>
            </div>
        </body>
    )
}

export default Courses