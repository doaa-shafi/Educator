const RESOURSES_NAMES_ENUM=['Instructor','IndividualTrainee','CorporateTrainee','Corporate','admin','course_full','course_info',
                            'program','lesson']

const RESOURSES_NAMES={
    Instructor:RESOURSES_NAMES_ENUM[0],
    ITrainee:RESOURSES_NAMES_ENUM[1],
    CTrainee:RESOURSES_NAMES_ENUM[2],
    Corporate:RESOURSES_NAMES_ENUM[3],
    Admin:RESOURSES_NAMES_ENUM[4],
    Course_full:RESOURSES_NAMES_ENUM[5],
    Course_info:RESOURSES_NAMES_ENUM[6],
    Program:RESOURSES_NAMES_ENUM[7],
    Lesson:RESOURSES_NAMES_ENUM[8],
}

const ACTIONS_NAMES_ENUM=['readAny','readOwn','deleteAny','deleteOwn','updateAny','updateOwn','createAny','createOwn']

const ACTIONS_NAMES={
    READ_ANY:ACTIONS_NAMES_ENUM[0],
    READ_OWN:ACTIONS_NAMES_ENUM[1],
    DELETE_ANY:ACTIONS_NAMES_ENUM[2],
    DELETE_OWN:ACTIONS_NAMES_ENUM[3],
    UPDATE_ANY:ACTIONS_NAMES_ENUM[4],
    UPDATE_OWN:ACTIONS_NAMES_ENUM[5],
    CREATE_ANY:ACTIONS_NAMES_ENUM[6],
    CREATE_OWN:ACTIONS_NAMES_ENUM[7],

}

module.exports={
    RESOURSES_NAMES,
    ACTIONS_NAMES
}