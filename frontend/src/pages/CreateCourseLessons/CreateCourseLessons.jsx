import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AddIcon from '@mui/icons-material/Add';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import CreateCourseSideMenue from '../../components/CreateCourseSideMenue/CreateCourseSideMenue'
import './CreateCourseLessons.css';


const CreateCourseLessons = () => {

    const location = useLocation()
    const courseId = location.pathname.split("/")[2];

    const  axiosPrivate  = useAxiosPrivate()
    const [lessons, setLessons] = useState([])
    const [newLesson, setNewLesson] = useState("")
    const [showInput, setShowInput] = useState(false)
    const [lessonAdded, setLessonAdded] = useState(false)

    useEffect(() => {
        const getLessons = async () => {
            try {
                console.log(courseId)
                const res = await axiosPrivate.get(`/lessons/get-lessons`, { params: { courseId: courseId } });
                setLessons(res.data);
            } catch (error) {

            }
        };
        getLessons();
        setLessonAdded(false)
    }, [lessonAdded])

    const handleAddInput = () => {
        setShowInput(true)
    };

    const addNewLesson = async () => {
        try {
            console.log("pppppppppppp11")
            const response = await axiosPrivate.post(`/lessons/create-lesson`,{courseId, title:newLesson });
            setShowInput(false)
            setLessonAdded(true)
            console.log("pppppppppppp")
        } catch (error) {
             console.log(error)
        }

    }
    const [outInputs, setOutInputs] = useState([{ value: '' }, { value: '' }, { value: '' }, { value: '' }]);

    const handleOutInputChange = (index, event) => {
        const values = [...outInputs];
        values[index].value = event.target.value;
        setOutInputs(values);
    };

    const handleAddOutInput = () => {
        setOutInputs([...outInputs, { value: '' }]);
    };

    const [level, setLevel] = useState("")




    return (
        <div className='create-course-main-container'>
            <div className="create-course-navbar">
            <div className="nav-item logo"><CastForEducationIcon className='nav-logo-icon' /> <span className='nav-logo-name'>Educator</span></div>
                Draft Course
            </div>
            <div className="create-course-container">
                <CreateCourseSideMenue id={courseId}></CreateCourseSideMenue>
                <div className="create-course-left">
                    <div className="create-course-title">Course Lessons</div>
                    <div className="create-course-inputs">
                        {lessons.map((lesson, index) => (
                            <div key={index}>
                                <Link to={`/create-course/${courseId}/create-lesson/${lesson._id}`}>{lesson.title}</Link>
                            </div>
                        ))}
                        <div className="add-input">
                            <AddIcon></AddIcon>
                            <button className='add-more' onClick={handleAddInput}>Add Input</button>
                        </div>
                        {showInput === true &&
                            <div className="add-input">
                                <label >Lesson title</label>
                                <input type="text" value={newLesson} onChange={(e) => setNewLesson(e.target.value)} />
                                <button className='contin' onClick={addNewLesson}>Save</button>
                            </div>
                        }
                    </div>


                </div>
            </div>

        </div>
    )
}

export default CreateCourseLessons