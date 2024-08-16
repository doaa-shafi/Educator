import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from "react";
import './Home.css'
import Slider from '../../components/Slider/Slider'
import Navbar from '../../components/Navbar/Navbar';
import CourseCard from '../../components/CourseCard/CourseCard';


const Home = () => {

  const [courses, setCourses] = useState(null)

  useEffect(() => {
    const getCourses = async () => {
      console.log('llllllllllllllllllll')
      const res = await axios.get("courses/populer");
      console.log(res.data)
      setCourses(res.data);
    };

    getCourses();

  }, [])

  return (
    <div className="container">
      <Navbar></Navbar>
      <div className='slider'><Slider></Slider></div>
      <section className="courses-section">
        <h2>Featured Courses</h2>
        <div className="course-list">
          {courses && courses.map(course => (
            <CourseCard
              id={course._id}
              image={course.thumbnail}
              title={course.title}
              rating={course.avgRating} />
          ))}
        </div>
      </section>
    </div>
    
  )
}

export default Home