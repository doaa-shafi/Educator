import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import useAuth from '../hooks/useAuth'
import axios from '../api/axios'
import Footer from '../components/Footer'
import logo from '../assets/logo_dark.png'
import teacher from '../assets/teacher_1.jpg'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const TeachWithUs = () => {
    const { auth, setAuth } = useAuth()
    const [firstName, setFirstName] = useState("")
    const [validFirstName, setValidFirstName] = useState(true)
    const [errorFirstName, setErrorFirstName] = useState(true)

    const [lastName, setLastName] = useState("")
    const [validLastName, setValidLastName] = useState(true)
    const [errorLastName, setErrorLastName] = useState(true)

    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(true)
    const [errorEmail, setErrorEmail] = useState(true)

    const [password, setPassword] = useState("")
    const [validPwd, setValidPwd] = useState(true)

    const [confirmPassword, setConfirmPassword] = useState("")
    const [validMatch, setValidMatch] = useState(true)

    const [country, setCountry] = useState("")
    const [agree, setAgree] = useState(false)

    const [error, setError] = useState(false)

    const [file, setFile] = useState(true);


    const passReg = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])[a-zA-Z0-9#?!@$%^&*-]{8,}$')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if ((firstName.length > 2 && firstName.length < 21) || firstName === "") {
            setValidFirstName(true)
        } else {
            setValidFirstName(false)
            setErrorFirstName("First name should contain 3-20 characters")
        }
        setError(false)
    }, [firstName])

    useEffect(() => {
        if ((lastName.length > 2 && lastName.length < 21) || lastName === "") {
            setValidLastName(true)
        } else {
            setValidLastName(false)
            setErrorLastName("Last name should contain 3-20 characters")
        }
        setError(false)
    }, [lastName])

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
    const handleRequest = async (e) => {
        e.preventDefault()

        if (firstName === "" || lastName === "" || email === "" || file === "" || confirmPassword === "" || password === "") {
            setError("Please enter all fields")
        }

        else if (!validMatch || !validPwd || !validFirstName || !validLastName || !validEmail) {
            setError("Please enter valid inputs")
        }

        else if (!agree) {
            setError("Please accept our policy")
        }
        else {
            const formData = new FormData();
            formData.append('cvFile', file);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirm_password', confirmPassword);

            try {
                const response = await axios.post('/instructors/request', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Ensure proper content type
                    }
                })
            } catch (error) {
                console.log(error)
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
        <body className='teach-with-us'>
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
                            <div class="flex-row">
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
                                            <Link href="events.html">Categories</Link>

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
                    </div>
                    {!isDivVisible && toggleList &&
                        <ul className={`main-nav__list_2 ${toggleList ? 'active' : ''}`}>
                            <li onClick={handleIconClick}><CloseIcon /></li>
                            <li>
                                <Link style={{ color: "#4da7cc" }} to={"/"}>For Individuals</Link>
                            </li>

                            <li>
                                <Link style={{ color: "#4da7cc" }} to={"/for-buisness"}>Try Educator for buisness</Link>
                            </li>
                            <li >
                                <Link to={"/"}>Home</Link>
                            </li>

                            <li>
                                <Link href="events.html">Categories</Link>

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
                </header>
                <main class="content-row">
                    <div class="page-title-wrapp">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h1 class="page-title-01">Become a Teacher</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-box-02 padding-bottom-93 margin-top-40">
                        <div class="table-01">
                            <div class="table-01__row">
                                <div class="table-01__box-03">
                                    <div class="table-01__content">
                                        <h3 class="title-02">Become a
                                            <span> Teacher with Us</span>
                                        </h3>
                                        <p>Join our teaching community and turn your knowledge into income! With our platform, you can create and sell courses to a global audience. Earn 70% of the course price for each sale, giving you the chance to profit from your expertise while making a real impact on students</p>
                                        <blockquote class="margin-top-32 margin-bottom-40">
                                            <p>Start teaching with us today and unlock new opportunities!</p>
                                        </blockquote>
                                        <a class="btn-01" href="#">start now</a>
                                    </div>
                                </div>
                                <div class="table-01__box-04"></div>
                            </div>
                        </div>
                    </div>
                    <div class="content-box-01 padding-top-96 padding-bottom-93">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <h3 class="title-02">What We
                                        <span>Offer</span>
                                    </h3>
                                    <p class="subtitle-01">Suspendisse sodales arcu velit, non pretium massa accumsan non. Proin accumsan placerat mauris sit amet condimentum. Morbi luctus risus tincidunt urna hendrerit mollis.</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="owl-carousel owl-option-03">
                                        <div class="item">
                                            <div class="offer-box">
                                                <figure class="offer-box__img">
                                                    <a href="#">
                                                        <img src="img/offer/offer_img_01.jpg" alt="" />
                                                    </a>
                                                </figure>
                                                <p class="offer-box__category">
                                                    <a href="#">Economy</a>
                                                </p>
                                                <h3 class="offer-box__title">
                                                    <a href="#">Teacher of Microeconomy</a>
                                                </h3>
                                                <div class="offer-box__text">
                                                    <p>Aliquam ultrices risus et nunc pharetra sodales. Maecenas nunc dui, dapibus a congue ut, viverra.</p>
                                                </div>
                                                <a class="offer-box__btn" href="#">Read More</a>
                                            </div>
                                        </div>
                                        <div class="item">
                                            <div class="offer-box">
                                                <figure class="offer-box__img">
                                                    <a href="#">
                                                        <img src="img/offer/offer_img_02.jpg" alt="" />
                                                    </a>
                                                </figure>
                                                <p class="offer-box__category">
                                                    <a href="#">Design</a>
                                                </p>
                                                <h3 class="offer-box__title">
                                                    <a href="#">Teacher of UI Design</a>
                                                </h3>
                                                <div class="offer-box__text">
                                                    <p>Phasellus faucibus, vestibulum suscipit, nisi lorem lobortis leo, in ultrices velit lectus eu ante.</p>
                                                </div>
                                                <a class="offer-box__btn" href="#">Read More</a>
                                            </div>
                                        </div>
                                        <div class="item">
                                            <div class="offer-box">
                                                <figure class="offer-box__img">
                                                    <a href="#">
                                                        <img src="img/offer/offer_img_03.jpg" alt="" />
                                                    </a>
                                                </figure>
                                                <p class="offer-box__category">
                                                    <a href="#">Mathematics</a>
                                                </p>
                                                <h3 class="offer-box__title">
                                                    <a href="#">Assistant Professor of Mathematics</a>
                                                </h3>
                                                <div class="offer-box__text">
                                                    <p>Donec aliquet dui lacus, eros elentum quis. Nullam molestie consequat massa nonus.</p>
                                                </div>
                                                <a class="offer-box__btn" href="#">Read More</a>
                                            </div>
                                        </div>

                                        <div class="item">
                                            <div class="offer-box">
                                                <figure class="offer-box__img">
                                                    <a href="#">
                                                        <img src="img/offer/offer_img_04.jpg" alt="" />
                                                    </a>
                                                </figure>
                                                <p class="offer-box__category">
                                                    <a href="#">History</a>
                                                </p>
                                                <h3 class="offer-box__title">
                                                    <a href="#">World History</a>
                                                </h3>
                                                <div class="offer-box__text">
                                                    <p>Aliquam ultrices risus et nunc pharetra sodales. Maecenas nunc dui, dapibus a congue ut, viverra.</p>
                                                </div>
                                                <a class="offer-box__btn" href="#">Read More</a>
                                            </div>
                                        </div>

                                        <div class="item">
                                            <div class="offer-box">
                                                <figure class="offer-box__img">
                                                    <a href="#">
                                                        <img src="img/offer/offer_img_05.jpg" alt="" />
                                                    </a>
                                                </figure>
                                                <p class="offer-box__category">
                                                    <a href="#">Languages</a>
                                                </p>
                                                <h3 class="offer-box__title">
                                                    <a href="#">English Basic</a>
                                                </h3>
                                                <div class="offer-box__text">
                                                    <p>Phasellus faucibus, vestibulum suscipit, nisi lorem lobortis leo, in ultrices velit lectus eu ante.</p>
                                                </div>
                                                <a class="offer-box__btn" href="#">Read More</a>
                                            </div>
                                        </div>

                                        <div class="item">
                                            <div class="offer-box">
                                                <figure class="offer-box__img">
                                                    <a href="#">
                                                        <img src="img/offer/offer_img_06.jpg" alt="" />
                                                    </a>
                                                </figure>
                                                <p class="offer-box__category">
                                                    <a href="#">Biology</a>
                                                </p>
                                                <h3 class="offer-box__title">
                                                    <a href="#">Anatomy Course</a>
                                                </h3>
                                                <div class="offer-box__text">
                                                    <p>Donec aliquet dui lacus, eros elentum quis. Nullam molestie consequat massa nonus.</p>
                                                </div>
                                                <a class="offer-box__btn" href="#">Read More</a>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-box-01 padding-top-93 padding-bottom-70">
                        <div class="container">
                            <div class="row">
                                <div class="col-sm-6 col-md-6 col-lg-6">
                                    <h3 class="title-02 title-02--mr-02">Frequently Asked
                                        <span>Questions</span>
                                    </h3>
                                    <p class="subtitle-02 subtitle-02--mr-01">The Smart Education degree is equal in academic standard to a degree from any other university.</p>
                                    <hr class="hr-01" />
                                    <div class="accordion-01 margin-sm-bottom-70">
                                        <h6 data-count="1" class="accordion-01__title expanded_yes">Why should I join your team?</h6>
                                        <div class="accordion-01__body">
                                            <div class="accordion-01__text">
                                                <p>Donec tortor sapien, pellentesque sed tortor ut, vehicula luctus nibh. Nullam id faucibus risus. Nullam volutpat venenatis libero, sit amet mattis ipsum rutrum in. </p>
                                            </div>
                                        </div>
                                        <h6 data-count="2" class="accordion-01__title expanded_no">What would you gain on your team?</h6>
                                        <div class="accordion-01__body">
                                            <div class="accordion-01__text">
                                                <p>Donec tortor sapien, pellentesque sed tortor ut, vehicula luctus nibh. Nullam id faucibus risus. Nullam volutpat venenatis libero, sit amet mattis ipsum rutrum in. </p>
                                            </div>
                                        </div>
                                        <h6 data-count="3" class="accordion-01__title expanded_no">How can I give support for students?</h6>
                                        <div class="accordion-01__body">
                                            <div class="accordion-01__text">
                                                <p>Donec tortor sapien, pellentesque sed tortor ut, vehicula luctus nibh. Nullam id faucibus risus. Nullam volutpat venenatis libero, sit amet mattis ipsum rutrum in. </p>
                                            </div>
                                        </div>
                                        <h6 data-count="4" class="accordion-01__title expanded_no">How many days I need to work?</h6>
                                        <div class="accordion-01__body">
                                            <div class="accordion-01__text">
                                                <p>Donec tortor sapien, pellentesque sed tortor ut, vehicula luctus nibh. Nullam id faucibus risus. Nullam volutpat venenatis libero, sit amet mattis ipsum rutrum in. </p>
                                            </div>
                                        </div>
                                        <h6 data-count="4" class="accordion-01__title expanded_no"> Where I need to join the team?</h6>
                                        <div class="accordion-01__body">
                                            <div class="accordion-01__text">
                                                <p>Donec tortor sapien, pellentesque sed tortor ut, vehicula luctus nibh. Nullam id faucibus risus. Nullam volutpat venenatis libero, sit amet mattis ipsum rutrum in. </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6 col-md-6 col-lg-6">
                                    <h3 class="title-02 title-02--mr-02">Perks &amp;
                                        <span>Benefits</span>
                                    </h3>
                                    <p class="subtitle-02 subtitle-02--mr-01">The Smart Education degree is equal in academic standard to a degree from any other university.</p>
                                    <hr class="hr-01" />
                                    <div class="tabs offer-tabs">
                                        <ul class="tabs__caption">
                                            <li class="active">Benefits</li>
                                            <li>What we do</li>
                                            <li>guarantees</li>
                                        </ul>
                                        <div class="tabs__content active">
                                            <p>Changing the world is easier when you’re happy, healthy, rested, and fed. To that end, we provide:</p>
                                            <ul class="ul-list-01 offer-list">
                                                <li>Comprehensive medical, dental, and vision coverage</li>
                                                <li>Delicious lunch, dinner, and snacks every day</li>
                                                <li>Open vacation policy - take time off when you need it</li>
                                                <li>Competitive salary and meaningful equity</li>
                                            </ul>
                                        </div>
                                        <div class="tabs__content">
                                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius pariatur quis quasi qui suscipit ducimus quaerat distinctio!</p>
                                            <ul class="ul-list-01 offer-list">
                                                <li>In vitae tortor ac risus placerat amet ultrices felis</li>
                                                <li>Aenean tincidunt est pretium erat ultricies</li>
                                                <li>Vestibulum consectetur ac arcu sed malesuada</li>
                                                <li>Donec euismod, enim non pharetra lacinia, quam odio</li>
                                            </ul>
                                        </div>
                                        <div class="tabs__content">
                                            <p>Nunc dignissim volutpat orci in feugiat. Quisque molestie dignissim luctus. Suspendisse hendrerit interdum tellus sed pharetra.</p>
                                            <ul class="ul-list-01 offer-list">
                                                <li>Morbi scelerisque dolor eget ante dapibus dapibus</li>
                                                <li>Proin interdum est at lectus euismod consequat</li>
                                                <li>Aliquam hendrerit porta lorem, et molestie erat quis</li>
                                                <li>Sed metus tortor, tincidunt vel bibendum eget</li>
                                            </ul>
                                        </div>
                                    </div>
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
                    <div class="content-box-01 padding-top-96 padding-bottom-40">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <h3 class="title-02">Our Professional
                                        <span> Teachers</span>
                                    </h3>
                                    <p class="subtitle-01 subtitle-01--mr-01">Suspendisse sodales arcu velit, non pretium massa accumsan non. Proin accumsan placerat mauris sit amet condimentum. Morbi luctus risus tincidunt urna hendrerit mollis.</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-4 col-md-4 col-lg-4">
                                    <div class="team-block">
                                        <figure class="team-img">
                                            <img src="img/team/team_01.jpg" alt="" />
                                            <ul class="team-soc-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-facebook" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-twitter" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-instagram" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-google-plus" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </figure>
                                        <h3 class="team-title">
                                            <a href="single_team.html">Samuel Williams</a>
                                        </h3>
                                        <p class="team-subtitle">Professor of Mathematics</p>
                                    </div>
                                </div>
                                <div class="col-sm-4 col-md-4 col-lg-4">
                                    <div class="team-block">
                                        <figure class="team-img">
                                            <img src="img/team/team_02.jpg" alt="" />
                                            <ul class="team-soc-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-facebook" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-twitter" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-instagram" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-google-plus" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </figure>
                                        <h3 class="team-title">
                                            <a href="single_team.html">Karren Johnson</a>
                                        </h3>
                                        <p class="team-subtitle">Professor of Biology</p>
                                    </div>
                                </div>
                                <div class="col-sm-4 col-md-4 col-lg-4">
                                    <div class="team-block">
                                        <figure class="team-img">
                                            <img src="img/team/team_03.jpg" alt="" />
                                            <ul class="team-soc-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-facebook" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-twitter" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-instagram" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-google-plus" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </figure>
                                        <h3 class="team-title">
                                            <a href="single_team.html">Marisa Tailor</a>
                                        </h3>
                                        <p class="team-subtitle">Teacher of Geometry</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="reply-form">
                                <h3 class="reply-form__title">Request Joining</h3>
                                <form action="submit" class="reply-form__form">
                                    <div class="reply-form__box-01">
                                        <input class="reply-form__name" type="text" name="login" placeholder="First name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-02">
                                        <input class="reply-form__email" type="text" name="login" placeholder="Last Name *" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-01">
                                        <input class="reply-form__name" type="password" name="login" placeholder="Password *" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-02">
                                        <input class="reply-form__email" type="password" name="login" placeholder="Confirm password *" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-03">
                                        <input class="reply-form__url" type="url" name="login" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-04">
                                        <textarea class="reply-form__message" name="message" cols="30" rows="10" placeholder="Mini biography...optional 'you can add it later'"></textarea>
                                    </div>
                                    <div className='reply-form__box-04'>
                                        <div className="input">
                                            <label className="label1">Upload your CV</label>
                                            <input
                                                type="file"
                                                class="form-control"
                                                accept="application/pdf"
                                                required
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                        </div>
                                    </div>

                                    <div className='reply-form__box-04'>
                                        <div className='check'>
                                            <input
                                                type="checkbox"
                                                checked={agree}
                                                onChange={checkboxHandler}
                                            />
                                            <p className="label1">I agree that I have read and accepted the Payment Plicy, Terms of Use and Privacy Policy.</p>
                                        </div>
                                    </div>
                                    <div class="reply-form__box-05">
                                        <button type="submit" class="btn-01" onClick={handleRequest}>Request</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer></Footer>
            </div>
        </body>
    )
}

export default TeachWithUs