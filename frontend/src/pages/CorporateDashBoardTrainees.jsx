import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CorporateDashBoardTrainees = () => {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const handleRowClick = (trianeeId) => {
        navigate(`/corporate-dashboard/trainees/${trianeeId}`);
    };
    const [corporate, setCorporate] = useState()
    const [trainees, setTrainees] = useState([])
    const [totalEnrollments, setTotalEnrollments] = useState(0)
    const [totalCompletedHours, setTotalCompletedHours] = useState(0)
    const [averageCompletedHoursPerDay, setAverageCompletedHoursPerDay] = useState(0)
    const [traineeAdded, setTraineeAdded] = useState(false)
    const [show, setShow] = useState()

    const [firstName, setFirstname] = useState("")
    const [validFirstname, setValidFirstname] = useState(true)
    const [errorFirstname, setErrorFirstname] = useState(true)

    const [lastName, setLastName] = useState("")
    const [validLastName, setValidLastName] = useState(true)
    const [errorLastName, setErrorLastName] = useState(true)

    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(true)
    const [errorEmail, setErrorEmail] = useState(true)

    const [password, setPassword] = useState("")
    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const [confirmPassword, setConfirmPassword] = useState("")
    const [validMatch, setValidMatch] = useState(true)


    const [error, setError] = useState("")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateFirstName = () => {
        if ((firstName.length > 2 && firstName.length < 21) || firstName === "") {
            setValidFirstname(true)
        } else {
            setValidFirstname(false)
            setErrorFirstname("Username should contain 3-20 characters")
        }
        setError(false)
    }

    const validateLastName = () => {
        if ((lastName.length > 2 && lastName.length < 21) || lastName === "") {
            setValidLastName(true)
        } else {
            setValidLastName(false)
            setErrorLastName("Username should contain 3-20 characters")
        }
        setError(false)
    }

    const validateEmail = () => {
        setValidEmail(emailRegex.test(email) || email === "");
        if (!validEmail) {
            setErrorEmail("Please enter a valid email")
        }
        setError(false)
    }

    const validatePassword = (password) => {
        setPasswordCriteria({
            minLength: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[#?!@$%^&*-]/.test(password),
        });
    };

    const validateConfirmPassword = () => {
        setValidMatch(password === confirmPassword || confirmPassword === "");
        setError("")
    }


    useEffect(() => {
        const getCorporate = async () => {
            try {
                const res = await axiosPrivate.get(`/corporates/trainees`);
                setCorporate(res.data.corporate);
                setTrainees(res.data.trainees)
                console.log(res.data.trainees)
                // Calculate total enrollments
                let totalEnrollments = res.data.trainees.reduce((total, trainee) => total + trainee.enrollmentCount, 0);
                setTotalEnrollments(totalEnrollments);
                let totalCompletedHours = res.data.trainees.reduce((total, trainee) => total + trainee.totalCompletedDuration, 0);
                setTotalCompletedHours(totalCompletedHours);
                let averageCompletedHoursPerDay = res.data.trainees.reduce((total, trainee) => total + trainee.averageCompletedHoursPerDay, 0);
                setAverageCompletedHoursPerDay(averageCompletedHoursPerDay);
            } catch (error) {
                console.error(error);
            }
        };
        getCorporate();
    }, [traineeAdded]);

    const handleAdd = async (e) => {
        e.preventDefault()
        if (firstName === "" || lastName === "" || email === "" || confirmPassword === "" || password === "") {
            setError("Please enter all fields")
        }

        else if (!validMatch || !passwordCriteria.minLength || !passwordCriteria.lowercase || !passwordCriteria.uppercase
            || !passwordCriteria.number || !passwordCriteria.specialChar || !validFirstname || !validLastName || !validEmail) {
            setError("Please enter valid inputs")
        }

        else {
            try {
                const response = await axiosPrivate.post('/corporateTrainees/', { firstName, lastName, email, password, confirm_password: confirmPassword })
                setShow(false)
                setTraineeAdded(!traineeAdded)
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
                    <form action="submit">
                        <div className="input">
                            <label className="label1">Trainee first name</label>
                            <input onBlur={() => validateFirstName()} type='text' onChange={(e) => setFirstname(e.target.value)} value={firstName} />
                            {validFirstname === false && <h6 style={{ color: 'red' }}>{errorFirstname}</h6>}
                        </div>
                        <div className="input">
                            <label className="label1">Trainee last name</label>
                            <input onBlur={() => validateLastName()} type='text' onChange={(e) => setLastName(e.target.value)} value={lastName} />
                            {validLastName === false && <h6 style={{ color: 'red' }}>{errorLastName}</h6>}
                        </div>
                        <div className="input">
                            <label className="label1">Trainee email</label>
                            <input onBlur={() => validateEmail()} type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                            {validEmail === false && <h6 style={{ color: 'red' }}>{errorEmail}</h6>}
                        </div>
                        <div className="input">
                            <label className="label1">Temporary password</label>
                            <input type='password' onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }} value={password} />
                            <div>
                                <h6 style={{ color: passwordCriteria.minLength ? 'green' : 'red' }}>
                                    Password must be at least 8 characters
                                </h6>
                                <h6 style={{ color: passwordCriteria.uppercase ? 'green' : 'red' }}>
                                    Password must contain at least one uppercase letter
                                </h6>
                                <h6 style={{ color: passwordCriteria.lowercase ? 'green' : 'red' }}>
                                    Password must contain at least one lowercase letter
                                </h6>
                                <h6 style={{ color: passwordCriteria.number ? 'green' : 'red' }}>
                                    Password must contain at least one number
                                </h6>
                                <h6 style={{ color: passwordCriteria.specialChar ? 'green' : 'red' }}>
                                    Password must contain at least one special character (#?!@$%^&*-)
                                </h6>
                            </div>
                        </div>
                        <div className="input">
                            <label className="label1">Confirm tomprary password</label>
                            <input onBlur={() => validateConfirmPassword} type='password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                            {validMatch === false && <h6 style={{ color: 'red' }}>Different from password</h6>}
                        </div>
                        {error !== "" && <p>{error}</p>}
                        <button type="submit" class="btn-05" onClick={handleAdd}>Add</button>
                    </form>
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
                                        <li class="active">
                                            <Link to={'/corporate-dashboard/trainees'}>Trainees</Link>
                                        </li>
                                        <li>
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
                                                <Link to={'/corporate-dashboard/trainees'}>Trainees</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>

                                    }
                                    {!isDivVisible && toggleList &&
                                        <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                            <li>
                                                <Link to={'/corporate-dashboard/courses'}>Courses Registry</Link>
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
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div class="dashboard-card">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Trainees</h5>
                                        <h4 class="mb-3" data-plugin="counterup">{trainees.length}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div class="dashboard-card">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Enrollments</h5>
                                        <h4 class="mb-3"><span data-plugin="counterup">{totalEnrollments}</span></h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div class="dashboard-card">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Total completed hours</h5>
                                        <h4 class="mb-3"><span data-plugin="counterup">{totalCompletedHours}</span></h4>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div class="dashboard-card">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">avarage completed Hours / day</h5>
                                        <h4 class="mb-3" data-plugin="counterup">{averageCompletedHoursPerDay / trainees?.length}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='button-row'>
                        <button class="btn-04" onClick={() => setShow(true)}>Add New Trainee</button>
                    </div>
                    <div class="container">
                        <div class="row dashboard-row margin-bottom-97">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title overflow-hidden">Trainees</h4>
                                    <div className="table-responsive">
                                        <table className="table table-centered table-hover table-xl mb-0" id="recent-orders">
                                            <thead>
                                                <tr>
                                                    <th><h4>Name</h4></th>
                                                    <th ><h4>Email</h4></th>
                                                    <th ><h4>Assigned Courses</h4></th>
                                                    <th ><h4>Average Completed Hours / Day</h4></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {trainees.map((trainee, index) => {
                                                    return (
                                                        <tr
                                                            key={index}
                                                            onClick={() => handleRowClick(trainee._id)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <td><h5>{trainee.firstName} {trainee.lastName}</h5></td>
                                                            <td className="text-truncate"><h5>{trainee.email}</h5></td>
                                                            <td className="text-truncate"><h5>{trainee.enrollmentCount}</h5></td>
                                                            <td className="text-truncate"><h5>{trainee.averageCompletedHoursPerDay}</h5></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        {trainees?.length === 0 && <div className='no-data'>There is no teams</div>}
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

export default CorporateDashBoardTrainees