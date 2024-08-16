import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactPlayer from 'react-player';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import nopreviewavailable from '../../assets/no-preview-available.png'
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import CreateCourseSideMenue from '../../components/CreateCourseSideMenue/CreateCourseSideMenue'
import './CreateCourseBasicInfo.css';
const CreateCourseBasicInfo = () => {

    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const courseId = location.pathname.split("/")[2];

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [url, setUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [error, setError] = useState('')

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axiosPrivate.get(`/courses/about/${courseId}`);
                setTitle(res.data.title)
                setDescription(res.data.description)
                setCategory(res.data.subject)
                setVideoUrl(res.data.previewVideo)
                setUrl(res.data.previewVideo)
            } catch (error) {
                console.log(error)
            }
        };
        getCourse();
    }, [])

    const handleSave = async () => {
        console.log(category)

        if (title === "" || description === "" || category === "") {
            setError("Please enter all fields")
        }

        else {

            try {
                const response = await axiosPrivate.patch(`/courses/${courseId}`, { title, description, subject: category });
            } catch (err) {
                if (!err?.response) {
                    setError('No Server Response');
                }
                else {
                    console.log(err.response.data.error)
                    setError(err.response.data.error)
                }

            }

        }
    }
    const handleUpload = async () => {

        if (url === "") {
            setError("Please enter all fields")
        }

        else {

            try {
                const response = await axiosPrivate.patch(`/courses/course-video/${courseId}`, { previewVideo: videoUrl });
            } catch (err) {
                if (!err?.response) {
                    setError('No Server Response');
                }
                else {
                    console.log(err.response.data.error)
                    setError(err.response.data.error)
                }

            }

        }
    }


    return (
        <div className='create-course-main-container'>
            <div className="create-course-navbar">
                <div className="create-course-nav-item"><CastForEducationIcon className='nav-logo-icon' /> <span className='nav-logo-name'>Educator</span></div>
                <div className="create-course-nav-item">Draft Course</div>
                <div className="create-course-nav-item">{title}</div>
            </div>
            <div className="create-course-container">
                <CreateCourseSideMenue id={courseId}></CreateCourseSideMenue>
                <div className="create-course-left">
                    <div className="create-course-title">Course Landing Page -- Basic Info</div>
                    <div className="create-course-desc">Your course landing page is crucial to your success on our platform Educator. As you complete this section, think about creating a compelling Course Landing Page that demonstrates why someone would want to enroll in your course.</div>
                    <div className="create-course-inputs">
                        <div className="create-course-input">
                            <label >Course title</label>
                            <input className='inin' type="text" onChange={(e) => setTitle(e.target.value)} value={title} />
                        </div>
                        <div className="create-course-input">
                            <label >Course description</label>
                            <input className='inin' type="text" onChange={(e) => setDescription(e.target.value)} value={description} />
                        </div>
                        <div className="create-course-input">
                            <label htmlFor="options">Choose your course category</label>
                            <select className='no-border-select' id="options" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="" disabled>Select an option</option>
                                <option value="Option">Option</option>
                                <option value="Option">Option</option>
                                <option value="Option">Option</option>
                            </select>
                        </div>
                    </div>
                    <button className='contin' onClick={handleSave}>Save</button>
                    <div className="upload-video">
                        <label htmlFor="">Upload preview video</label>
                        <input
                            className='inin'
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onBlur={(e) => setVideoUrl(e.target.value)}
                            placeholder="Paste YouTube link here"
                            style={{ width: '300px', padding: '5px' }}
                        />
                        <div style={{ marginTop: '20px' }}>
                            {ReactPlayer.canPlay(videoUrl) ? (
                                <div className='preview-window'>
                                    <ReactPlayer url={videoUrl} width="100%" height="100%" />
                                </div>
                            ) : (
                                <div className='preview-window'>
                                    <img className='no-preview' src={nopreviewavailable} alt="No preview video available" />
                                </div>

                            )}
                        </div>
                        <button className='contin' onClick={handleUpload}>Upload</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateCourseBasicInfo