import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
//hooks
import useAxiosPrivate from '../hooks/useAxiosPrivate'
//images
import logo from '../assets/logo_dark.png'
//components
import Stars from '../components/Stars/Stars'


const ITraineeDashBoardEnrollments = () => {
    const navigate=useNavigate()
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
    return (
        <div class="teach-with-us">
            <div class="wrapp-content">
                <div class="main-nav">
                    <div class="container">
                        <div className="flex-row">
                            <Link to="/"><img class="logo" src={logo} alt="" /></Link>
                            <ul class="main-nav__list">
                                <li className='active'>
                                    <Link to={"/instructor-dashboard/draft-courses"}>My courses</Link>
                                </li>
                                <li>
                                    <Link to={"/instructor-dashboard/wallet"}>Wallet</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <main class="content-row ">
                    <div className="row padding-top-40">
                        <ul className='product-list-02'>
                            {enrollments.length > 0 && enrollments.map(enrollment => {
                                return (
                                    <li className="product-list__item" onClick={()=>goto_enrollment(enrollment.course._id)}>
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
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ITraineeDashBoardEnrollments