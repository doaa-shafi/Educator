const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET}=require('../config/configVariables')

const generateAccessToken=(username,id,role)=>{
    const accessToken = jwt.sign(
        {
          UserInfo: {
            username: username,
            id: id,
            role: role,
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
    return accessToken
}

const generateRefreshToken=(username)=>{
    const refreshToken = jwt.sign(
        { username: username },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
    return refreshToken
}

module.exports={
    generateAccessToken,
    generateRefreshToken,
}

