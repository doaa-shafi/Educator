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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const InstructorCoursePreview = () => {
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
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [oldCourseTitle, setOldCourseTitle] = useState()
  const [newCourseTitle, setNewCourseTitle] = useState()
  const [error, setError] = useState()


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

  // const enroll = async (token) => {
  //   if (!auth.accessToken) {
  //     navigate('/login'); // Redirect to the login page
  //     return;
  //   }
  //   try {
  //     await axiosPrivate.patch('/individualTrainees/register', { courseId, token });
  //     alert('Enrollment successful!');
  //     navigate('/ITrainee-dashboard-enrollments');
  //   } catch (error) {
  //     console.error(error)
  //   }
  // };

  const handleOpenCourse = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosPrivate.patch(`/courses/${courseId}/open`, { oldCourseTitle })
      setShow1(false)

    } catch (err) {
      console.log(err)
      if (!err?.response) {
        setError('No Server Response');
      }
      else {
        const error = err.response.data.error
        setError(error)
      }

    }
  }

  const handleCloneCourseAsDraft = async (e) => {
    e.preventDefault()
    try {
      if (oldCourseTitle !== course.title) {
        setError("Course title is incorrect")
        return
      }
      const response = await axiosPrivate.patch(`/courses/${courseId}/clone`, { oldCourseTitle, newCourseTitle })
      setShow2(false)

    } catch (err) {
      console.log(err)
      if (!err?.response) {
        setError('No Server Response');
      }
      else {
        const error = err.response.data.error
        setError(error)
      }

    }
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
    <body data-offset="200" className='teach-with-us' >


      <Modal
        className="modal-content"
        isOpen={show1}
        onRequestClose={() => setShow1(false)}
        contentLabel="Course Preview"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent overlay
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
            opacity: 1
          }
        }}
      >
        <div className="preview-content">
          <h3>Are you sure?</h3>
          <p>You are about to open this course again, Write course title to confirm</p>
          <form action="submit">
            <div className="input">
              <input
                className="input-01"
                type="text"
                onChange={(e) => setOldCourseTitle(e.target.value)}
                value={oldCourseTitle}
              />
            </div>
            {error !== '' && <p>{error}</p>}
            <button class="contin" type='submit' onClick={handleOpenCourse}>Confirm</button>
          </form>
        </div>
      </Modal>
      <Modal
        className="modal-content"
        isOpen={show2}
        onRequestClose={() => setShow2(false)}
        contentLabel="Course Preview"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent overlay
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
            opacity: 1
          }
        }}
      >
        <div className="preview-content">
          <h3>Are you sure?</h3>
          <p>You are abou to clone this course as draft</p>
          <form action="submit">
            <div className="input">
              <label className='label1'>Write course title to confirm</label>
              <input
                className="input-01"
                type="text"
                onChange={(e) => setOldCourseTitle(e.target.value)}
                value={oldCourseTitle}
              />
            </div>
            <div className="input">
              <label className='label1'>Enter a new title for the new clone</label>
              <input
                className="input-01"
                type="text"
                onChange={(e) => setNewCourseTitle(e.target.value)}
                value={newCourseTitle}
              />
            </div>
            {error !== '' && <p>{error}</p>}
            <button class="contin" type='submit' onClick={handleCloneCourseAsDraft}>Confirm</button>
          </form>

        </div>
      </Modal>
      <div class="wrapp-content">
        <div class="wrapp-header">
          <div class="main-nav">
            <div class="container">
              <div className="flex-row">
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
                <div className="flex-column">
                  {!isDivVisible &&
                    <ul className="main-nav__list">
                      <li class="active">
                        <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                      </li>
                      <li>
                        {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                      </li>
                    </ul>

                  }
                  {!isDivVisible && toggleList &&
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

              </div>
            </div>
          </div>
        </div>
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
            {course?.status === "closed" &&
              <div className='flex-row-03 margin-bottom-10'>
                <button className='btn-02' onClick={() => setShow1(true)}>Open</button>
                <button className='btn-02' onClick={() => setShow2(true)}>Clone As Draft</button>
              </div>
            }
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
          <div className="button-row-02">
            <button className='btn-04'>Course study page preview</button>
          </div>
          {/* <div className="enroll-now">
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

          </div> */}
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

export default InstructorCoursePreview