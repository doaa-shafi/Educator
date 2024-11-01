const individualTraineeService = require("../services/individualTrainee");
const validate = require("../helpers/validate");
const authorize = require("../helpers/authorize");
const { RESOURSES_NAMES, ACTIONS_NAMES } = require("../config/constants");

const registerToCourse = async (req, res, next) => {
  const { courseId, token } = req.body;
  const traineeId = req.id;
  try {
    authorize(req.role, RESOURSES_NAMES.ITrainee, [ACTIONS_NAMES.UPDATE_OWN],true);
    const updatedTrainee = await individualTraineeService.registerToCourse(
      traineeId,
      courseId,
      token
    );
    res.status(200).json(updatedTrainee);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerToCourse,
};
