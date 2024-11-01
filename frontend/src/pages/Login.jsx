import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_white_2.png'
import logo_dark from '../assets/logo_dark.png'
import google from '../assets/google.png'
import facebook from '../assets/facebook.png'
import apple from '../assets/apple.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const Login = () => {

  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)


  const handleLogin = async (e) => {
    e.preventDefault()

    if (email === "" || password === "") {
      setError("Please enter all fields")
    }

    else {

      try {
        const response = await axios.post('/auth/',
          JSON.stringify({ email, password }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        console.log(response.data)
        

        const accessToken = response?.data?.accessToken;
        const role = response?.data?.role;
        setAuth({ email: email, password: password, accessToken: accessToken, role: role });
        console.log(auth)
        if (role === 'IndividualTrainee') {
          navigate('/ITrainee-dashboard-enrollments')
        } else if (role === 'CTrainee') {

        } else if (role === 'Instructor') {
          navigate('/instructor-dashboard/draft-courses')
        } else if (role === 'admin') {

        } else if (role === 'Corporate') {
          console.log("here")
          navigate('/corporate-dashboard/trainees')

        }
      } catch (err) {
        console.log(err)
        if (!err?.response) {
          setError('No Server Response');
        }
        else {
          setError(err.response.data.error)
        }

      }

    }
  }



  return (
    <div className="login-container">
      <img className='login-logo' src={logo} alt="" />
      <form action="submit" className="login-card">
        <div className="login-logo-dark">
        <img src={logo_dark} />
        </div>
        <div className='title'>Sign in</div>
        <h4>New user? <Link className='l' to='/sign-up'>Create an account</Link></h4>
        <div className='inputs>'>
          <div className="input">
            <label className="label1">Email</label>
            <input type='email' onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <div className="input">
            <label className="label1">Password</label>
            <input type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>
          {error != null ? <div className="error">
            <p>{error}</p>
          </div> : <div />}
        </div>
        <button className='contin'type="submit" onClick={handleLogin}>Sign in</button>
        <div className='line'>
          <hr />
          <span>Or</span>
          <hr />
        </div>
        <div className="options">
          <div className="option">
            <img className="auth-logo" src={google} alt="" />
            <span>Continue with Google</span>
          </div>
          <div className="option">
            <img className="auth-logo" src={facebook} alt="" />
            <span>Continue with Facebook</span>
          </div>
          <div className="option">
            <img className="auth-logo" src={apple} alt="" />
            <span>Continue with Apple</span>
          </div>
        </div>

      </form>
    </div>

  );

}

export default Login