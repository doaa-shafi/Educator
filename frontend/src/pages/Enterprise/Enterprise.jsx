import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import axios from '../../api/axios'

//local components
import Footer from '../../components/Footer'
import Typewriter from '../../components/Typewriter/Typewriter'
import PopularCourses from '../../components/PopularCourses'
import Pagination from '../../components/Pagination/Pagination'
import './Enterprise.css'

//external components
import Modal from 'react-modal';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

//icons
import logo from '../../assets/logo_white.png'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';


const Enterprise = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const goToCourse = (courseId) => {
        navigate(`/course-preview/${courseId}`);
    };

    const [courses, setCourses] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCourses = async (page = 1) => {
        try {
            const res = await axios.get(`/courses/populer?page=${page}&limit=6`);
            setCourses(res.data.courses);
            setTotalPages(res.data.totalPages);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching popular courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses(); // Fetch the first page on component mount
    }, []);

    const [username, setUsername] = useState("")
    const [validName, setValidName] = useState(true)
    const [errorName, setErrorName] = useState(true)

    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(true)
    const [errorEmail, setErrorEmail] = useState(true)

    const [password, setPassword] = useState("")
    const [validPwd, setValidPwd] = useState(true)

    const [confirmPassword, setConfirmPassword] = useState("")
    const [validMatch, setValidMatch] = useState(true)

    const [agree, setAgree] = useState(false)

    const [error, setError] = useState("")

    const passReg = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])[a-zA-Z0-9#?!@$%^&*-]{8,}$')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if ((username.length > 2 && username.length < 21) || username === "") {
            setValidName(true)
        } else {
            setValidName(false)
            setErrorName("Username should contain 3-20 characters")
        }
        setError(false)
    }, [username])

    useEffect(() => {
        setValidEmail(emailRegex.test(email) || email === "");
        if (!validEmail) {
            setErrorEmail("Please enter a valid email")
        }
        setError(false)
    }, [email])

    useEffect(() => {
        setValidPwd(passReg.test(password) || password === "");
        setValidMatch(password === confirmPassword || confirmPassword === "");
        setError("")
    }, [password, confirmPassword])

    const checkboxHandler = () => {
        if (!agree && error === "Please accept our policy") {
            setError("");
        }
        setAgree(!agree);

    }
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
            const response = await axios.post('/corporates/', {
                username,
                email,
                password,
                confirm_password: confirmPassword,
                plan,
                paymentMethodId: paymentMethod.id, // Stripe token to be passed to the backend
            });

            const { clientSecret, corporate } = response.data;
            console.log("mkmk")
            // Confirm the payment with the client secret
            const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

            if (confirmError) {
                showError("Account Created but is Pending As " + confirmError.message + " login to dashboard and try again")
                setShow(false);
                setIsProcessing(false);
                return;
            }

            showSuccess('Subscription successful!');
            setShow(false);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred");
        }

        setIsProcessing(false);
    };

    const handleStartNowClick = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };
    const [show, setShow] = useState(false);
    const [plan, setPlan] = useState('');

    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);
    const [count3, setCount3] = useState(0);
    const [count4, setCount4] = useState(0);
    const [hasCounted, setHasCounted] = useState(false); // Prevent re-triggering the animation

    useEffect(() => {
        const parallaxSection = document.querySelector('.parallax');

        const handleCountUp = () => {
            const targets = [60, 6000, 5, 200]; // Target counts for each counter
            const durations = [2000, 2000, 2000, 2000]; // Duration for each counter (in ms)
            const intervals = 10; // Interval duration in ms

            const steps = targets.map((target, index) => target / (durations[index] / intervals));

            let counts = [0, 2000, 0, 0]; // Initial counts for the counters

            const intervalIds = targets.map((target, index) => {
                return setInterval(() => {
                    counts[index] += steps[index];

                    if (counts[index] >= target) {
                        // When a counter reaches its target
                        if (index === 0) setCount1(target);
                        if (index === 1) setCount2(target);
                        if (index === 2) setCount3(target);
                        if (index === 3) setCount4(target);
                        clearInterval(intervalIds[index]); // Stop the interval for this counter
                    } else {
                        // Update the counter state
                        if (index === 0) setCount1(Math.ceil(counts[index]));
                        if (index === 1) setCount2(Math.ceil(counts[index]));
                        if (index === 2) setCount3(Math.ceil(counts[index]));
                        if (index === 3) setCount4(Math.ceil(counts[index]));
                    }
                }, intervals);
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasCounted) {
                    setHasCounted(true);
                    handleCountUp();
                }
            });
        });

        if (parallaxSection) observer.observe(parallaxSection);

        return () => {
            if (parallaxSection) observer.unobserve(parallaxSection);
        };
    }, [hasCounted]);


    const [isDivVisible, setIsDivVisible] = useState(false);
    const [toggleList, setToggleList] = useState()
    const navListRef = useRef(null);

    const handleClickOutside = (event) => {
        if (navListRef.current && !navListRef.current.contains(event.target)) {
            setToggleList(false);
        }
    };

    useEffect(() => {
        if (toggleList) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleList]);

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
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    const showSuccess = (message) => {
        setAlertMessage(message);
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 2000); // Hide the alert after 3 seconds
    };

    const showError = (message) => {
        setAlertMessage(message);
        setShowErrorAlert(true);
    };


    return (

        <div class="home-02">
            <Modal
                className="modal-content"
                isOpen={showSuccessAlert}
                onRequestClose={() => setShowSuccessAlert(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        padding: '20px',
                        top: '23%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '20%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        fontSize: '16px',
                        opacity: 1,
                        zIndex: '100',
                        borderRadius: "7px"
                    },
                }}
            >
                <div className="preview-content">
                    <span>{alertMessage}</span>
                </div>
            </Modal>

            <Modal
                className="modal-content"
                isOpen={showErrorAlert}
                onRequestClose={() => setShowErrorAlert(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        padding: '20px',
                        top: '23%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '50%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        fontSize: '16px',
                        opacity: 1,
                        zIndex: '100',
                        borderRadius: "7px"
                    },
                }}
            >
                <div className="preview-content">
                    <span>{alertMessage}</span>
                    <span>{"   "}</span>
                    <CloseIcon style={{ cursor: "pointer" }} onClick={() => setShowErrorAlert(false)} />
                </div>
            </Modal>

            <Modal
                className="modal-content"
                isOpen={show}
                onRequestClose={() => setShow(false)}
                contentLabel="Register Corporate"
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
                        opacity: 1,
                        borderRadius: "7px",
                    }
                }}
            >
                <div className="preview-content">
                    <h3>{plan} Plan Registration</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input">
                            <label className="label1">Corporate name</label>
                            <input className="in" type='text' onChange={(e) => setUsername(e.target.value)} value={username} />
                        </div>
                        <div className="input">
                            <label className="label1">Corporate email</label>
                            <input className="in" type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                        </div>
                        <div className="input">
                            <label className="label1">Password</label>
                            <input className="in" type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
                        </div>
                        <div className="input">
                            <label className="label1">Confirm Password</label>
                            <input className="in" type='password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                        </div>
                        <div className="input">
                            <CardElement options={{ hidePostalCode: true }} />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <div className='check'>
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={() => setAgree(!agree)}
                            />
                            <p className="label1">I agree that I have read and accepted the Payment Policy, Terms of Use, and Privacy Policy.</p>
                        </div>
                        <button type="submit" className='btn-01' disabled={!stripe || isProcessing}>
                            {isProcessing ? 'Processing...' : 'Subscribe'}
                        </button>

                    </form>
                </div>
            </Modal>

            <div class="wrapp-content">
                <header class="wrapp-header">
                    <div class="info-box-01">
                        <div className="container">
                            <div className="row">
                                {isDivVisible &&
                                    <ul class="social-list-01">
                                        <li>
                                            <Link class="contact-block-01__link" to={"/"}>For individuals</Link>
                                        </li>

                                        <li>
                                            <Link class="contact-block-01__link" to={"/teach-with-us"}>Teach with us</Link>
                                        </li>

                                        <li>
                                            <Link class="contact-block-01__link" to={"/for-buisness"}>Try Educator for buisness</Link>
                                        </li>

                                        <li>
                                            <Link class="contact-block-01__link" href="#">Eng</Link>
                                        </li>
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                    <div class="main-nav">
                        <div class="container">
                            <div class="row">
                                <div className="flex-row">
                                    <Link to="/" class="logo">
                                        <img src={logo} alt="" />
                                    </Link>
                                    {!isDivVisible &&
                                        <div class="main-nav__btn">
                                            <MenuIcon onClick={handleIconClick} />
                                        </div>
                                    }
                                    {isDivVisible &&
                                        <ul class="main-nav__list">
                                            <li class="active">
                                                <Link to={"/"}>Home</Link>
                                            </li>
                                            <li>
                                                <Link to={"/courses"}>Courses</Link>

                                            </li>
                                            {auth?.accessToken ?
                                                <li>
                                                    <Link to={auth.role === "IndividualTrainee" ? "/ITrainee-dashboard-enrollments" : ""}>Dashboard</Link>
                                                </li>
                                                :
                                                <> <li>
                                                    <Link to={"/sign-in"}>Sign in</Link>
                                                </li>
                                                    <li>
                                                        <Link to={"/sign-up"}>Sign up</Link>
                                                    </li></>
                                            }
                                        </ul>
                                    }
                                </div>
                            </div>
                            {!isDivVisible &&
                                <ul ref={navListRef} className={`main-nav__list_2 ${toggleList ? 'active' : ''}`}>
                                    <li style={{ color: "gray" }} onClick={handleIconClick}><CloseIcon /></li>
                                    <li>
                                        <Link style={{ color: "#4da7cc" }} to={"/teach-with-us"}>Teach with us</Link>
                                    </li>

                                    <li>
                                        <Link style={{ color: "#4da7cc" }} to={"/for-buisness"}>Try Educator for buisness</Link>
                                    </li>
                                    <hr className='menu-hr' />
                                    <li>
                                        <Link style={{ color: "#4da7cc" }} to={"/courses"}>Courses</Link>

                                    </li>
                                    {auth?.accessToken ?
                                        <li>
                                            <Link style={{ color: "#4da7cc" }} to={auth.role === "IndividualTrainee" ? "/ITrainee-dashboard-enrollments" :
                                                auth.role === "CorporateTrainee" ? "" : auth.role === "Corporate" ? "/corporate-dashboard/trainees" : auth.role === "Instructor" ? "/instructor-dashboard/draft-courses" : ""}>Dashboard</Link>
                                        </li>
                                        :
                                        <> <li>
                                            <Link style={{ color: "#4da7cc" }} to={"/sign-in"}>Sign in</Link>
                                        </li>
                                            <li>
                                                <Link style={{ color: "#4da7cc" }} to={"/sign-up"}>Sign up</Link>
                                            </li></>
                                    }
                                </ul>
                            }
                        </div>
                    </div>
                    <div class="info-box-03">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h3 className="info-box-subtitle">Learning today</h3>
                                    <p className="info-box-title">
                                        for{" "}
                                        <span className="info-box-title__text">
                                            <Typewriter />
                                        </span>
                                    </p>
                                    <div class="info-box-text">
                                        <p>Empower Your Workforce with Customized Training Solutions.
                                            <br /> Unlock employee potential with a platform designed for growth, innovation, and success. </p>
                                    </div>
                                    <a class="btn-07" onClick={() => handleStartNowClick('pricing-plans')}>Start now</a>
                                    <a href="#learn-more" class="btn-03">Learn more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>


                <main class="content-row">
                    <div class="content-box-02 padding-top-96 padding-bottom-55" id="learn-more">
                        <div class="row">
                            <div class="col-lg-12 text-center">
                                <h3 class="title-02 ">How it
                                    <span> Works</span>
                                </h3>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="news-info">
                                    <div class="news-info__post">
                                        <div class="news-info__date-block">
                                            <p>1</p>
                                        </div>
                                        <h4 class="news-info__title">
                                            <Link href="single_event.html">
                                                Choose Your Plan:
                                            </Link>
                                        </h4>
                                        <div class="news-info__text">
                                            <p>Standard Plan: $60 / month – Ideal for small businesses or teams just starting with online training.
                                                <br />
                                                Premium Plan: $100 / month – Designed for larger organizations with extensive training needs.</p>
                                        </div>
                                    </div>
                                    <div class="news-info__post">
                                        <div class="news-info__date-block">
                                            <p>2</p>
                                        </div>
                                        <h4 class="news-info__title">
                                            <Link href="single_event.html">
                                                Add Courses:
                                            </Link>
                                        </h4>
                                        <div class="news-info__text">
                                            <p>Select from a wide range of courses to train your employees.
                                                Specify the number of enrollments you need for each course upfront.</p>
                                        </div>
                                    </div>
                                    <div class="news-info__post">
                                        <div class="news-info__date-block">
                                            <p>3</p>
                                        </div>
                                        <h4 class="news-info__title">
                                            <Link href="single_event.html">
                                                Assign Enrollments:
                                            </Link>
                                        </h4>
                                        <div class="news-info__text">
                                            <p>Distribute the enrollments to your team members and track their progress seamlessly on our platform.</p>
                                        </div>
                                    </div>
                                    <div class="news-info__post">
                                        <div class="news-info__date-block">
                                            <p>4</p>
                                        </div>
                                        <h4 class="news-info__title">
                                            <Link href="single_event.html">
                                                Extend Enrollments Anytime
                                            </Link>
                                        </h4>
                                        <div class="news-info__text">
                                            <p>Need more enrollments? No problem!
                                                We recalculate the total cost for all enrollments (new and existing) and subtract what you've already paid, ensuring you only pay for the additional seats.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='margin-top-80 margin-bottom-34'>
                        <PopularCourses courses={courses} goToCourse={goToCourse} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => fetchCourses(page)}
                        />
                    </div>
                    <div id="pricing-plans" class="content-box-01 padding-top-50 padding-bottom-60">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <h3 class="title-02">Choose
                                        <span> Your Plan</span>
                                    </h3>
                                    <p class="subtitle-01 margin-bottom-40">Choose suitable plan, start training your employees with our courses and unlock their potential.</p>
                                </div>
                            </div>
                            <div class="price-plans">
                                <div class="price-box-01">
                                    <div class="price-box-01__header">
                                        <h3 class="price-box-01__header-title">Standard Plan</h3>
                                        <p class="price-box-01__header-price">
                                            <span class="price-box-01__in">$</span>60
                                            <span class="price-box-01__date">/ mounth</span>
                                        </p>
                                    </div>
                                    <ul class="price-list">
                                        <li>
                                            <CheckIcon className='icon-01' /><span>Access to beginner and intermediate courses </span>
                                        </li>
                                        <li>
                                            <CloseIcon className='icon-01' /><span>No access to advanced courses</span>
                                        </li>
                                        <li>
                                            <PriorityHighIcon className='icon-01' /><span>You can add up to 20 trainee only</span>
                                        </li>
                                        <li>
                                            <CheckIcon className='icon-01' /><span>Get 20% discount on every enrollment</span>
                                        </li>
                                    </ul>

                                    <button class="btn-01" type="button" onClick={() => { setShow(true); setPlan("Standard") }}>Select plan</button>


                                </div>
                                <div class="price-box-02">
                                    <div class="price-box-02__header">
                                        <h3 class="price-box-02__header-title">Premium Plan</h3>
                                        <p class="price-box-02__header-price">
                                            <span class="price-box-01__in">$</span>100
                                            <span class="price-box-01__date">/ mounth</span>
                                        </p>
                                    </div>
                                    <ul class="price-list">
                                        <li>
                                            <CheckIcon className='icon-01' /><span>Access to beginner and intermediate courses</span>
                                        </li>
                                        <li>
                                            <CheckIcon className='icon-01' /><span>Access to advanced courses</span>
                                        </li>
                                        <li>
                                            <AllInclusiveIcon className='icon-01' /><span>No limit on number of added trainees</span>
                                        </li>
                                        <li>
                                            <CheckIcon className='icon-01' /><span>Get 30% discount on every enrollment</span>
                                        </li>
                                    </ul>

                                    <button class="btn-01" type="button" onClick={() => { setShow(true); setPlan("Premium") }}>Select plan</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="parallax parallax_03">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="module-counter counter-02">
                                        <div class="shortcode_counter">
                                            <div class="counter_wrapper">
                                                <div class="counter_content">
                                                    <div class="stat_count_wrapper">
                                                        <p class="stat_count" data-count="362">{count1.toLocaleString()}+</p>
                                                        <p class="counter_title">People Working</p>
                                                    </div>
                                                    <div class="stat_temp"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="shortcode_counter">
                                            <div class="counter_wrapper">
                                                <div class="counter_content">
                                                    <div class="stat_count_wrapper">
                                                        <p class="stat_count" data-count="2458">{count2.toLocaleString()}+</p>
                                                        <p class="counter_title">Student Enrolled</p>
                                                    </div>
                                                    <div class="stat_temp"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="shortcode_counter">
                                            <div class="counter_wrapper">
                                                <div class="counter_content">
                                                    <div class="stat_count_wrapper">
                                                        <p class="stat_count" data-count="19">{count3.toLocaleString()}+</p>
                                                        <p class="counter_title">Years of Experience</p>
                                                    </div>
                                                    <div class="stat_temp"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="shortcode_counter">
                                            <div class="counter_wrapper">
                                                <div class="counter_content">
                                                    <div class="stat_count_wrapper">
                                                        <p class="stat_count" data-count="35">{count4.toLocaleString()}+</p>
                                                        <p class="counter_title">Exelent Courses</p>
                                                    </div>
                                                    <div class="stat_temp"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-box-02 padding-top-96 padding-bottom-67">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <h3 class="title-02">Corporates
                                        <span> Testimonials</span>
                                    </h3>
                                    <p class="subtitle-01 margin-bottom-34">Discover how corporate clients have transformed their teams and achieved success with Educator's flexible, high-quality training programs, as shared through their real experiences and results.</p>
                                </div>
                            </div>
                            <div class="less-padding-row testimonials">

                                <div class="owl-theme-01__item">

                                    <div class="owl-theme-01__item-header">
                                        <h3 class="owl-theme-01__item-title">Momo Digitals</h3>
                                        <p className="product-list__category">Marketing Agency</p>
                                    </div>
                                    <div class="owl-theme-01__item-content">
                                        <p>“Educator has been instrumental in upskilling our team. The platform's flexibility and vast course offerings have helped our employees excel in their roles. Highly recommended!”</p>
                                    </div>
                                </div>
                                <div class="owl-theme-01__item">

                                    <div class="owl-theme-01__item-header">
                                        <h3 class="owl-theme-01__item-title">Robusta Studio</h3>
                                        <p className="product-list__category">Software Company</p>
                                    </div>
                                    <div class="owl-theme-01__item-content">
                                        <p>“We saw a significant boost in productivity after adopting Educator. The ease of assigning courses and tracking employee progress makes it a game-changer for corporate training.”</p>
                                    </div>
                                </div>
                                <div class="owl-theme-01__item">

                                    <div class="owl-theme-01__item-header">
                                        <h3 class="owl-theme-01__item-title">Designo Stores</h3>
                                        <p className="product-list__category">E-commerce Company</p>
                                    </div>
                                    <div class="owl-theme-01__item-content">
                                        <p>“Our workforce development strategy improved tremendously thanks to Educator. The ability to extend enrollments as needed ensures we always have the flexibility to meet training demands.”</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer></Footer>

            </div>


        </div>


    )
}

export default Enterprise