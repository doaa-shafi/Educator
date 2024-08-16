const User = require("../models/users/user");

class adminService{

  async addAdmin(username,email,password){
    return await User.create({
      username: username,
      email:email,
      password:password,
      role:"admin"
    });
  }
}

module.exports = new adminService()
