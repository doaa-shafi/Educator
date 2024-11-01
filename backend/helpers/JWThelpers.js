const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET}=require('../config/configVariables')

const generateAccessToken=(email,id,role)=>{
    const accessToken = jwt.sign(
        {
          UserInfo: {
            email: email,
            id: id,
            role: role,
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
    return accessToken
}

const generateRefreshToken=(email)=>{
    const refreshToken = jwt.sign(
        { email: email },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
    return refreshToken
}

module.exports={
    generateAccessToken,
    generateRefreshToken,
}

