const User = require("../models/users/user");
const IndividualTrainee=require('../models/users/individualTrainee')
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/JWThelpers");
const {AuthenticationError, ConflictError}=require('../helpers/errors');

class authService{

  async login(username,password){
    const foundUser = await User.findOne({ username }).exec();

    if (!foundUser) throw new AuthenticationError("username or password is incorrect");

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match)  throw new AuthenticationError("username or password is incorrect");

    const accessToken = generateAccessToken(
      foundUser.username,
      foundUser._id,
      foundUser.role
    );

    const refreshToken = generateRefreshToken(foundUser.username);

    return { accessToken, refreshToken , role:foundUser.role};
  }

  async signup(username, email, password){
    const foundUsername = await User.findOne({ username }).exec();
    const foundEmail = await User.findOne({ email }).exec();
    
    if(foundUsername) throw new ConflictError("Username is already taken");
    
    if(foundEmail) throw new ConflictError("Email is already taken");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await IndividualTrainee.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: "ITrainee",
    });

    const accessToken = generateAccessToken(username, user._id, "ITrainee");

    const refreshToken = generateRefreshToken(username);

    return { accessToken, refreshToken ,role:foundUser.role};
  }

  async refresh(foundUser){
    return generateAccessToken(foundUser.username,foundUser._id,foundUser.role);
  }
}

module.exports = new authService()


