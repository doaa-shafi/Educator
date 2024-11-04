import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import axios from '../../api/axios'
import Footer from '../../components/Footer'
import Typewriter from '../../components/Typewriter/Typewriter'
import Stars from '../../components/Stars/Stars'
import './Enterprise.css'
import Modal from 'react-modal';
import logo from '../../assets/logo_white.png'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import CheckIcon from '@mui/icons-material/Check';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import StripeCheckout from "react-stripe-checkout"


const Enterprise = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const goToCourse = (courseId) => {
        navigate(`/course-preview/${courseId}`);
    };
    const textArray = ['growth', 'innovation', 'employee success'];

    const [courses, setCourses] = useState([])

    useEffect(() => {
        const getCourses = async () => {
            const res = await axios.get("courses/populer");
            console.log(res.data)
            setCourses(res.data);
        };

        getCourses();

    }, [])

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

            // Confirm the payment with the client secret
            const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

            if (confirmError) {
                setError(confirmError.message);
                setIsProcessing(false);
                return;
            }

            alert('Subscription successful!');
            setError(null);
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred");
        }

        setIsProcessing(false);
    };

    const handleToken = async (token) => {
        // When Stripe sends back the token, you proceed with creating the corporate

        if (username === "" || email === "" || plan === "" || confirmPassword === "" || password === "") {
            setError("Please enter all fields")
        }

        else if (!validMatch || !validPwd || !validName || !validEmail) {
            setError("Please enter valid inputs")
        }

        else if (!agree) {
            setError("Please accept our policy")
        }
        else {
            try {
                const response = await axios.post('/corporates/', {
                    username,
                    email,
                    password,
                    confirm_password: confirmPassword,
                    plan,
                    paymentMethodId: token.id, // Stripe token to be passed to the backend
                });
                setShow(false);
            } catch (err) {
                console.error(err);
                if (!err?.response) {
                    setError('No Server Response');
                } else {
                    const error = err.response.data.error;
                    setError(error);
                }
            }
        }
    };

    const handleStartNowClick = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };
    const [show, setShow] = useState(false);
    const [plan, setPlan] = useState('');

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

        <div class="home-02">

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
                        opacity: 1
                    }
                }}
            >
                <div className="preview-content">
                    <h3>{plan} Plan Registration</h3>
                    <form onSubmit={handleSubmit}>
                        <h3>Subscribe to a Plan</h3>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        
                        <CardElement options={{ hidePostalCode: true }} />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" disabled={!stripe || isProcessing}>
                            {isProcessing ? 'Processing...' : 'Subscribe'}
                        </button>
                    </form>
                    <form action="submit">
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
                        <div className='check'>
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={() => setAgree(!agree)}
                            />
                            <p className="label1">I agree that I have read and accepted the Payment Policy, Terms of Use, and Privacy Policy.</p>
                        </div>
                        {error && <p>{error}</p>}
                        {/* Stripe Checkout */}
                        <StripeCheckout
                            name="Corporate Subscription Payment"
                            description={`Payment for ${plan} plan`}
                            amount={plan === 'Standard' ? 12990 : 22990} // Stripe expects the amount in cents
                            currency="USD"
                            token={handleToken}
                            stripeKey='pk_test_51MEakIBldv5L7zd6VIwU8t8Ss5p8oj0gX0gkNbEXdSa5QfdRY4U8Yu4R0qFVjz9FlHBfaBqe8Ljbc5xzzFqXgmaa00bFSEVehl'
                        >
                            <button type="button" className="price-btn" disabled={!agree}>
                                Proceed to Payment
                            </button>
                        </StripeCheckout>
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
                    <div class="">
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
                                                <Link href="events.html">Events</Link>

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
                            {!isDivVisible && toggleList &&
                                <ul className={`main-nav__list_2 ${toggleList ? 'active' : ''}`}>
                                    <li onClick={handleIconClick}><CloseIcon /></li>
                                    <li class="active">
                                        <Link to={"/"}>Home</Link>
                                    </li>
                                    <li>
                                        <Link href="events.html">Events</Link>

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
                    <div class="info-box-03">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h3 className="info-box-subtitle">Learning today</h3>
                                    <p className="info-box-title">
                                        for{" "}
                                        <span className="info-box-title__text">
                                            <Typewriter texts={textArray} />
                                        </span>
                                    </p>
                                    <div class="info-box-text">
                                        <p>Empower Your Workforce with Customized Training Solutions.
                                            <br /> Unlock employee potential with a platform designed for growth, innovation, and success. </p>
                                    </div>
                                    <a class="btn-07" onClick={() => handleStartNowClick('pricing-plans')}>Start now</a>
                                    <a href="#" class="btn-03">Learn more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>


                <main class="content-row">
                    <div class="content-box-02 padding-top-96 padding-bottom-55">
                        <div class="row">
                            <div className="flex-row-02">
                                <div className='process-item'>
                                    <h3 class="process-title-01">Our{" "}
                                        <span>Mission</span>
                                    </h3>
                                    <p class="process-text-02">We offer many advantages to corporates and their trainees: a wide selection of courses taught by certified and knowledgeable instructors, the ability to track trainee progress across different courses, and top-tier customer support for both corporates and trainees.</p>
                                </div>
                                <div >
                                    <h3 class="process-title-01">Our{" "}
                                        <span>Principles</span>
                                    </h3>
                                    <ul class="ul-list-02 process-list">
                                        <li><CheckIcon className='icon-01' />Certified Expert Instructors</li>
                                        <li><CheckIcon className='icon-01' />Custom Learning Paths</li>
                                        <li><CheckIcon className='icon-01' />Detailed Progress Tracking</li>
                                        <li><CheckIcon className='icon-01' />Scalable Training Solutions</li>
                                        <li><CheckIcon className='icon-01' />Comprehensive Course Library</li>
                                        <li><CheckIcon className='icon-01' />24/7 Customer Support</li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-box-01 padding-top-93">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <h3 class="title-02 title-02--mr-01">Our Popular
                                        <span> Courses</span>
                                    </h3>
                                    <p class="subtitle-01">Discover our top-rated courses, chosen for their high enrollments and excellent ratings. Dive into engaging content and enhance your skills with ease!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-box-01 padding-bottom-100">
                        <div className="row">
                            <div class="col-lg-12">
                                <ul className="product-list">
                                    {courses.length > 0 && courses.map(course => {
                                        const isDiscountValid = course?.discount?.quantity > 0 && new Date(course?.discount?.discountEnd) > new Date();
                                        const discountedPrice = isDiscountValid
                                            ? (course.price - (course.price * course.discount.quantity / 100).toFixed(2))
                                            : null;
                                        const daysLeft = isDiscountValid
                                            ? Math.ceil((new Date(course.discount.discountEnd) - new Date()) / (1000 * 60 * 60 * 24))
                                            : null;
                                        return (
                                            <li className="product-list__item" key={course.id} onClick={() => goToCourse(course._id)}>

                                                <img src={course.thumbnail} alt={course.title} />

                                                <div className="product-list__content">
                                                    <div className='course-flex-div'>
                                                        <h3 className="product-list__title">
                                                            {course.title}
                                                        </h3>
                                                        <Link className="product-list__category" href="#">{course.subject}</Link>
                                                    </div>

                                                    <p className="product-list__info-piece"><Stars value={course.avgRating} number={course.ratings.length}></Stars></p>
                                                    {isDiscountValid ? (
                                                        <>
                                                            <p className="product-list__info-piece flex-row"><span className="flex-row"><span>${discountedPrice}</span><span style={{ textDecoration: 'line-through' }}>${course.price.toFixed(2)}</span> </span><span>{daysLeft} days left</span></p>
                                                        </>
                                                    ) : (
                                                        <p className="product-list__info-piece">${course.price.toFixed(2)}</p>
                                                    )}
                                                </div>
                                                <div className="product-list__item-info">
                                                    <p className="product-list__info-piece"><PeopleIcon /><span>   </span>{course.enrolledStudents} Students</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <Link href="courses.html" class="btn-01">See more</Link>
                                </div>
                            </div>
                        </div>
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
                                            <span class="price-box-01__in">$</span>129.9
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
                                        <li >
                                            <CloseIcon className='icon-01' /><span>Cannot create sub-teams</span>
                                        </li>
                                        <li>
                                            <CheckIcon className='icon-01' /><span>Assign course to one trainee or the whole team</span>
                                        </li>
                                        <li>
                                            <CloseIcon className='icon-01' /><span>Cannot assign course to sub-team</span>
                                        </li>
                                    </ul>

                                    <button class="price-btn" type="button" onClick={() => { setShow(true); setPlan("Standard") }}>Select plan</button>


                                </div>
                                <div class="price-box-02">
                                    <div class="price-box-02__header">
                                        <h3 class="price-box-02__header-title">Premium Plan</h3>
                                        <p class="price-box-02__header-price">
                                            <span class="price-box-01__in">$</span>229.9
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
                                            <CheckIcon className='icon-01' /><span>create sub-teams</span>
                                        </li>
                                        <li>
                                            <CheckIcon className='icon-01' /><span>Assign course to one trainee or the whole team</span>
                                        </li>
                                        <li>
                                            <CheckIcon className='icon-01' /><span>Assign course to sub-team</span>
                                        </li>
                                    </ul>

                                    <button class="price-btn" type="button" onClick={() => { setShow(true); setPlan("Premium") }}>Select plan</button>

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
                                                        <p class="stat_count" data-count="362">0</p>
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
                                                        <p class="stat_count" data-count="2458">0</p>
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
                                                        <p class="stat_count" data-count="19">0</p>
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
                                                        <p class="stat_count" data-count="35">0</p>
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
                            <div class="row">
                                <div class="owl-carousel owl-option-01 owl-theme-01">
                                    <div class="owl-theme-01__item">
                                        <figure class="owl-theme-01__item-img">
                                            <img src="img/services/services_avatar_01.png" alt="" />
                                        </figure>
                                        <div class="owl-theme-01__item-header">
                                            <h3 class="owl-theme-01__item-title">Kate Moriss</h3>
                                            <p class="owl-theme-01__item-subtitle">Graduate</p>
                                        </div>
                                        <div class="owl-theme-01__item-content">
                                            <p>“Duis aute irure dolor in reprehenderit in volu ptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non.”</p>
                                        </div>
                                    </div>
                                    <div class="owl-theme-01__item">
                                        <figure class="owl-theme-01__item-img">
                                            <img src="img/services/services_avatar_02.png" alt="" />
                                        </figure>
                                        <div class="owl-theme-01__item-header">
                                            <h3 class="owl-theme-01__item-title">Mikle Haris</h3>
                                            <p class="owl-theme-01__item-subtitle">Graduate</p>
                                        </div>
                                        <div class="owl-theme-01__item-content">
                                            <p>“Duis aute irure dolor in reprehenderit in volu ptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non.”</p>
                                        </div>
                                    </div>
                                    <div class="owl-theme-01__item">
                                        <figure class="owl-theme-01__item-img">
                                            <img src="img/services/services_avatar_03.png" alt="" />
                                        </figure>
                                        <div class="owl-theme-01__item-header">
                                            <h3 class="owl-theme-01__item-title">Kate Moriss</h3>
                                            <p class="owl-theme-01__item-subtitle">Graduate</p>
                                        </div>
                                        <div class="owl-theme-01__item-content">
                                            <p>“Duis aute irure dolor in reprehenderit in volu ptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non.”</p>
                                        </div>
                                    </div>
                                    <div class="owl-theme-01__item">
                                        <figure class="owl-theme-01__item-img">
                                            <img src="img/services/services_avatar_04.png" alt="" />
                                        </figure>
                                        <div class="owl-theme-01__item-header">
                                            <h3 class="owl-theme-01__item-title">Mikle Haris</h3>
                                            <p class="owl-theme-01__item-subtitle">Graduate</p>
                                        </div>
                                        <div class="owl-theme-01__item-content">
                                            <p>“Duis aute irure dolor in reprehenderit in volu ptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non.”</p>
                                        </div>
                                    </div>
                                    <div class="owl-theme-01__item">
                                        <figure class="owl-theme-01__item-img">
                                            <img src="img/services/services_avatar_01.png" alt="" />
                                        </figure>
                                        <div class="owl-theme-01__item-header">
                                            <h3 class="owl-theme-01__item-title">Kate Moriss</h3>
                                            <p class="owl-theme-01__item-subtitle">Graduate</p>
                                        </div>
                                        <div class="owl-theme-01__item-content">
                                            <p>“Duis aute irure dolor in reprehenderit in volu ptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non.”</p>
                                        </div>
                                    </div>
                                    <div class="owl-theme-01__item">
                                        <figure class="owl-theme-01__item-img">
                                            <img src="img/services/services_avatar_02.png" alt="" />
                                        </figure>
                                        <div class="owl-theme-01__item-header">
                                            <h3 class="owl-theme-01__item-title">Mikle Haris</h3>
                                            <p class="owl-theme-01__item-subtitle">Graduate</p>
                                        </div>
                                        <div class="owl-theme-01__item-content">
                                            <p>“Duis aute irure dolor in reprehenderit in volu ptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non.”</p>
                                        </div>
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