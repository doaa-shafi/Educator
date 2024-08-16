import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom'
import Modal from 'react-modal';
import './InstructorDashBoardDraftCourses.css'
import InstructorDashBoardSideMenue from '../../components/InstructorDashBoardSideMenue/InstructorDashBoardSideMenue';

const InstructorDashBoard = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [draftCourses, setDraftCourses] = useState([])
    const [courseTitle, setCourseTitle] = useState("")
    const [error, setError] = useState("")
    const [isCreateCourseModalVisible, setIsCreateCourseModalVisible] = useState(false);


    useEffect(() => {
        const getDraftCourses = async () => {
            try {
                const res = await axiosPrivate.get(`/courses/draft`);
                setDraftCourses(res.data);
            } catch (error) {
console.log(error)
            }
        };
        getDraftCourses();
    }, [])

    const handleOkCreateCourseModal = async () => {

        if (courseTitle === "") {
            setError("Please enter all fields")
        }

        else {
            try {
                const response = await axiosPrivate.post('/courses/', { title: courseTitle });
                const id = response.data._id
                navigate('/create-course-info/' + id)
            } catch (err) {
                if (!err?.response) {
                    setError('No Server Response');
                }
                else {
                    setError(err.response.data.error)
                }

            }

        }

    };

    const handleCancelCreateCourseModal = () => {
        setIsCreateCourseModalVisible(false);
    };
    return (
        <div className='instructor-dashboard-main-container'>
            <div className="instructor-dashboard-container">
                <InstructorDashBoardSideMenue></InstructorDashBoardSideMenue>
                <div className="draft-courses">
                    {draftCourses.map((course, index) => (
                        <div key={index}>
                            <Link to={`/create-course-info/${course._id}`}>{course.title}</Link>

                        </div>
                    ))}

                </div>
                <div className="showed-section">
                    <button onClick={() => setIsCreateCourseModalVisible(true)}>Create new course</button>
                </div>
                <Modal
                    isOpen={isCreateCourseModalVisible}
                    onRequestClose={handleCancelCreateCourseModal}
                    contentLabel="Example Modal"
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        content: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            paddingLeft: '50px',
                            paddingRight: '50px',
                            paddingTop: '30px',
                            paddingBottom: '30px',
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)'
                        }
                    }}
                >

                    <div className="modal-titles">
                        <div className='modal-title'>What is your course title</div>
                        <div className='modal-title-sub'>You can change the title later</div>
                    </div>
                    <input type='text' className="modal-input" onChange={(e) => setCourseTitle(e.target.value)} value={courseTitle} />
                    <div className="modal-buttons">
                        <button className="modal-button" onClick={handleCancelCreateCourseModal}>Cancel</button>
                        <button className="modal-button" onClick={handleOkCreateCourseModal}>Create</button>
                    </div>


                </Modal>

            </div>

        </div>
    )
}

export default InstructorDashBoard