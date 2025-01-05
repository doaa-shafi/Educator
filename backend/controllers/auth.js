// const { OAuth2Client } = require("google-auth-library");
const User = require("../models/users/user");
const jwt = require("jsonwebtoken");
const {signupSchema } = require("../validatationSchemas/user");
const authService = require("../services/auth");
const {REFRESH_TOKEN_SECRET}=require('../config/configVariables')
const {AuthenticationError,AuthorizationError}=require('../helpers/errors')
const validate=require('../helpers/validate')

// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc Login
// @route POST /auth
// @access Public

// const socialLogin = async (req, res, next) => {
//   const { token } = req.body;

//   try {
//     // Verify token using Google's OAuth2Client
//     const ticket = await googleClient.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { email, name } = ticket.getPayload();

//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (!user) {
//       // Create a new user (only for Individual Trainees)
//       user = await User.create({ email, firstName: name, lastName: "", password: "" });
//     }

//     const accessToken = generateAccessToken(user.email, user._id, user.__t);
//     const refreshToken = generateRefreshToken(user.email);

//     res.status(200).json({ accessToken, refreshToken, role: user.__t });
//   } catch (error) {
//     next(new AuthenticationError("Social login failed."));
//   }
// };

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {

    const { accessToken, refreshToken,role } = await authService.login(email,password);

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    res.status(200).json({ accessToken ,refreshToken,role});
  } catch (error) {
    next(error)
  }  
  
};

const signUp = async (req, res, next) => {
  const { firstName ,lastName , email, password, confirm_password } = req.body;
  try {
    validate(signupSchema,{  firstName: firstName,lastName:lastName,email: email,password: password,confirm_password: confirm_password})
    const { accessToken, refreshToken } = await authService.signup(firstName,lastName,email,password);

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      //secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });
    res.status(200).json({ accessToken,refreshToken });
  } catch (error) {
    next(error)
  }  
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res, next) => {
  const cookies = req.cookies;
  try {
    if (!cookies?.jwt) {
      next(new AuthenticationError("Unauthorized"));}

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) next(new AuthenticationError('Invalid refresh token'))
  
        const foundUser = await User.findOne({
          email: decoded.email,
        }).exec();
  
        if (!foundUser) next(new AuthenticationError("Invalid refresh token"));
        
        const accessToken= await authService.refresh(foundUser)
        res.json(accessToken);
      });
  } catch (error) {
    next(error)
  }  
     
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  signUp,
  login,
  refresh,
  logout,
};
