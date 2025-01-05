import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { format } from 'date-fns';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png';
import EventIcon from '@mui/icons-material/Event';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


const InstructorDashBoardDraftCourses = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const handleRowClick = (courseId) => {
        navigate(`/create-course/${courseId}`);
    };
    const [instructor, setInstructor] = useState();
    const [courses, setCourses] = useState([]);
    const [earliestCourse, setEarliestCourse] = useState(null);
    const [latestCourse, setLatestCourse] = useState(null);
    const [notUpdatedCount, setNotUpdatedCount] = useState(0);
    const [show, setShow] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [isCourseAdded, setIsCourseAdded] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const getInstructor = async () => {
            try {
                const res = await axiosPrivate.get(`/instructors/?includedCourses=draft`);
                const fetchedCourses = res.data.courses || [];
                setInstructor(res.data.instructor);
                setCourses(fetchedCourses);

                // Sort courses to get earliest and latest
                if (fetchedCourses.length > 0) {
                    const sortedCourses = [...fetchedCourses].sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    );
                    setEarliestCourse(sortedCourses[0]); // Set earliest course
                    setLatestCourse(sortedCourses[sortedCourses.length - 1]); // Set latest course
                } else {
                    setEarliestCourse(null); // Reset if no courses
                    setLatestCourse(null); // Reset if no courses
                }

                // Find courses not updated in the last 2 months
                const twoMonthsAgo = new Date();
                twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
                const outdatedCourses = fetchedCourses.filter(
                    (course) => new Date(course.updatedAt) < twoMonthsAgo
                );
                setNotUpdatedCount(outdatedCourses.length);
                setIsCourseAdded(false);
            } catch (error) {
                console.error(error);
                setCourses([]); // Ensure courses is set to an empty array on error
            }
        };
        getInstructor();
    }, [isCourseAdded]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (courseTitle === '') {
            setError('Please enter all fields');
        } else {
            try {
                await axiosPrivate.post('/courses/', { title: courseTitle });
                setShow(false);
                setIsCourseAdded(true);
                setCourseTitle("")
            } catch (err) {
                console.log(err);
                setError(err?.response?.data?.error || 'No Server Response');
            }
        }
    };

    // Function to calculate the completion percentage of the landing page
    const calculateCompletionPercentage = (course) => {
        const fields = [
            course.title,
            course.description,
            course.subject,
            course.previewVideo,
            course.price,
            course.level,
            course.learnings.length > 0 ? course.learnings : null,
            course.requirements.length > 0 ? course.requirements : null,
        ];
        const completedFields = fields.filter((field) => field).length;
        const totalFields = fields.length;
        return Math.round((completedFields / totalFields) * 100);
    };

    const sortByLeastUpdated = () => {
        const sortedCourses = [...courses].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        setCourses(sortedCourses);
        document.getElementById("courses-table").scrollIntoView({ behavior: 'smooth' });
    }

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
            <Modal
                className="modal-content"
                isOpen={show}
                onRequestClose={() => setShow(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        top: '50%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '50%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#fff',
                        opacity: 1,
                    },
                }}
            >
                <div className="preview-content">
                    <div className="input">
                        <h3>Create new course</h3>
                    </div>
                    <form action="submit">
                        <div className="input">
                            <label className="label1">Course Title</label>
                            <input
                                className="input-01"
                                type="text"
                                onChange={(e) => setCourseTitle(e.target.value)}
                                value={courseTitle}
                            />
                            {error !== '' && <p>{error}</p>}
                        </div>

                        <div className="input">
                            <button type="submit" class="back" onClick={handleAdd}>
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
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
                                        <li class="active">
                                            <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                                        </li>
                                        <li>
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
                                                <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>


                                        {toggleList &&
                                            <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                                <li>
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
                                    <h5 className="text-muted text-uppercase mt-0 margin-bottom-10">Total Draft Courses</h5>
                                    <h4 className="mb-3" data-plugin="counterup">
                                        {courses.length}
                                    </h4>
                                    <div className="flex-row-03">
                                        <ChecklistIcon style={{ color: '#a0ce4e' }} />{' '}
                                        <h6 className="text-muted">Complete then publish</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 margin-bottom-20">
                            <div className="dashboard-card">
                                <div className="card-body">
                                    <h5 className="text-muted text-uppercase mt-0 margin-bottom-10">Untouched from 2 months</h5>
                                    <h4 className="mb-3" data-plugin="counterup">
                                        {notUpdatedCount}{' '}
                                    </h4>
                                    <div className="flex-row-03">
                                        <ArrowUpwardIcon style={{ color: '#a0ce4e' }} />{" "}
                                        <h6 className="text-muted" style={{ cursor: 'pointer' }} onClick={sortByLeastUpdated}>Show them on top</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {earliestCourse && (
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div className="dashboard-card">
                                    <div className="card-body">
                                        <h5 className="text-muted text-uppercase mt-0 margin-bottom-10">Earliest Draft Course</h5>
                                        <h4 className="mb-3">
                                            <span data-plugin="counterup">{earliestCourse.title}</span>
                                        </h4>
                                        <div className='flex-row-03'>
                                            <EventIcon style={{ color: '#a0ce4e' }} />{' '}
                                            <h6 className="text-muted">
                                                {format(new Date(earliestCourse.createdAt), 'MMMM do, yyyy')}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {latestCourse && (
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div className="dashboard-card">
                                    <div className="card-body">
                                        <h5 className="text-muted text-uppercase mt-0 margin-bottom-10">Latest Draft Course</h5>
                                        <h4 className="mb-3">
                                            <span data-plugin="counterup">{latestCourse.title}</span>
                                        </h4>
                                        <div className='flex-row-03'>
                                            <EventIcon style={{ color: '#a0ce4e' }} />{' '}
                                            <h6 className="text-muted" >
                                                {format(new Date(latestCourse.createdAt), 'MMMM do, yyyy')}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                    <div className="button-row">
                        <button className="btn-04" onClick={() => setShow(true)}>
                            Create New Course
                        </button>
                    </div>
                    <div className="row dashboard-row margin-bottom-97">
                        <h4 className="card-title overflow-hidden">Draft Courses</h4>
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive" id='courses-table'>
                                    <table className="table table-centered table-hover table-xl mb-0" id="recent-orders">
                                        <thead>
                                            <tr>
                                                <th><h4>Title</h4></th>
                                                <th ><h4>Category</h4></th>
                                                <th ><h4>Landing page</h4></th>
                                                <th ><h4>Total lessons</h4></th>
                                                <th ><h4>Total items</h4></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course, index) => {
                                                const completionPercentage = calculateCompletionPercentage(course);
                                                return (
                                                    <tr
                                                        key={index}
                                                        onClick={() => handleRowClick(course._id)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td><h5>{course.title}</h5></td>
                                                        <td>
                                                            <span className="badge p-2"><h5 style={{ "marginBottom": '0px' }}>{course.subject || "-"}</h5></span>
                                                        </td>
                                                        <td>
                                                            <div className="landing-page-progress">
                                                                <div
                                                                    className="landing-page-progress-bar"
                                                                    role="progressbar"
                                                                    aria-valuenow={completionPercentage}
                                                                    aria-valuemin="0"
                                                                    aria-valuemax="100"
                                                                    style={{ width: `${completionPercentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </td>
                                                        <td className="text-truncate"><h5>{course.lessonsCount}</h5></td>
                                                        <td className="text-truncate"><h5>{course.totalItemsCount}</h5></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {courses.length === 0 && <div className='no-data'>There is no draft courses</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InstructorDashBoardDraftCourses;
