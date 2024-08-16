require('dotenv').config()

const config= {
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET,
    YOUTUBE_API_KEY:process.env.youtube_api_key,
    EMAIL:process.env.EMAIL,
    PASSWORD:process.env.PASSWORD
}
module.exports=config