const CorporateTrainee= require("../models/users/corporateTrainee")
const {ValidationError}=require('../helpers/errors')

class corporateTraineeService{

  async addCorporateTrainee(username,email,password,corporate){
    return await CorporateTrainee.create({
      username: username,
      email:email,
      password:password,
      role:'Ctrainee',
      corporate:corporate,
    });
  }
}

module.exports = new corporateTraineeService()
