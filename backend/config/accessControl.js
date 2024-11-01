const AccessControl = require('accesscontrol');

const ac = new AccessControl();

ac.grant('IndividualTrainee')
    .readOwn('IndividualTrainee')
    .updateOwn('IndividualTrainee')
    .deleteOwn('IndividualTrainee')
    .readAny('course_info')
    .readOwn('course_full')
    .readOwn('lesson');

ac.grant('CorporateTrainee')
    .readOwn('CorporateTrainee')
    .updateOwn('CorporateTrainee')
    .deleteOwn('CorporateTrainee');

ac.grant('Corporate')
    .readOwn('Corporate')
    .updateOwn('Corporate')
    .deleteOwn('Corporate')
    .createAny('CorporateTrainee')
    .readOwn('CorporateTrainee')
    .deleteOwn('CorporateTrainee');

ac.grant('admin')
    .createAny('admin')
    .readOwn('admin')
    .createAny('instructor')
    .readAny('instructor')
    .deleteAny('instructor')
    .createAny('Corporate')
    .readAny('Corporate')
    .deleteAny('Corporate');

ac.grant('Instructor')
    .readOwn('Instructor')
    .updateOwn('Instructor')
    .deleteOwn('Instructor')
    .createAny('course_full')
    .readOwn('course_full')
    .updateOwn('course_full')
    .deleteOwn('course_full')
    .createAny('lesson')
    .readOwn('lesson')
    .updateOwn('lesson')
    .deleteOwn('lesson');

module.exports = { ac };
