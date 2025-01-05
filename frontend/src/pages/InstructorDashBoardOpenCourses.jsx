import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CancelIcon from '@mui/icons-material/Cancel';
import Stars from '../components/Stars/Stars';

const InstructorDashBoardOpenedCourses = () => {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const handleRowClick = (courseId) => {
        navigate(`/instructor-course-preview/${courseId}`);
    };
    const [instructor, setInstructor] = useState()
    const [courses, setCourses] = useState([])
    const [mostPopularCourse, setMostPopularCourse] = useState(null);
    const [leastPopularCourse, setLeastPopularCourse] = useState(null);
    const [totalEnrollments, setTotalEnrollments] = useState(0);

    const [error, setError] = useState("")

    useEffect(() => {
        const getInstructor = async () => {
            try {
                const res = await axiosPrivate.get(`/instructors/?includedCourses=open`);
                const fetchedCourses = res.data.courses;
                setInstructor(res.data.instructor);
                setCourses(fetchedCourses);

                // Sort courses to get the least and most popular based on enrolled students
                if (fetchedCourses.length > 0) {
                    const sortedCourses = [...fetchedCourses].sort((a, b) => a.enrolledStudents - b.enrolledStudents);
                    setLeastPopularCourse(sortedCourses[0]); // Set least popular course
                    setMostPopularCourse(sortedCourses[sortedCourses.length - 1]); // Set most popular course
                } else {
                    setMostPopularCourse(null); // Reset if no courses
                    setLeastPopularCourse(null); // Reset if no courses
                }

                // Calculate total enrollments
                let totalEnrollments = fetchedCourses.reduce((total, course) => total + course.enrolledStudents, 0);
                setTotalEnrollments(totalEnrollments);
            } catch (error) {
                console.error(error);
                setCourses([]); // Ensure courses is set to an empty array on error
            }
        };

        getInstructor();
    }, []);

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
                                        <li >
                                            <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                                        </li>
                                        <li class="active">
                                            <Link to={'/instructor-dashboard/open-courses'}>Open Courses</Link>
                                        </li>
                                        <li>
                                            <Link to={'/instructor-dashboard/closed-courses'}>Closed Courses</Link>
                                        </li>
                                        <li>
                                            <Link to={'/instructor-dashboard/wallet'}>Wallet</Link>
                                        </li>
                                        <li>
                                            <Link to={'/instructor-dashboard/landing-page'}>Landing page</Link>
                                        </li>
                                    </ul>
                                }
                                {!isDivVisible &&
                                    <div className="flex-column">
                                        <ul className="main-nav__list">
                                            <li class="active">
                                                <Link to={'/instructor-dashboard/open-courses'}>Open Courses</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>
                                        {toggleList &&
                                            <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                                <li>
                                                    <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                                                </li>
                                                <li>
                                                    <Link to={'/instructor-dashboard/closed-courses'}>Closed Courses</Link>
                                                </li>
                                                <li>
                                                    <Link to={'/instructor-dashboard/wallet'}>Wallet</Link>
                                                </li>
                                                <li>
                                                    <Link to={'/instructor-dashboard/landing-page'}>Landing page</Link>
                                                </li>

                                            </ul>
                                        }
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <main class="content-row">
                    <div class="row dashboard-row padding-top-33">
                        <div className="col-lg-6 col-md-12 margin-bottom-20">
                            <div className="dashboard-card">
                                <div className="card-body">
                                    <h5 className="text-muted text-uppercase mt-0 margin-bottom-10">Total Open Courses</h5>
                                    <h3 className="mb-3" data-plugin="counterup">{courses.length}</h3>
                                    <div className='flex-row-03'><CancelIcon style={{ color: "#a0ce4e" }} />  <h6 className="text-muted">Close Anytime to Update</h6></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 margin-bottom-20">
                            <div className="dashboard-card">
                                <div className="card-body">
                                    <h5 className="text-muted text-uppercase mt-0 margin-bottom-10">Total Enrollments</h5>
                                    <h3 className="mb-3" data-plugin="counterup">{totalEnrollments} </h3>
                                    <div className='flex-row-03'><TrendingUpIcon style={{ color: "#a0ce4e" }} />  <h6 className="text-muted">Do Online Marketing to Increase Enrollments</h6></div>
                                </div>
                            </div>
                        </div>
                        {mostPopularCourse &&
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div className="dashboard-card">
                                    <div className="card-body">
                                        <h5 className="text-muted text-uppercase mt-0 margin-bottom-10">Most Popular Course</h5>
                                        <h3 className="mb-3">
                                            <span data-plugin="counterup">
                                                {mostPopularCourse.title}
                                            </span>
                                        </h3>
                                        <div className='flex-row-03'><GroupsIcon style={{ color: "#a0ce4e" }} />  <h6 className="text-muted">{mostPopularCourse.enrolledStudents} Enrolled Students</h6></div>
                                    </div>
                                </div>
                            </div>}
                        {leastPopularCourse &&
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div className="dashboard-card">
                                    <div className="card-body">
                                        <h5 className="text-muted text-uppercase mt-0 margin-bottom-10" >Least Populer Course</h5>
                                        <h3 className="mb-3">
                                            <span data-plugin="counterup">
                                                {leastPopularCourse.title}
                                            </span>
                                        </h3>
                                        <div className='flex-row-03'><GroupsIcon style={{ color: "#a0ce4e" }} />  <h6 className="text-muted">{leastPopularCourse.enrolledStudents} Enrolled Students</h6></div>
                                    </div>
                                </div>
                            </div>}
                    </div>
                    <div className="margin-top-80"></div>
                    <div class="row dashboard-row margin-bottom-97">
                        <h4 class="card-title overflow-hidden">Open Courses</h4>
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-centered table-hover table-xl mb-0" id="recent-orders">
                                        <thead>
                                            <tr>
                                                <th ><h4>Title</h4></th>
                                                <th ><h4>Category</h4></th>
                                                <th ><h4>Rating</h4></th>
                                                <th ><h4>Enrolled Students</h4></th>
                                                <th ><h4>Total Earning</h4></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course, index) => (
                                                <tr key={index}
                                                    onClick={() => handleRowClick(course._id)}
                                                    style={{ cursor: 'pointer' }}>
                                                    <td class="text-truncate"><h5>{course.title}</h5></td>
                                                    <td>
                                                        <span class="badge p-2"><h5 style={{ "marginBottom": '0px' }}>{course.subject}</h5></span>
                                                    </td>
                                                    <td>
                                                        <Stars value={course.avgRating} number={course.ratings.length}></Stars>
                                                    </td>
                                                    <td class="text-truncate"><h5>{course.enrolledStudents}</h5></td>
                                                    <td class="text-truncate"><h5>$ {course.totalEarnings}</h5></td>
                                                </tr>))}
                                        </tbody>
                                    </table>
                                    {courses.length === 0 && <div className='no-data'>There is no open courses</div>}
                                </div>

                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default InstructorDashBoardOpenedCourses