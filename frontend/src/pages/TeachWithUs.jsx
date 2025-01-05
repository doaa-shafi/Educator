import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import useAuth from '../hooks/useAuth'
import axios from '../api/axios'
import Footer from '../components/Footer'
import logo from '../assets/logo_dark.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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
    const [expandedQ, setExpandedQ] = useState(0);

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
                    {!isDivVisible &&
                        <ul ref={navListRef} className={`main-nav__list_2 ${toggleList ? 'active' : ''}`}>
                            <li onClick={handleIconClick}><CloseIcon /></li>
                            <li>
                                <Link style={{ color: "#4da7cc" }} to={"/"}>For Individuals</Link>
                            </li>

                            <li>
                                <Link style={{ color: "#4da7cc" }} to={"/for-buisness"}>Try Educator for buisness</Link>
                            </li>
                            <hr className='menu-hr' />
                            <li >
                                <Link style={{ color: "#4da7cc" }} to={"/"}>Home</Link>
                            </li>

                            <li>
                                <Link style={{ color: "#4da7cc" }} to={"/courses"}>Courses</Link>

                            </li>
                            {auth?.accessToken ?
                                <li>
                                    <Link style={{ color: "#4da7cc" }} to={auth.role === "IndividualTrainee" ? "/ITrainee-dashboard-enrollments" : ""}>Dashboard</Link>
                                </li>
                                :
                                <>
                                    <li>
                                        <Link style={{ color: "#4da7cc" }} to={"/sign-in"}>Sign in</Link>
                                    </li>
                                    <li>
                                        <Link style={{ color: "#4da7cc" }} to={"/sign-up"}>Sign up</Link>
                                    </li>
                                </>
                            }
                        </ul>
                    }
                </header>
                <main class="content-row">
                    <div class="content-box-02  margin-top-20">
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
                    <div class="content-box-01 padding-top-93 padding-bottom-63">
                        <div class="container">
                            <div class="row padding-bottom-15">
                                <div class="col-lg-12 text-center">
                                    <h3 class="title-02">What we
                                        <span> Offer</span>
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
                                                    Earn More with Every Enrollment
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p>Get 70% of the course price for every student enrollment.
                                                    With no limits on the number of students, the earning potential is in your hands.</p>
                                            </div>
                                        </div>
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>2</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Reach a Global Audience
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p>Publish your courses to a diverse, global community of learners.
                                                    Share your expertise and inspire students from around the world.</p>
                                            </div>
                                        </div>
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>3</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Easy-to-Use Course Builder
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p>Create and manage courses effortlessly with our intuitive platform.
                                                    Upload video lessons, assignments, quizzes, and other resources with just a few clicks.</p>
                                            </div>
                                        </div>
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>4</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Dedicated Marketing Support
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p>We promote your courses through our marketing channels, ensuring maximum visibility.
                                                    Focus on teaching while we help bring students to you.</p>
                                            </div>
                                        </div>
                                        <div class="news-info__post">
                                            <div class="news-info__date-block">
                                                <p>5</p>
                                            </div>
                                            <h4 class="news-info__title">
                                                <Link href="single_event.html">
                                                    Flexible Teaching, Unlimited Freedom
                                                </Link>
                                            </h4>
                                            <div class="news-info__text">
                                                <p> Work on your schedule.
                                                    Teach what you love and grow your brand as an expert in your field.</p>
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
                                <div class="col-lg-12">
                                    <h3 class="title-02 title-02--mr-02">Frequently Asked
                                        <span> Questions</span>
                                    </h3>
                                    <hr class="hr-01" />
                                    <div class="accordion-01 margin-sm-bottom-70">
                                        <div className='flex-row-04'>
                                            {expandedQ == 1 ? <ExpandLessIcon onClick={() => setExpandedQ(0)} /> : <ExpandMoreIcon className='icon-01' onClick={() => setExpandedQ(1)} />}
                                            <h6 data-count="1" className={`accordion-01__title ${expandedQ == 1 ? 'expanded_yes' : 'expanded_no'}`}>Why should I join Educator?</h6>
                                        </div>
                                        <div className={`accordion-01__body ${expandedQ == 1 ? 'expanded_yes' : 'expanded_no'}`}>
                                            <div class="accordion-01__text">
                                                <p>Educator provides a platform to share your knowledge with a global audience, allowing you to teach your passion while earning 70% of the revenue from each enrollment. We handle the marketing and technical aspects so you can focus on creating impactful courses.</p>
                                            </div>
                                        </div>
                                        <div className="flex-row-04">
                                            {expandedQ == 2 ? <ExpandLessIcon onClick={() => setExpandedQ(0)} /> : <ExpandMoreIcon className='icon-01' onClick={() => setExpandedQ(2)} />}
                                            <h6 data-count="2" className={`accordion-01__title ${expandedQ == 2 ? 'expanded_yes' : 'expanded_no'}`}> How can I gain profit?</h6>
                                        </div>
                                        <div className={`accordion-01__body ${expandedQ == 2 ? 'expanded_yes' : 'expanded_no'}`}>
                                            <div class="accordion-01__text">
                                                <p>As an instructor, you earn 70% of the course price for each enrollment. The more students join your course, the more you earn. Additionally, our platform’s extensive marketing ensures your courses reach the right audience to maximize your profits.</p>
                                            </div>
                                        </div>
                                        <div className="flex-row-04">
                                            {expandedQ == 3 ? <ExpandLessIcon onClick={() => setExpandedQ(0)} /> : <ExpandMoreIcon className='icon-01' onClick={() => setExpandedQ(3)} />}
                                            <h6 data-count="3" className={`accordion-01__title ${expandedQ == 3 ? 'expanded_yes' : 'expanded_no'}`}> How can I give support for students?</h6>
                                        </div>
                                        <div className={`accordion-01__body ${expandedQ == 3 ? 'expanded_yes' : 'expanded_no'}`}>
                                            <div class="accordion-01__text">
                                                <p>Educator allows you to interact directly with your students through discussion boards, Q&A sessions, and feedback on assignments. You can also update your course content regularly to address common queries and provide additional resources.</p>
                                            </div>
                                        </div>
                                        <div className="flex-row-04">
                                            {expandedQ == 4 ? <ExpandLessIcon onClick={() => setExpandedQ(0)} /> : <ExpandMoreIcon className='icon-01' onClick={() => setExpandedQ(4)} />}
                                            <h6 data-count="4" className={`accordion-01__title ${expandedQ == 4 ? 'expanded_yes' : 'expanded_no'}`}> What are the steps to join Educator?</h6>
                                        </div>
                                        <div className={`accordion-01__body ${expandedQ == 4 ? 'expanded_yes' : 'expanded_no'}`}>
                                            <div class="accordion-01__text">
                                                <p>Joining Educator is simple:
                                                    <ol>
                                                        <li>Create an instructor account by signing up on our platform.</li>
                                                        <li>Design and upload your course using our easy-to-use course builder.</li>
                                                        <li>Submit your course for review to ensure it meets our quality standards.</li>
                                                        <li>Once approved, your course goes live, and students can start enrolling!</li>
                                                    </ol>
                                                    Start sharing your knowledge and earning today!
                                                </p>
                                            </div>
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
                    <div class="content-box-01 padding-top-96 padding-bottom-40">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12 text-center">
                                    <h3 class="title-02">Our Professional
                                        <span> Teachers</span>
                                    </h3>
                                    <p class="subtitle-01 subtitle-01--mr-01">Read what some of our profissional teachers say about working with us.</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-4 col-md-4 col-lg-4">
                                    <div class="team-block">
                                        <figure class="team-img">
                                            <img src="img/team/team_01.jpg" alt="" />
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
                                <h3 class="title-02"><span>Request Joining</span></h3>
                                <form action="submit" class="reply-form__form">
                                    <div class="reply-form__box-01">
                                        <input class="reply-form__name" type="text" name="login" placeholder="First name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-02">
                                        <input class="reply-form__name" type="text" name="login" placeholder="Last Name *" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-01">
                                        <input class="reply-form__name" type="password" name="login" placeholder="Password *" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-02">
                                        <input class="reply-form__name" type="password" name="login" placeholder="Confirm password *" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                    <div class="reply-form__box-03">
                                        <input class="reply-form__name" type="url" name="login" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} />
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