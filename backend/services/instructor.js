const Instructor = require("../models/users/instructor");
const User=require("../models/users/user")
const bcrypt = require("bcrypt");
const { ConflictError}=require('../helpers/errors');
const {sendInstructorRequestEmail,sendAcceptInstructorEmail,sendRejectInstructorEmail}=require("../helpers/mailHelpers/mailUtils/sendMail")
class instructorService {

  async requestSignUp(username, email, password) {
    const foundUsername = await User.findOne({ username }).exec();
    const foundEmail = await User.findOne({ email }).exec();
    
    if(foundUsername) throw new ConflictError("Username is already taken");
    
    if(foundEmail) throw new ConflictError("Email is already taken");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    sendInstructorRequestEmail(email)
    
    return await Instructor.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: "instructor",
      status:"pending"
    });
  }

  async acceptInstructor(id) {
    const instructor=await Instructor.findById(id)
    sendAcceptInstructorEmail(instructor.email)
    return await Instructor.findByIdAndUpdate(
      id,
      { status: "accepted" },
      { new: true }
    );
  }
  async rejectInstructor(id) {
    const instructor=await Instructor.findById(id)
    sendRejectInstructorEmail(instructor.email)
    return await Instructor.findByIdAndDelete(id);
  }


  async addMiniBiography(miniBiography, id) {
    return await Instructor.findByIdAndUpdate(
      id,
      { miniBiography: miniBiography },
      { new: true }
    );
  }
}

module.exports = new instructorService();
