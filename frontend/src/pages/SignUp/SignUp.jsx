import React from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import educator from '../../assets/Educator.png';
import google from '../../assets/google.png'
import facebook from '../../assets/facebook.png'
import apple from '../../assets/apple.png'
import axios from 'axios'
import useAuth from '../../hooks/useAuth';
import './SignUp.css'


const SignUp = () => {

  const { setAuth } = useAuth();

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

  const [country, setCountry] = useState("")
  const [agree, setAgree] = useState(false)

  const [error1, setError1] = useState(false)
  const [error2, setError2] = useState("")
  const [page, setPage] = useState(true);


  const passReg = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])[a-zA-Z0-9#?!@$%^&*-]{8,}$')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if ((username.length > 2 && username.length < 21) || username === "") {
      setValidName(true)
    } else {
      setValidName(false)
      setErrorName("Username should contain 3-20 characters")
    }
    setError1(false)
  }, [username])

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
    if (username === "" || email === "") {
      setError1(true)
    }
    if (validName && validEmail && username !== "" && email !== "") {
      setPage(false);
    }
  }


  const handleSignUp = async () => {

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
        const response = await axios.post('/auth/signup',
          JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        console.log(response?.data);
        console.log(response?.accessToken);
        console.log(JSON.stringify(response))
        const accessToken = response?.data?.accessToken;
        const role = response?.data?.role;
        setAuth({ username, password, accessToken,role });

      } catch (err) {
        if (!err?.response) {
          setError2('No Server Response');
        }
        else {
          const error = err.response.data.error
          if (error === "Username is already taken") {
            setErrorName(error)
            setValidName(false)
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
    <div className="container">
      <img className='image' src={educator} alt="Norway"></img>
      <div>
        {page ? <div className="card">
          <div>Step 1 of 2</div>
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
          <div>Sing up with email</div>
          <div>Already have an account? <Link className='l' to='/login'>Sign in</Link></div>
          <div className='inputs'>
            <div className="input">
              <label className="label1">Email</label>
              <input  type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
              {validEmail === false && <div className='error'><p>{errorEmail}</p></div>}
            </div>
            <div className="input">
              <label className="label1">Username</label>
              <input type='text' onChange={(e) => setUsername(e.target.value)} value={username} />
              {validName === false && <div className='error'><p>{errorName}</p></div>}
            </div>
          </div>
          {error1 === true && <div className='error'><p>Please enter all fields</p></div>}
          <button className='contin' onClick={handleContinue}>Continue</button>
        </div>
          :
          <div className="card">
            <div>Step 2 of 2</div>
            <div className='title'>Create an account</div>
            <div>Sing up with email</div>
            <div>Already have an account? <Link className='l' to='/login'>Sign in</Link></div>
            <div className='inputs'>
              <div className="input">
                <label className="label1">Password</label>
                <input  type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
                {validPwd === false && <p>hh</p>}
              </div>
              <div className="input">
                <label className="label1">Confirm Password</label>
                <input  type='password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
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
              <button className='contin' onClick={handleSignUp}>Create</button>
            </div>
          </div>}
      </div>



    </div>

  );

}

export default SignUp