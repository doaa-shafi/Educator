import React ,{ useState, useEffect }from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import logo from '../../assets/logo_white_2.png'
import google from '../../assets/google.png'
import facebook from '../../assets/facebook.png'
import apple from '../../assets/apple.png'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth';
import './SignUp.css'


const SignUp = () => {

  const { setAuth } = useAuth();
  const navigate=useNavigate()

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

  const [error1, setError1] = useState(false)
  const [error2, setError2] = useState("")
  const [page, setPage] = useState(true);


  const passReg = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])[a-zA-Z0-9#?!@$%^&*-]{8,}$')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if ((firstName.length > 2 && firstName.length < 21) || firstName === "") {
      setValidFirstName(true)
    } else {
      setValidFirstName(false)
      setErrorFirstName("First name should contain 3-20 characters")
    }
    setError1(false)
  }, [firstName])

  useEffect(() => {
    if ((lastName.length > 2 && lastName.length < 21) || lastName === "") {
      setValidLastName(true)
    } else {
      setValidLastName(false)
      setErrorLastName("Last name should contain 3-20 characters")
    }
    setError1(false)
  }, [lastName])

  useEffect(() => {
    setValidEmail(emailRegex.test(email) || email === "");
    if (!validEmail) {
      setErrorEmail("Please enter a valid email")
    }
    setError1(false)
  }, [email])

  useEffect(() => {
    setValidPwd(passReg.test(password) || password === "");
    setValidMatch(password === confirmPassword || confirmPassword === "");
    setError2("")
  }, [password, confirmPassword])

  const checkboxHandler = () => {
    if (!agree && error2 === "Please accept our policy") {
      setError2("");
    }
    setAgree(!agree);

  }

  const handleContinue = async () => {
    if (firstName === "" || lastName==="" || email === "") {
      setError1(true)
    }
    if (validFirstName && validLastName && validEmail && firstName !== "" && lastName !== "" && email !== "") {
      setPage(false);
    }
  }


  const handleSignUp = async (e) => {
    e.preventDefault()

    if (confirmPassword === "" || password === "") {
      setError2("Please enter all fields")
    }

    else if (!validMatch || !validPwd) {
      setError2("Please enter valid inputs")
    }

    else if (!agree) {
      setError2("Please accept our policy")
    }
    else {
      try {
        const response = await axios.post('/auth/signup',{ firstName, lastName, email, password, confirm_password: confirmPassword });
        const accessToken = response?.data?.accessToken;
        const role = response?.data?.role;
        setAuth({ email, password, accessToken, role });
        navigate("/sign-in")
      } catch (err) {
        console.log(err)
        if (!err?.response) {
          setError2('No Server Response');
        }
        else {
          const error = err.response.data.error
          if (error === "Enter a valid first name" || error === "Enter a valid last name") {
            setErrorFirstName(error)
            setValidFirstName(false)
            setPage(true)
          } else if (error === "Email is already taken" || error === "Enter a valid email") {
            setErrorEmail(error)
            setValidEmail(false)
            setPage(true)
          }
        }

      }
    }
  }



  return (
    <div className="login-container">
      <img className='login-logo' src={logo} alt="" />
      <div>
        {page ? <form action='submit' className="login-card">
          <h4>Step 1 of 2</h4>
          <div className='title'>Create an account</div>
          <div className="sign-up-options">
            <div className="sign-up-option">
              <img className='sign-up-logo' src={google} alt="" />
            </div>
            <div className="sign-up-option">
              <img className='sign-up-logo' src={facebook} alt="" />
            </div>
            <div className="sign-up-option">
              <img className='sign-up-logo' src={apple} alt="" />
            </div>
          </div>
          <div className="line">
            <hr />
            <span>Or</span>
            <hr />
          </div>
          <h4>Sing up with email</h4>
          <h5>Already have an account? <Link className='l' to='/sign-in'>Sign in</Link></h5>
          <div className='inputs'>
            <div className="input">
              <label className="label1">First name</label>
              <input type='text' onChange={(e) => setFirstName(e.target.value)} value={firstName} />
              {validFirstName === false && <div className='error'><p>{errorFirstName}</p></div>}
            </div>
            <div className="input">
              <label className="label1">Last name</label>
              <input type='text' onChange={(e) => setLastName(e.target.value)} value={lastName} />
              {validLastName === false && <div className='error'><p>{errorLastName}</p></div>}
            </div>
            <div className="input">
              <label className="label1">Email</label>
              <input type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
              {validEmail === false && <div className='error'><p>{errorEmail}</p></div>}
            </div>
          </div>
          {error1 === true && <div className='error'><p>Please enter all fields</p></div>}
          <button type='submit' className='contin' onClick={handleContinue}>Continue</button>
        </form>
          :
          <form action='submit' className="login-card">
            <h4>Step 2 of 2</h4>
            <div className='title'>Create an account</div>
            <h4>Sing up with email</h4>
            <h5>Already have an account? <Link className='l' to='/login'>Sign in</Link></h5>
            <div className='inputs'>
              <div className="input">
                <label className="label1">Password</label>
                <input type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
                {validPwd === false && <p>hh</p>}
              </div>
              <div className="input">
                <label className="label1">Confirm Password</label>
                <input type='password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                {validMatch === false && <p>jj</p>}
              </div>

              <div className='check'>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={checkboxHandler}
                />
                <p className="label1">I agree that I have read and accepted the Terms of Use and Privacy Policy.</p>
              </div>
              {error2 !== "" && <p>{error2}</p>}
            </div>
            <div className='buttons'>
              <button className='back' onClick={() => { setPage(true) }}>Back</button>
              <button type='submit' className='contin' onClick={handleSignUp}>Create</button>
            </div>
          </form>}
      </div>



    </div>

  );

}

export default SignUp