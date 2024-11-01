const User = require("../models/users/user");
const IndividualTrainee=require('../models/users/individualTrainee')
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/JWThelpers");
const {AuthenticationError, ConflictError}=require('../helpers/errors');

class authService{

  async login(email,password){
    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) throw new AuthenticationError("email or password is incorrect");

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match)  throw new AuthenticationError("email or password is incorrect");

    const accessToken = generateAccessToken(
      foundUser.email,
      foundUser._id,
      foundUser.__t,
    );
    const refreshToken = generateRefreshToken(foundUser.email);

    return { accessToken, refreshToken , role:foundUser.__t};
  }

  async signup(firstName,lastName, email, password){
    const foundEmail = await User.findOne({ email }).exec();
    if(foundEmail) throw new ConflictError("Email is already taken");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await IndividualTrainee.create({
      firstName: firstName,
      lastName:lastName,
      email: email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(email, user._id, "IndividualTrainee");

    const refreshToken = generateRefreshToken(email);

    return { accessToken, refreshToken ,role:"IndividualTrainee"};
  }

  async refresh(foundUser){
    return generateAccessToken(foundUser.email,foundUser._id,foundUser.__t);
  }
}

module.exports = new authService()


