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

import { auth, googleProvider, facebookProvider } from "./firebase-config";
import { signInWithPopup } from "firebase/auth";

const Login = () => {

  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)


  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setError("Please enter all fields");
    } else {
      try {
        const response = await axios.post(
          "/auth/",
          JSON.stringify({ email, password }),
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const { accessToken, role } = response.data;
        setAuth({ email, password, accessToken, role });
        navigateBasedOnRole(role);
      } catch (err) {
        setError(err.response?.data?.error || "Login failed. Please try again.");
      }
    }
  };

  // Handle social sign-in
  const handleSocialSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      // Send token to the backend for authentication
      const response = await axios.post(
        "/auth/social-login",
        { token },
        { headers: { "Content-Type": "application/json" } }
      );

      const { accessToken, role } = response.data;
      setAuth({ email: result.user.email, accessToken, role });
      navigateBasedOnRole(role);
    } catch (err) {
      setError("Social sign-in failed. Please try again.");
    }
  };

  const navigateBasedOnRole = (role) => {
    if (role === "IndividualTrainee") navigate("/ITrainee-dashboard-enrollments");
    else if (role === "Corporate") navigate("/corporate-dashboard/trainees");
    else if (role === "Instructor") navigate("/instructor-dashboard/draft-courses");
    else if (role === "Admin") navigate("/admin-dashboard");
  };


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
          <div className="option" onClick={() => handleSocialSignIn(googleProvider)}>
            <img className="auth-logo" src={google} alt="" />
            <span>Continue with Google</span>
          </div>
          <div className="option" onClick={() => handleSocialSignIn(facebookProvider)}>
            <img className="auth-logo" src={facebook} alt="" />
            <span>Continue with Facebook</span>
          </div>
          {/* <div className="option" onClick={() => handleSocialSignIn("apple")}>
            <img className="auth-logo" src={apple} alt="" />
            <span>Continue with Apple</span>
          </div> */}
        </div>

      </form>
    </div>

  );

}

export default Login