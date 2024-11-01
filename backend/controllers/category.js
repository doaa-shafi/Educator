const categoryService = require("../services/category");

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
    const {name}=req.body
    try {
      const category = await categoryService.addCategory(name);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getCategories,
  addCategory,
};
