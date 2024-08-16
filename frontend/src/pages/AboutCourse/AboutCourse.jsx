import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StripeCheckout from "react-stripe-checkout"
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Navbar from '../../components/Navbar/Navbar';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import nopreviewavailable from '../../assets/images.jpg';
import './AboutCourse.css';
import axios from '../../api/axios';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';

const AboutCourse = () => {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const courseId = location.pathname.split('/')[2];
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axiosPrivate.get(`/courses/about/${courseId}`);
                setCourse(res.data);

                const res2 = await axios.get(`/lessons/get-lessons-info`, { params: { courseId } });
                setLessons(res2.data);
            } catch (error) {
                console.error(error);
            }
        };
        getCourse();
    }, [courseId, axiosPrivate]);

    const handleTabClick = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };

    const enroll = async (token) => {
        if (!auth.accessToken) {
            navigate('/login'); // Redirect to the login page
            return;
        }
        try {
            await axiosPrivate.patch('/individualTrainees/register', { courseId, token });
            alert('Enrollment successful!');
        } catch (error) {
            console.error(error)
        }
    };

    const renderPrice = () => {
        if (course?.discount?.quantity > 0 && new Date(course?.discount?.discountEnd) > new Date()) {
            const discountedPrice = course.price - (course.price * course.discount.quantity / 100);
            const daysLeft = Math.ceil((new Date(course.discount.discountEnd) - new Date()) / (1000 * 60 * 60 * 24));
            return (
                <div className="price-section">
                    <div className="price-container">
                        <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
                        <span className="original-price">${course.price.toFixed(2)}</span>
                    </div>
                    <div className="discount-info">
                        Save {course.discount.quantity}%
                    </div>
                    <div className="discount-info">
                        {daysLeft} days left
                    </div>

                </div>
            );
        }
        return (
            <div className="price-section">
                <div className="price-container">
                    <span className="discounted-price">${course?.price?.toFixed(2)}</span>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Navbar />
            <div className="course-preview">
                <div className="top-preview">
                    <div className="top-preview-text">
                        {/* Add any text you want to display */}
                    </div>
                    <div className="top-preview-image">
                        <img src={nopreviewavailable} alt="Course Preview" />
                        <div className="enroll-now">
                            <span>This course is open</span>
                            <StripeCheckout
                                name="Payment"
                                description="Course Payment"
                                amount={course?.price}
                                currency={"USD"}
                                token={enroll}
                                stripeKey='pk_test_51MEakIBldv5L7zd6VIwU8t8Ss5p8oj0gX0gkNbEXdSa5QfdRY4U8Yu4R0qFVjz9FlHBfaBqe8Ljbc5xzzFqXgmaa00bFSEVehl'
                            >
                                <button>Enroll now</button>
                            </StripeCheckout>

                        </div>
                    </div>
                </div>
                <div className="tabs-container">
                    <div className="tab-buttons">
                        <button className="tab-button" onClick={() => handleTabClick('overview')}>
                            Overview
                        </button>
                        <button className="tab-button" onClick={() => handleTabClick('curriculum')}>
                            Curriculum
                        </button>
                        <button className="tab-button" onClick={() => handleTabClick('price')}>
                            Price
                        </button>
                        <button className="tab-button" onClick={() => handleTabClick('instructor')}>
                            About Instructor
                        </button>
                    </div>
                </div>

                <div className="tab-content">
                    <div id="overview" className="tab-panel-section">
                        <h2 className='section-title'>Overview</h2>
                        <div className="overview-content">
                            <div className="overview-left">
                                <h3 className='sub-section-title'>Before you take this course you should know:</h3>
                                <ul className='course-ul'>
                                    {course && course.requirements.map((req, index) => (
                                        <li className='course-li' key={index}>{req}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="overview-right">
                                <button className='preview-button' onClick={() => setModalVisible(true)}>Watch Course Preview Video</button>
                            </div>
                        </div>
                        <h3 className='sub-section-title'>After finishing this course you should be able to:</h3>
                        <ul className='course-ul'>
                            {course && course.learnings.map((learn, index) => (
                                <li className='course-li' key={index}>{learn}</li>
                            ))}
                        </ul>
                    </div>
                    <div id="curriculum" className="tab-panel-section">
                        <h2 className='section-title'>Curriculum</h2>
                        <p>This course contains the following lessons:</p>
                        <ol className='lesson-list'>
                            {lessons.map((lesson, index) => (
                                <li className='lesson-item' key={index}>
                                    <div><span className='lesson-label'>Title:</span> <span className='lesson-value'>{lesson.title}</span></div>
                                    <div><span className='lesson-label'>Minutes:</span> <span className='lesson-value'>{lesson.mins}</span></div>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div id="price" className="tab-panel-section">
                        <h2 className='section-title'>Price</h2>
                        <div className="tab-price">
                            <div className="course-includes">
                                <p>This Course includes : </p>
                                <div><AllInclusiveIcon></AllInclusiveIcon> Full lifetime access</div>
                                <div><WorkspacePremiumIcon></WorkspacePremiumIcon> Certificate of completion</div>
                                <div><MobileFriendlyIcon></MobileFriendlyIcon>Access on mobile </div>
                            </div>
                            {renderPrice()}
                        </div>
                    </div>
                    <div id="instructor" className="tab-panel-section">
                        <h2 className='section-title'>About Instructor</h2>
                        {/* Add content related to the instructor */}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)'
                    }
                }}
            >
                <div className='preview-content'>
                    {ReactPlayer.canPlay(course?.previewVideo) ? (
                        <ReactPlayer url={course?.previewVideo} width="100%" height="100%" />
                    ) : (
                        <img className='no-preview' src={nopreviewavailable} alt="No preview video available" />
                    )}
                </div>
            </Modal>

        </div>
    );
};

export default AboutCourse;
