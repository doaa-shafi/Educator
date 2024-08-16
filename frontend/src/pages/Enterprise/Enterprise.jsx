import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from "react";
import './Enterprise.css'
import Navbar from '../../components/Navbar/Navbar'
import employee from '../../assets/employee.png'
import CheckIcon from '@mui/icons-material/Check';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

const Enterprise = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [validName, setValidName] = useState(true)
    const [errorName, setErrorName] = useState(true)

    const [email, setEmail] = useState("")
    const [validEmail, setValidEmail] = useState(true)
    const [errorEmail, setErrorEmail] = useState(true)

    const [team_size, setTeam_size] = useState("")
    const [validSize, setValidSize] = useState(true)
    const [errorSize, setErrorSize] = useState(true)

    const [plan, setPlan] = useState("")


    const [password, setPassword] = useState("")
    const [validPwd, setValidPwd] = useState(true)

    const [confirmPassword, setConfirmPassword] = useState("")
    const [validMatch, setValidMatch] = useState(true)

    const [file, setFile] = useState("")
    const [country, setCountry] = useState("")
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
    const handleRequest = async () => {

        if (username === "" || email === "" || team_size === "" || plan === "" || confirmPassword === "" || password === "") {
            setError("Please enter all fields")
        }

        else if (!validMatch || !validPwd || !validName || !validEmail || !validSize) {
            setError("Please enter valid inputs")
        }

        else if (!agree) {
            setError("Please accept our policy")
        }
        else {
            try {
                const response = await axios.post('/corporates/',
                    JSON.stringify({ username, email, password, confirm_password: confirmPassword, team_size, plan }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );

                navigate('/login')

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

    return (
        <div className="container">
            <Navbar></Navbar>
            <div className='enterprise-header'>
                <div className='enterpriseTitle'>
                    <span className='enterpriseTitle1'>Empower Your Workforce with Educator</span>
                    <div className='enterpriseTitle2'>
                        <div className='enterpriseTitle2-section'>
                            <CheckIcon className='check-icon'></CheckIcon>
                            <span > Unlock Potential with Trusted Content designed by industry experts.</span>
                        </div>
                        <div className='enterpriseTitle2-section'>
                            <CheckIcon className='check-icon'></CheckIcon>
                            <span>Continuous learning opportunities.</span>
                        </div>
                        <div className='enterpriseTitle2-section'>
                            <CheckIcon className='check-icon'></CheckIcon>
                            <span>Optimize Training Investments</span>
                        </div>
                        <div className='enterpriseTitle2-section'>
                            <CheckIcon className='check-icon'></CheckIcon>
                            <span>Track and measure skills to demonstrate ROI</span>
                        </div>
                    </div>
                </div>
                <img className='enterprise-image' src={employee} alt="" />
            </div>
            <div className="plans-container">
                <h1 className="plans-title">Choose Your Corporate Plan</h1>
                <div className="plans">
                    <div className="plan-card standard">
                        <h2 className="plan-type">Standard Plan</h2>
                        <div className="plan-price">$199/month</div>
                        <div className="plan-details">
                            <span>Features</span>
                            <p><span>Course Access:</span> Beginner & Intermediate</p>
                            <p><span>No Access:</span> Advanced Courses</p>
                            <p><span>Seats:</span> Limited number of seats per corporate account</p>
                            <p><span>Team Structure:</span> Single team with assigned courses</p>
                            <p><span>Support & Analytics:</span> Basic tracking and email support</p>
                        </div>
                    </div>

                    <div className="plan-card premium">
                        <h2 className="plan-type">Premium Plan</h2>
                        <div className="plan-price">$499/month</div>
                        <div className="plan-details">
                            <span>Features</span>
                            <p><span>Course Access:</span> Beginner, Intermediate & Advanced</p>
                            <p><span>Seats:</span> Unlimited, flexible allocation across teams</p>
                            <p><span>Team Structure:</span> Multiple teams with shared courses</p>
                            <p><span>Flexible Membership:</span> Employees can be in multiple teams</p>
                            <p><span>Support & Analytics:</span> Advanced tracking, priority support</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card3">
                <div>Register your company</div>
                <div>Already have an account? <Link className='l' to='/login'>Sign in</Link></div>
                <div className='inputs'>
                    <div className="input">
                        <label className="label1">Company name</label>
                        <input className="in" type='text' onChange={(e) => setUsername(e.target.value)} value={username} />
                        {validName === false && <p>{errorName}</p>}
                    </div>
                    <div className="input">
                        <label className="label1">Company email</label>
                        <input className="in" type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
                        {validEmail === false && <p>{errorEmail}</p>}
                    </div>
                    <div className="input">
                        <label className="label1">Password</label>
                        <input className="in" type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
                        {validPwd === false && <p>hh</p>}
                    </div>
                    <div className="input">
                        <label className="label1">Confirm Password</label>
                        <input className="in" type='password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                        {validMatch === false && <p>jj</p>}
                    </div>
                    <div className="input">
                        <label className="label1">Team size</label>
                        <input type="number" onChange={(e) => setTeam_size(e.target.value)} />
                    </div>
                    <div className="input">
                        <label className="label1">Choose Plan</label>
                        <div className='plans-buttons'>
                            <button onClick={() => setPlan("Standard")}>Standard</button>
                            <button onClick={() => setPlan("Premium")}>Premium</button>
                        </div>
                    </div>


                    <div className='check'>
                        <input
                            type="checkbox"
                            checked={agree}
                            onChange={checkboxHandler}
                        />
                        <p className="label1">I agree that I have read and accepted the Payment Plicy, Terms of Use and Privacy Policy.</p>
                    </div>
                    {error !== "" && <p>{error}</p>}
                </div>
                <div className='buttons'>
                    <button className='contin' onClick={handleRequest}>Send Request</button>
                </div>
            </div>

        </div>

    )
}

export default Enterprise