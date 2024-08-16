const Course = require("../models/courses/course");
const {ServerError,AuthorizationError}=require('../helpers/errors')

class courseService {

  async getPopulerCoursesInfo(){
    return await Course.find({})
      .select({ lessons: 0 })
      .sort({enrolledStudents: -1})
      .limit(20)
  }

  async getDraftCourses(instructor){
    return await Course.find({instructor:instructor,status:"draft"})
  }

  async getCoursesInfo(page, limit) {
    return await Course.find({})
      .select({ lessons: 0 })
      .skip(limit * (page - 1))
      .limit(limit);
  }

  async getCourseInfo(id) {
    return await Course.findById(id).select({ lessons: 0 });
  }

  async getCourse(id) {
    return await Course.findById(id);
  }
  

  async createCourse(title,instructor) {
    return await Course.create({
      title: title,
      instructor: instructor,
    });
  }

  async updateCourseInfo(id,title, description, subject) {
    return await Course.findByIdAndUpdate(id,{
      title: title,
      description: description,
      subject: subject,
    });
  }

  async uploadPreviewVideo(previewVideo, course_id,instructor) {
    const course=await Course.findById(course_id)
    if(course.status==='published') 
      throw new ServerError('Cannot edit a course after its publishing, it must be a draft or closed to perform editing')
    if (course.instructor!=instructor)
      throw new AuthorizationError('You do not have access')
    return await Course.findByIdAndUpdate(
      course_id,
      { previewVideo: previewVideo },
      { new: true }
    );
  }

  async updateCourcePricing(price,quantity,discountStart,discountEnd, course_id,instructor) {
    const course=await Course.findById(course_id)
    if(course.status==='published') 
      throw new ServerError('Cannot edit a course after its publishing, it must be a draft or closed to perform editing')
    if (course.instructor!=instructor)
      throw new AuthorizationError('You do not have access')
    const discount={quantity,discountStart,discountEnd}
    return await Course.findByIdAndUpdate(course_id, { price,discount }, { new: true });
  }

  async updateCourselearnings(requirements,learnings,level,course_id,instructor) {
    const course=await Course.findById(course_id)
    if(course.status==='published') 
      throw new ServerError('Cannot edit a course after its publishing, it must be a draft or closed to perform editing')
    if (course.instructor!=instructor)
      throw new AuthorizationError('You do not have access')
    return await Course.findByIdAndUpdate(
      course_id,
      { $push: {requirements: { $each: requirements },learnings: { $each: learnings } },level:level },
      { new: true }
    );
  }
  async publishCourse(course_id,instructor) {
    const course=await Course.findById(course_id)
    if(course.status==='published') 
      throw new ServerError('This Course is already published')
    if (course.instructor!=instructor)
      throw new AuthorizationError('You do not have access')
    //ensure completeness
    return await Course.findByIdAndUpdate(
      course_id,
      {status:"published"},
      { new: true }
    );
  }

  async closeCourse(course_id,instructor) {
    const course=await Course.findById(course_id)
    if(course.status==='closed') 
      throw new ServerError('This Course is already closed')
    if (course.instructor!=instructor)
      throw new AuthorizationError('You do not have access')
    return await Course.findByIdAndUpdate(
      course_id,
      {status:"closed"},
      { new: true }
    );
  }

}

module.exports = new courseService();
