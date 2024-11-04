import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import Select from 'react-select';
import StripeCheckout from "react-stripe-checkout"
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CorporateDashBoardCourses = () => {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const handleRowClick = (trianeeId) => {
        navigate(`/corporate-dashboard/trainees/${trianeeId}`);
    };
    const [corporate, setCorporate] = useState()
    const [show, setShow] = useState()

    const [courseId, setCourseId] = useState("")
    const [totalEnrollments, setTotalEnrollments] = useState()
    const [price, setPrice] = useState(0)

    const [trainees, setTrainees] = useState([])
    const [selectedTrainees, setSelectedTrainees] = useState([])
    const [selectedCourses,setSelectedCourses]=useState([])


    const [error, setError] = useState("")

    useEffect(() => {
        const getCorporate = async () => {
            try {
                const res = await axiosPrivate.get(`/corporates/`);
                setCorporate(res.data);
                const res2=await axiosPrivate.get("/corporateTrainees/emails")
                setTrainees(res2.data)
                console.log(res.data)
                console.log(res2.data)
            } catch (error) {
                console.error(error);
            }
        };
        getCorporate();
    }, []);

    useEffect(() => {
        const getPrice = async () => {
            console.log("here")
            try {
                if (totalEnrollments > 0 && courseId !== "") {
                    const res = await axiosPrivate.get(`/courses/price/?courseId=${courseId}&totalEnrollments=${totalEnrollments}`);
                    setPrice(res.data);
                    console.log(res.data)
                }

            } catch (error) {
                console.error(error);
            }
        };
        getPrice();
    }, [totalEnrollments, courseId]);


    const add = async (token) => {
        if (courseId === "" || totalEnrollments === "") {
            setError("Please enter all fields")
        }

        // else if (!validMatch || !passwordCriteria.minLength || !passwordCriteria.lowercase || !passwordCriteria.uppercase
        //     || !passwordCriteria.number || !passwordCriteria.specialChar || !validFirstname || !validLastName || !validEmail) {
        //     setError("Please enter valid inputs")
        // }

        else {
            try {
                const response = await axiosPrivate.patch('/corporates/courses', { courseId, totalEnrollments, token })
                setCorporate(response.data)
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
    }

    const handleTraineeChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedTrainees(values);
    };

    const handleCourseChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedCourses(values);
    };

    const assign = async (token) => {
        if (selectedCourses.length===0 || selectedTrainees.length === 0) {
            setError("Please enter all fields")
        }

        // else if (!validMatch || !passwordCriteria.minLength || !passwordCriteria.lowercase || !passwordCriteria.uppercase
        //     || !passwordCriteria.number || !passwordCriteria.specialChar || !validFirstname || !validLastName || !validEmail) {
        //     setError("Please enter valid inputs")
        // }

        else {
            try {
                const response = await axiosPrivate.patch('/corporateTrainees/', { coursesIds:selectedCourses, traineesIds:selectedTrainees })
                setCorporate(response.data)
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
                    <h3>Add new trainee</h3>

                </div>
            </Modal>
            <div class="wrapp-content">
                <header className="wrapp-header">
                    <div class="main-nav">
                        <div class="container">
                            <div className="flex-row">
                                <Link to="/" class="logo">
                                    <img src={logo} alt="" />
                                </Link>
                                {isDivVisible &&
                                    <ul class="main-nav__list">
                                        <li >
                                            <Link to={'/corporate-dashboard/trainees'}>Trainees</Link>
                                        </li>
                                        <li class="active">
                                            <Link to={'/corporate-dashboard/courses'}>Courses Registry</Link>
                                        </li>
                                        <li>
                                            <Link to={'/corporate-dashboard/plan&payment'}>Plan & Payment</Link>
                                        </li>
                                    </ul>
                                }
                                <div className="flex-column">
                                    {!isDivVisible &&
                                        <ul className="main-nav__list">
                                            <li class="active">
                                                <Link to={'/corporate-dashboard/courses'}>Courses Registry</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>

                                    }
                                    {!isDivVisible && toggleList &&
                                        <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                            <li>
                                                <Link to={'/corporate-dashboard/trainees'}>Trainees</Link>
                                            </li>
                                            <li>
                                                <Link to={'/corporate-dashboard/plan&payment'}>Plan & Payment</Link>
                                            </li>
                                        </ul>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main class="content-row">
                    <div class="container margin-top-40">
                        <div class="row dashboard-row">
                            <div className="col-lg-6 margin-bottom-20">
                                <div class="dashboard-card-02">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Add New Course</h5>
                                        <div>
                                            <div className="input">
                                                <label className="label1">Course Id</label>
                                                <input type='text' onChange={(e) => setCourseId(e.target.value)} value={courseId} />
                                            </div>
                                            <div className="input">
                                                <label className="label1">Total Enrollments</label>
                                                <input type='number' onChange={(e) => setTotalEnrollments(e.target.value)} value={totalEnrollments} />
                                            </div>
                                            <div className="input">
                                                <label className="label1">Price : {price}</label>
                                            </div>

                                            <StripeCheckout
                                                name="Payment"
                                                description="Course Payment"
                                                amount={price * 100}
                                                currency={"USD"}
                                                token={add}
                                                stripeKey='pk_test_51MEakIBldv5L7zd6VIwU8t8Ss5p8oj0gX0gkNbEXdSa5QfdRY4U8Yu4R0qFVjz9FlHBfaBqe8Ljbc5xzzFqXgmaa00bFSEVehl'
                                            >
                                                <button class="btn-05">Add</button>
                                            </StripeCheckout>
                                            {error !== "" && <p>{error}</p>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 margin-bottom-20">
                                <div class="dashboard-card-02">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Assign Courses To Trainees</h5>
                                        <div>
                                            <div className="form-group">
                                                <Select
                                                    isMulti
                                                    class="wide"
                                                    placeholder="Selected Trainees"
                                                    options={trainees?.map((t) => ({
                                                        value: t._id,
                                                        label: t.email,
                                                    }))}
                                                    name="subject"
                                                    value={
                                                        selectedTrainees?.map((id) => {
                                                            const trainee = trainees.find((t) => t._id === id);
                                                            return { value: trainee?._id, label: trainee?.email };
                                                        }) || []
                                                    }
                                                    onChange={handleTraineeChange} />
                                            </div>
                                            <div className="form-group">
                                                <Select
                                                    isMulti
                                                    class="wide"
                                                    placeholder="Selected Courses"
                                                    options={corporate?.courses.map((c) => ({
                                                        value: c.id,
                                                        label: c.title,
                                                    }))}
                                                    name="subject"
                                                    value={
                                                        selectedCourses?.map((id) => {
                                                            const course = corporate?.courses.find((c) => c.id === id);
                                                            return { value: course?.id, label: course?.title };
                                                        }) || []
                                                    }
                                                    onChange={handleCourseChange} />
                                            </div>
                                            <button class="btn-05" onClick={assign}>Assign</button>
                                            {error !== "" && <p>{error}</p>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="row dashboard-row margin-bottom-97">
                            <div className="dashboard-card-02">
                                <div className="card-body">
                                    <h4 className="card-title overflow-hidden">Courses</h4>
                                    <div className="table-responsive">
                                        <table className="table table-centered table-hover table-xl mb-0" id="recent-orders">
                                            <thead>
                                                <tr>
                                                    <th><h4>Id</h4></th>
                                                    <th ><h4>Title</h4></th>
                                                    <th ><h4>Current Enrollments</h4></th>
                                                    <th ><h4>Remaining Enrollments</h4></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {corporate?.courses.map((course, index) => {
                                                    return (
                                                        <tr
                                                            key={index}
                                                            // onClick={() => handleRowClick(trainee._id)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <td><h5>{course._id}</h5></td>
                                                            <td className="text-truncate"><h5>{course.title}</h5></td>
                                                            <td className="text-truncate"><h5>{course.currentEnrollments}</h5></td>
                                                            <td className="text-truncate"><h5>{course.totalEnrollments-course.currentEnrollments}</h5></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        {corporate?.courses.length === 0 && <div className='no-data'>There is no courses yet</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CorporateDashBoardCourses