import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams ,useLocation} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useCategory from '../hooks/useCategory';
import axios from '../api/axios';
import Footer from '../components/Footer';
import Stars from '../components/Stars/Stars';
import logo from '../assets/logo_dark.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';

const Courses = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { category } = useParams();
    const categories = useCategory();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search') || '';

    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({
        categories: category ? [category] : [],
        level: [],
        priceMin: null,
        priceMax: null,
    });
    const [searchKeyWord, setSearchKeyWord] = useState(searchQuery);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const goToCourse = (courseId) => {
        navigate(`/course-preview/${courseId}`);
    };

    // Fetch Courses
    useEffect(() => {
        const getCourses = async () => {
            const query = new URLSearchParams();
            if (filters.categories.length) query.append('categories', filters.categories.join(','));
            if (searchKeyWord) query.append('search', searchKeyWord);
            if (filters.level.length) query.append('level', filters.level.join(','));
            if (filters.priceMin) query.append('priceMin', filters.priceMin);
            if (filters.priceMax) query.append('priceMax', filters.priceMax);
            query.append('page', currentPage);

            const res = await axios.get(`/courses?${query.toString()}`);
            setCourses(res.data.courses);
            setTotalPages(res.data.totalPages);
        };

        getCourses();
    }, [filters, searchKeyWord, currentPage]);

    // Handle Filters
    const handleCategoryChange = (selectedCategory) => {
        setFilters((prev) => {
            const categories = prev.categories.includes(selectedCategory)
                ? prev.categories.filter((cat) => cat !== selectedCategory)
                : [...prev.categories, selectedCategory];
            return { ...prev, categories };
        });
        setCurrentPage(1); // Reset to the first page
    };

    const handleLevelChange = (level) => {
        setFilters((prev) => {
            const levels = prev.level.includes(level)
                ? prev.level.filter((lvl) => lvl !== level)
                : [...prev.level, level];
            return { ...prev, level: levels };
        });
        setCurrentPage(1);
    };

    const handlePriceChange = (min, max) => {
        setFilters((prev) => ({
            ...prev,
            priceMin: min,
            priceMax: max,
        }));
        setCurrentPage(1);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to the first page
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
        <div className="teach-with-us">
            <div className="wrapp-content">
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
                <main className="content-row">
                    <div className="page-title-wrapp padding-bottom-20 padding-top-20">
                        <div className="container">
                            <h1 className="page-title-01">Courses</h1>
                        </div>
                    </div>
                    <div className="row padding-bottom-20">
                        <div className="col-lg-12">
                            <form className="search-bg-02" onSubmit={handleSearchSubmit}>
                                <input
                                    className="search-bg__text-02"
                                    type="text"
                                    placeholder="Search for courses you'd like..."
                                    value={searchKeyWord}
                                    onChange={(e) => setSearchKeyWord(e.target.value)}
                                />
                                <button className="search-bg__btn" type="submit">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="content-box-01 padding-bottom-100">
                        <div className="row less-padding-row">
                            <div className="col-lg-3">
                                {/* Category Filters */}
                                <div className="section">
                                    <p style={{ fontWeight: '500', fontSize: '20px' }}>Categories</p>
                                    {categories.map((cat) => (
                                        <div key={cat.name} style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.includes(cat.name)}
                                                onChange={() => handleCategoryChange(cat.name)}
                                            />
                                            <p style={{ fontWeight: '500' }}>{cat.name}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Level Filters */}
                                <div className="section">
                                    <p style={{ fontWeight: '500', fontSize: '20px' }}>Level</p>
                                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                        <div key={level} style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={filters.level.includes(level)}
                                                onChange={() => handleLevelChange(level)}
                                            />
                                            <p style={{ fontWeight: '500' }}>{level}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Price Filters */}
                                <div className="section">
                                    <p style={{ fontWeight: '500', fontSize: '20px' }}>Price</p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.priceMin || ''}
                                            onChange={(e) => handlePriceChange(Number(e.target.value) || null, filters.priceMax)}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.priceMax || ''}
                                            onChange={(e) => handlePriceChange(filters.priceMin, Number(e.target.value) || null)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9">
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
                                {/* Pagination */}
                                <div className="pagination">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            className={i + 1 === currentPage ? 'active' : ''}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Courses;
