import React from 'react'
import { Link } from 'react-router-dom'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import './CreateCourseSideMenue.css'

const CreateCourseSideMenue = ({ id }) => {
    const url1 = '/create-course-info/' + id
    const url2 = '/create-course-learnings/' + id
    const url3 = '/create-course-pricing/' + id
    const url4 = '/create-course-lessons/' + id

    const axiosPrivate=useAxiosPrivate()

    const publish=async()=>{
        try {
            const respone = axiosPrivate.patch('/courses/publish',{courseId:id})
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div className="create-course-side-menue">
            <div className="create-course-side-menue-section">

                <div className="create-course-side-menue-section-title">Course Landing page</div>
                <div className="create-course-side-menue-section-links">
                    <Link to={url1}>Basic Info</Link>
                    <Link to={url2}>Requirements & Outcomes</Link>
                    <Link to={url3}>Pricing</Link>
                </div>
            </div>
            <div className="create-course-side-menue-section">
                <div className="create-course-side-menue-section-title">Course Content</div>
                <div className="create-course-side-menue-section-links">
                    <Link to={url4}>Lessons</Link>

                </div>
            </div>
            <div className="create-course-side-menue-section">
                <button className='publish' onClick={publish}>Publish your course</button>
            </div>
        </div>

    )
}

export default CreateCourseSideMenue