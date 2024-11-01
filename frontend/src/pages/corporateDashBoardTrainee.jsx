import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Stars from '../components/Stars/Stars';
import Modal from 'react-modal';
import Avatar from '../components/Avatar/Avatar';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CorporateDashBoardTrainee = () => {
    const axiosPrivate = useAxiosPrivate()
    const location = useLocation();
    const traineeId = location.pathname.split('/')[3];

    const [corporate, setCorporate] = useState()
    const [trainee, setTrainee] = useState([])
    const [show, setShow] = useState()

    const [showInput, setShowInput] = useState(false)
    const [assignedCourse, setAssignedCourse] = useState()
    // const [courseAssigned,setCourseAssigned]=useState(false)

    const [showCourseForm,setShowCourseForm]=useState(false)
    const assignCourse = async () => {
        try {
            const response = await axiosPrivate.patch(`/corporateTrainees`, { courseId: assignedCourse, traineeId });
            setShowInput(false)
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        const getCorporateAndTrainee = async () => {
            try {
                // const res1 = await axiosPrivate.get(`/corporates/`);
                const res2 = await axiosPrivate.get(`/corporateTrainees/${traineeId}`);
                // setCorporate(res1.data);
                setTrainee(res2.data)
            } catch (error) {
                console.error(error);
            }
        };
        getCorporateAndTrainee();
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
        <main>
            <div class="contact">
                <div class="row">
                    <div class="col-lg-8" id="mainContent">
                        <div class="row box">
                            <div class="box-header">
                                <div className="flex-row">
                                    <h3><strong>1</strong>Courses</h3>
                                    <div className="add-input">
                                        <AddIcon></AddIcon>
                                        <button className='add-more' onClick={() => setShowCourseForm(true)}>Add Course </button>
                                    </div>
                                </div>
                                <p> Assign or remove courses from here.</p>
                            </div>
                            {showCourseForm &&
                                <>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <input className="form-control" placeholder='Enter Course ID' value={assignedCourse} onChange={(e)=>setAssignedCourse(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <button className="btn-05" onClick={assignCourse}>save</button>
                                        </div>
                                    </div>
                                </>
                            }
                            {trainee?.enrollments && trainee.enrollments.map(enrollment => {
                                return (
                                    <div className="product-list__item">
                                        <img src={enrollment.course.thumbnail} alt={enrollment.course.title} />
                                        <div className="product-list__content">
                                            <div className='course-flex-div'>
                                                <h3 className="product-list__title">
                                                    {enrollment.course.title}
                                                </h3>
                                                <Link className="product-list__category" href="#">{enrollment.course.subject}</Link>
                                            </div>

                                            <p className="product-list__info-piece"><Stars value={enrollment.myRating.rating} number={-1} /></p>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-bar-filled"
                                                    style={{ width: `${(enrollment.completedDuration / enrollment.totalDuration) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </div>
                    {/* <div class="col-lg-4" id="sidebar">
                        <div id="contactInfoContainer" class="theiaStickySidebar">
                            <div class="contact-box">
                                <h2 className={unSavedChanges > 0 ? 'error' : ''}>{unSavedChanges > 0 && <FiberManualRecordIcon />} {unSavedChanges} Unsaved Changes</h2>
                                <button className={unSavedChanges > 0 ? 'btn-05' : 'btn-06'} onClick={saveCourse}>Save</button>
                            </div>
                            <div class="contact-box">
                                <i class="icon icon-envelope"></i>
                                <h2>{lessons.length} Lessons Created</h2>
                                <a>Click them to complete</a>
                            </div>
                            <div class="contact-box">
                                <h2>Publish Your Course</h2>
                                <a>Complete Landing page and all lessons content then publish your course</a>
                                <button className='btn-05' onClick={publish}>Publish</button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </main>
    )
}

export default CorporateDashBoardTrainee
