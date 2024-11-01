const Category = require("../models/courses/category");

class categoryService{

  async getCategories(){
    return await Category.find();
  }

  async addCategory(name){
    return await Category.create({
        name:name
    });
  }
}

module.exports = new categoryService()


