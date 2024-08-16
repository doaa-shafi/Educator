import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from "react";
import './TeachWithUs.css'
import Navbar from '../../components/Navbar/Navbar'
import teachTitle from '../../assets/teachTitle.png'
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

const TeachWithUs = () => {

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

    if (username === "" || email === "" || file === "" || confirmPassword === "" || password === "") {
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
        const response = await axios.post('/instructors/request',
          JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        const instructor = response?.data;

        const formData = new FormData();
        
        formData.append("file", file);
        

        const result = await axios.post("upload-cv",
          formData
        );
        console.log(result);
        if (result.data.status == "ok") {
          alert("Uploaded Successfully!!!");
        }



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
      <div className='teach-header'>
        <div className='teachTitle'>
          <span className='teachTitle1'>Come Teach with us</span>
          <span className='teachTitle2'>Become an instructor and share your knowledge </span>
        </div>
        <img src={teachTitle} alt="" />
      </div>

      <div className='why'>
        <span className='teachTitle1'>Why to teach with us</span>
        <div className='why-elements'>
          <div className='why-element'>
            <PublicOutlinedIcon></PublicOutlinedIcon>
            <span className='teachTitle2'>Reach a Global Audience</span>
            <div className='teachTitle3'>Educator connects you with students worldwide, allowing you to share your expertise with a diverse audience. Expand your impact beyond geographical boundaries and reach learners eager to benefit from your knowledge.</div>
          </div>
          <div className='why-element'>
            <DateRangeOutlinedIcon></DateRangeOutlinedIcon>
            <span className='teachTitle2'>Flexible Teaching Schedule</span>
            <div className='teachTitle3'>Educator offers complete control over your teaching schedule. Create and upload courses at your convenience, allowing you to balance teaching with other commitments. Teach at your own pace and set your own hours.</div>
          </div>
          <div className='why-element'>
            <CurrencyExchangeOutlinedIcon></CurrencyExchangeOutlinedIcon>
            <span className='teachTitle2'>Earn Extra Income</span>
            <div className='teachTitle3'>Educator enables you to monetize your expertise by creating and selling courses. Earn money based on enrollments and course completions, making it a rewarding way to share your knowledge while earning extra income.</div>
          </div>
        </div>
      </div>
      <div className='paymentPolicy'>
        <span className='teachTitle1'>Our Payment Policy</span>
        <span className='teachTitle2'> You will get 90% from each enrollment and we will take the remaining 10%</span>
      </div>
      <div className='how'>
        <span>Plan your curriculum</span>
        <p>Prepare a pdf that contains your national id and your cv before joining </p>
      </div>
      <div className="card2">
        <div>Request to join</div>
        <div>Already have an account? <Link className='l' to='/login'>Sign in</Link></div>
        <div className='inputs'>
          <div className="input">
            <label className="label1">Username</label>
            <input className="in" type='text' onChange={(e) => setUsername(e.target.value)} value={username} />
            {validName === false && <p>{errorName}</p>}
          </div>
          <div className="input">
            <label className="label1">email</label>
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
            <label className="label1">Upload your CV</label>
            <input
              type="file"
              class="form-control"
              accept="application/pdf"
              required
              onChange={(e) => setFile(e.target.files[0])}
            />
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

export default TeachWithUs