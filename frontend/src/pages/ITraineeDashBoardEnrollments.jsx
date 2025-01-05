import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
//hooks
import useAxiosPrivate from '../hooks/useAxiosPrivate'
//images
import logo from '../assets/logo_dark.png'
//components
import Stars from '../components/Stars/Stars'
//icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const ITraineeDashBoardEnrollments = () => {
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()
    const [enrollments, setEnrollments] = useState([]);
    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await axiosPrivate.get(`/enrollments/about`);
                setEnrollments(response.data);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
            }
        };

        fetchEnrollments();
    }, []);
    const goto_enrollment = (enrollmentId) => {
        navigate(`/course/${enrollmentId}`);
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
        <div class="teach-with-us">
            <div class="wrapp-content">
                <div className="wrapp-header dashboard-header">
                    <div class="main-nav">
                        <div class="container">
                            <div className="flex-row padding-around">
                                <Link to="/" class="logo">
                                    <img src={logo} alt="" />
                                </Link>
                                {isDivVisible &&
                                    <ul class="main-nav__list">
                                        <li className='active'>
                                            <Link to={"/ITrainee-dashboard-enrollments"}>My courses</Link>
                                        </li>
                                        <li>
                                            <Link to={"/instructor-dashboard/wallet"}>Wallet</Link>
                                        </li>
                                    </ul>
                                }
                                {!isDivVisible &&
                                    <div className="flex-column">
                                        <ul className="main-nav__list">
                                            <li className='active'>
                                                <Link to={"/ITrainee-dashboard-enrollments"}>My courses</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>
                                        {toggleList &&
                                            <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                                <li>
                                                    <Link to={"/instructor-dashboard/wallet"}>Wallet</Link>
                                                </li>

                                            </ul>
                                        }
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <main class="content-row ">
                    <div className="row padding-top-40">
                        <ul className='product-list-02'>
                            {enrollments.length > 0 && enrollments.map(enrollment => {
                                return (
                                    <li
                                        className="product-list__item"
                                        key={enrollment.course.id}
                                        onClick={() => goto_enrollment(enrollment.course._id)}
                                    >
                                        <img src={enrollment.course.thumbnail} alt={enrollment.course.title} />
                                        <div className="product-list__content">
                                            <div className="product-list__category" >{enrollment.course.subject}</div>
                                            <h3 className="product-list__title">{enrollment.course.title}</h3>
                                            <p className="product-list__info-piece"><Stars value={enrollment.myRating.rating} number={-1} /></p>
                                            <div className="landing-page-progress">
                                                <div
                                                    className="landing-page-progress-bar"
                                                    role="progressbar"
                                                    aria-valuenow={(enrollment.completedDuration / enrollment.totalDuration) * 100}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                    style={{ width: `${(enrollment.completedDuration / enrollment.totalDuration) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        {enrollments.length === 0 && <div className='no-data'>No enrollments yet! Explore our courses, choose what interests you, and start your learning journey today.</div>}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ITraineeDashBoardEnrollments