const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET}=require('../config/configVariables')
const {AuthenticationError}=require('../helpers/errors')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        next (new AuthenticationError('Invalid access token'))
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) next (new AuthenticationError('Invalid or expired access token'))
            req.user = decoded.UserInfo.username
            req.id = decoded.UserInfo.id
            req.role = decoded.UserInfo.role
            next()
        }
    )
}

module.exports = verifyJWT 