import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Stars from '../components/Stars/Stars';
import Modal from 'react-modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png'
import WarningIcon from '@mui/icons-material/Warning';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

const InstructorDashBoardClosedCourses = () => {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const handleRowClick = (courseId) => {
        navigate(`/instructor-course-preview/${courseId}`);
    };
    const [courses, setCourses] = useState([])
    const [totalEnrollments, setTotalEnrollments] = useState(0);
    const [show1, setShow1] = useState()
    const [show2, setShow2] = useState()

    const [courseTitle, setCourseTitle] = useState("")

    const [error, setError] = useState("")


    useEffect(() => {
        const getCourses = async () => {
            try {
                const res = await axiosPrivate.get(`/courses/closed`);
                setCourses(res.data);

                let totalEnrollments = res.data.reduce((total, course) => total + course.enrolledStudents, 0);
                setTotalEnrollments(totalEnrollments);

            } catch (error) {
                console.error(error);
                setCourses([]);
            }
        };
        getCourses();
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
                                        <li>
                                            <Link to={'/instructor-dashboard/open-courses'}>Open Courses</Link>
                                        </li>
                                        <li class="active">
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
                                                <Link to={'/instructor-dashboard/closed-courses'}>Closed Courses</Link>
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
                                                    <Link to={'/instructor-dashboard/open-courses'}>Open Courses</Link>
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
                                    <h5 className="text-muted text-uppercase mt-0">Total Closed Courses</h5>
                                    <h3 className="mb-3" data-plugin="counterup">{courses.length}</h3>
                                    <div className='flex-row-03'><SettingsSuggestIcon style={{ color: "#a0ce4e" }} />  <h6 className="text-muted">Open Again or Clone to Draft</h6></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 margin-bottom-20">
                            <div className="dashboard-card">
                                <div className="card-body">
                                    <h5 className="text-muted text-uppercase mt-0">Total Enrollments in Closed Courses</h5>
                                    <h3 className="mb-3" data-plugin="counterup">{totalEnrollments} </h3>
                                    <div className='flex-row-03'><WarningIcon style={{ color: "#a0ce4e" }} />  <h6 className="text-muted">Students Cannot Enroll in Closed Courses</h6></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="button-row">
                        <div className="row">
                            <div className=" container">
                                <h3 className='text-muted mt-0'><SpeakerNotesIcon style={{ color: "#a0ce4e" }} /> Closed courses are not visible for new enrollments, but previously enrolled students can still access them. You can reopen closed courses or clone them as drafts to update and publish a new version.</h3>
                            </div>
                        </div>
                    </div>
                    <div class="row dashboard-row">
                        <h4 class="card-title overflow-hidden">Closed Courses</h4>
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
                                                    <td><h5>{course.title}</h5></td>
                                                    <td>
                                                        <span className="badge p-2"><h5 style={{ "marginBottom": '0px' }}>{course.subject || "-"}</h5></span>
                                                    </td>
                                                    <td>
                                                        <Stars value={course.avgRating} number={course.ratings.length}></Stars>
                                                    </td>
                                                    <td class="text-truncate"><h5>{course.enrolledStudents}</h5></td>
                                                    <td class="text-truncate"><h5>$ 1200.00</h5></td>
                                                </tr>))}
                                        </tbody>
                                    </table>
                                    {courses.length === 0 && <div className='no-data'>There is no closed courses</div>}
                                </div>

                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default InstructorDashBoardClosedCourses