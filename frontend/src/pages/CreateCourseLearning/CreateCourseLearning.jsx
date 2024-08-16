import React from 'react'
import { useState ,useEffect } from 'react'
import {Form, useLocation} from 'react-router-dom'
import ReactPlayer from 'react-player';
import axios from 'axios'
import AddIcon from '@mui/icons-material/Add';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import CreateCourseSideMenue from '../../components/CreateCourseSideMenue/CreateCourseSideMenue'
import './CreateCourseLearning.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const CreateCourseLearning = () => {

    const axiosPrivate=useAxiosPrivate()
    const location=useLocation()
    const courseId = location.pathname.split("/")[2];

    const [inputAdded,setInputAdded]=useState(false)

    const [oldReq,setOldReq]=useState(false)
    const [reqInputs, setReqInputs] = useState([]);

    const handleReqInputChange = (index, event) => {
        const values = [...reqInputs];
        values[index] = event.target.value;
        setReqInputs(values);
    };


    const handleAddReqInput = () => {
        setReqInputs([...reqInputs, '' ]);
    };

    const [oldOut,setOldOut]=useState(false)
    const [outInputs, setOutInputs] = useState([]);

    const handleOutInputChange = (index, event) => {
        const values = [...outInputs];
        values[index] = event.target.value;
        setOutInputs(values);
    };

    const handleAddOutInput = () => {
        setOutInputs([...outInputs,  '' ]);
    };

    const [level, setLevel] = useState("")
    
    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axiosPrivate.get(`/courses/about/${courseId}`);
                setOldOut(res.data.learnings)
                setOldReq(res.data.requirements)
                setLevel(res.data.level)
            } catch (error) {
console.log(error)
            }
        };
        getCourse();
    }, [inputAdded])

    useEffect(() => {
        const numberReqInputs = async () => {
            if(oldReq.length > 0){
                setReqInputs([])
            }else{
                setReqInputs(['','','',''])
            }
        };
        numberReqInputs();
    }, [oldReq])

    useEffect(() => {
        const numberOutInputs = async () => {
            if(oldOut.length > 0){
                setOutInputs([])
            }else{
                setOutInputs(['','','',''])
            }
        };
        numberOutInputs();
    }, [oldOut])


    const submit=async(e)=>{
        try {
            e.preventDefault()
            const response = await axiosPrivate.patch(`/courses/course-learning/${courseId}`,{requirements:reqInputs,learnings:outInputs,level:level});
            setInputAdded(true)
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className='create-course-main-container'>
            <div className="create-course-navbar">
            <div className="nav-item logo"><CastForEducationIcon className='nav-logo-icon' /> <span className='nav-logo-name'>Educator</span></div>
                Draft Course
            </div>
            <div className="create-course-container">
                <CreateCourseSideMenue id={courseId}></CreateCourseSideMenue>
                <form className="create-course-left" onSubmit={submit}>
                    <div className="create-course-title">Course Landing Page -- Learnings</div>
                    <div className="create-course-desc">Your course landing page is crucial to your success on our platform Educator. As you complete this section, think about creating a compelling Course Landing Page that demonstrates why someone would want to enroll in your course.</div>
                    <div className="create-course-inputs">
                        <div className="create-course-input">
                            <span className="title">What will students learn in your course?</span>
                            {oldOut&& oldOut.map((input, index) => (
                                <div key={index}>
                                    <span>{input}</span>
                                </div>
                            ))}
                            {outInputs&& outInputs.map((input, index) => (
                                <div key={index}>
                                    <input
                                        className='bordered-input'
                                        type="text"
                                        value={input}
                                        onChange={(event) => handleOutInputChange(index, event)}
                                    />
                                </div>
                            ))}
                            <div className="add-input">
                                <AddIcon></AddIcon>
                                <button className='add-more' onClick={handleAddOutInput}>Add input </button>
                            </div>
                            
                        </div>
                        <div className="create-course-input">
                            <span className="title">What are the requirements for this course?</span>
                            {oldReq&&oldReq.map((input, index) => (
                                <div key={index}>
                                    <span>{input}</span>
                                </div>
                            ))}
                            {reqInputs&&reqInputs.map((input, index) => (
                                <div key={index}>
                                    <input
                                        className='bordered-input'
                                        type="text"
                                        value={input}
                                        onChange={(event) => handleReqInputChange(index, event)}
                                    />
                                </div>
                            ))}
                            <div className="add-input">
                                <AddIcon></AddIcon>
                                <button className='add-more' onClick={handleAddReqInput}>Add input</button>
                            </div>

                        </div>
                        <div className="create-course-input">
                            <label htmlFor="options">Select level</label>
                            <select className='no-border-select' id="options" value={level} onChange={(e) => setLevel(e.target.value)}>
                                <option value="" disabled>Select level</option>
                                <option value="Beginner">Beginner level</option>
                                <option value="Intermediate">Intermediate level</option>
                                <option value="Advanced">Advanced level</option>
                            </select>
                        </div>
                    </div>
                    <button className='contin' type='submit' >Save</button>

                </form>
            </div>

        </div>
    )
}

export default CreateCourseLearning