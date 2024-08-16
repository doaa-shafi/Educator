const AccessControl = require('accesscontrol');

const ac = new AccessControl();

ac.grant('ITrainee')
    .readOwn('ITrainee')
    .updateOwn('ITrainee')
    .deleteOwn('ITrainee')
    .readAny('course_info')
    .readOwn('course_full')
    .readOwn('lesson');

ac.grant('CTrainee')
    .readOwn('CTrainee')
    .updateOwn('CTrainee')
    .deleteOwn('CTrainee');

ac.grant('corporate')
    .readOwn('corporate')
    .updateOwn('corporate')
    .deleteOwn('corporate')
    .createOwn('CTrainee')
    .readOwn('CTrainee')
    .deleteOwn('CTrainee');

ac.grant('admin')
    .createAny('admin')
    .readOwn('admin')
    .createAny('instructor')
    .readAny('instructor')
    .deleteAny('instructor')
    .createAny('corporate')
    .readAny('corporate')
    .deleteAny('corporate');

ac.grant('instructor')
    .readOwn('instructor')
    .updateOwn('instructor')
    .deleteOwn('instructor')
    .createAny('course_full')
    .readOwn('course_full')
    .updateOwn('course_full')
    .deleteOwn('course_full')
    .createAny('lesson')
    .readOwn('lesson')
    .updateOwn('lesson')
    .deleteOwn('lesson');

module.exports = { ac };
