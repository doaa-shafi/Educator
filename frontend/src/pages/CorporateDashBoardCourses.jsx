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

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CorporateDashBoardCourses = () => {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

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
    const [selectedCourses, setSelectedCourses] = useState([])


    const [error, setError] = useState("")
    const [error2, setError2] = useState("")

    useEffect(() => {
        const getCorporate = async () => {
            try {
                const res = await axiosPrivate.get(`/corporates/`);
                setCorporate(res.data);
                const res2 = await axiosPrivate.get("/corporateTrainees/emails")
                setTrainees(res2.data)
            } catch (error) {
                console.error(error);
            }
        };
        getCorporate();
    }, []);

    useEffect(() => {
        const getPrice = async () => {
            try {
                if (totalEnrollments > 0 && courseId !== "") {
                    const res = await axiosPrivate.get(`/courses/price/?courseId=${courseId}&totalEnrollments=${totalEnrollments}`);
                    setPrice(res.data);
                    console.log(res.data)
                }

            } catch (error) {
                setError(error.response?.data?.error || "An error occurred");
            }
        };
        getPrice();
    }, [totalEnrollments, courseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (!stripe || !elements) {
            setError("Stripe is not loaded");
            setIsProcessing(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Create a PaymentMethod
        const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (paymentError) {
            setError(paymentError.message);
            setIsProcessing(false);
            return;
        }

        // Send the details to the backend to create the subscription
        try {
            const response = await axiosPrivate.patch('/corporates/courses', { courseId, totalEnrollments, paymentMethodId: paymentMethod.id, })
            setCorporate(response.data)
            setShow(false);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred");
        }

        setIsProcessing(false);
    };


    const handleTraineeChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedTrainees(values);
    };

    const handleCourseChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedCourses(values);
    };

    const assign = async () => {
        if (selectedCourses.length === 0 || selectedTrainees.length === 0) {
            setError("Please enter all fields")
        }
        else {
            try {
                const response = await axiosPrivate.patch('/corporateTrainees/', { coursesIds: selectedCourses, traineesIds: selectedTrainees })
                setCorporate(response.data)
            } catch (err) {
                console.log(err)
                if (!err?.response) {
                    setError2('No Server Response');
                }
                else {
                    const error = err.response.data.error
                    setError2(error)
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
                <header className="wrapp-header dashboard-header">
                    <div class="main-nav">
                        <div class="container">
                            <div className="flex-row padding-around">
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
                                {!isDivVisible &&
                                    <div className="flex-column">
                                        <ul className="main-nav__list">
                                            <li class="active">
                                                <Link to={'/corporate-dashboard/courses'}>Courses Registry</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>

                                        {toggleList &&
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
                                }
                            </div>
                        </div>
                    </div>
                </header>
                <main class="content-row">
                    <div class="container margin-top-20">
                        {corporate?.status === "Pending" &&
                            <div className="row error-02 margin-bottom-20">
                                <p>
                                    Your corporate account is currently pending due to a subscription renewal failure. Trainees cannot access their courses, and you are unable to add new courses or assign courses to trainees until the subscription is renewed successfully.
                                </p>
                            </div>
                        }
                        <div class="row dashboard-row">
                            <div className="col-lg-6 margin-bottom-20 ">
                                <div class="dashboard-card min-height">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Add New Course</h5>
                                        <form onSubmit={handleSubmit}>
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
                                            <div className="input">
                                                <CardElement options={{ hidePostalCode: true }} />
                                            </div>
                                            {error && <p style={{ color: 'red' }}>{error}</p>}

                                            <button type="submit" className='btn-05' disabled={!stripe || isProcessing ||corporate?.status === "Pending"}>
                                                {isProcessing ? 'Processing...' : 'Add'}
                                            </button>

                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 margin-bottom-20 ">
                                <div class="dashboard-card min-height">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Assign Courses To Trainees</h5>
                                        <div>
                                            <div className="form-group padding-top-10 padding-bottom-10">
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
                                            <div className="form-group padding-bottom-10">
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
                                            <button class="btn-05" onClick={assign} disabled={corporate?.status === "Pending"}>Assign</button>
                                            {error !== "" && <p>{error}</p>}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="margin-top-20"></div>
                    <div class="container">
                        <div class="row dashboard-row margin-bottom-97">
                            <h3 className="card-title">Courses</h3>
                            <div className="card">
                                <div className="card-body">

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
                                                            <td className="text-truncate"><h5>{course.totalEnrollments - course.currentEnrollments}</h5></td>
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