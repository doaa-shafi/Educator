import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import educator from '../../assets/Educator.png'
import google from '../../assets/google.png'
import facebook from '../../assets/facebook.png'
import apple from '../../assets/apple.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const Login = () => {

  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)


  const handleLogin = async () => {

    if (username === "" || password === "") {
      setError("Please enter all fields")
    }

    else {

      try {
        const response = await axios.post('/auth/',
          JSON.stringify({ username, password }),
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        

        const accessToken = response?.data?.accessToken;
        const role = response?.data?.role;
        setAuth({ username: username, password: password, accessToken: accessToken, role: role });
        console.log(auth)
        if (role === 'ITrainee') {
          console.log('lllllllllll')
          navigate('/ITrainee-dashboard-enrollments')
        } else if (role === 'CTrainee') {

        } else if (role === 'instructor') {
          navigate('/instructor-dashboard/draft-courses')
        } else if (role === 'admin') {

        } else if (role === 'corporate') {
          console.log("here")
          navigate('/corporate-dashboard')

        }
      } catch (err) {
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
    <div className="container">
      <img className='image' src={educator} alt="Norway"></img>
      <div className="card">
        <div className='title'>Sign in</div>
        <div className='signup'>New user? <Link className='l' to='/sign-up'>Create an account</Link></div>
        <div className='inputs>'>
          <div className="input">
            <label className="label1">Username</label>
            <input type='Text' onChange={(e) => setUsername(e.target.value)} value={username} />
          </div>
          <div className="input">
            <label className="label1">Password</label>
            <input type='password' onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>
          {error != null ? <div className="error">
            <p>{error}</p>
          </div> : <div />}
        </div>
        <button className='contin' onClick={handleLogin}>Sign in</button>
        <div className='line'>
          <hr />
          <span>Or</span>
          <hr />
        </div>
        <div className="options">
          <div className="option">
            <img className="logo" src={google} alt="" />
            <span>Continue with Google</span>
          </div>
          <div className="option">
            <img className="logo" src={facebook} alt="" />
            <span>Continue with Facebook</span>
          </div>
          <div className="option">
            <img className="logo" src={apple} alt="" />
            <span>Continue with Apple</span>
          </div>
        </div>

      </div>
    </div>

  );

}

export default Login