import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ReactPlayer from 'react-player';
import PDF from 'react-pdf-js';
import nopreviewavailable from '../../assets/no-preview-available.png'
import AddIcon from '@mui/icons-material/Add';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import CreateCourseSideMenue from '../../components/CreateCourseSideMenue/CreateCourseSideMenue'
import './CreateLesson.css';


const CreateLesson = () => {

    const location = useLocation()
    const courseId = location.pathname.split("/")[2];
    const lessonId = location.pathname.split("/")[4];

    const axiosPrivate = useAxiosPrivate()
    const [lesson, setLesson] = useState()
    const [newItem, setNewItem] = useState("")
    const [url, setUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [exercise, setExercise] = useState({ question: "", choiceA: "", choiceB: "", choiceC: "", choiceD: "", answer: "", comment: "" })
    const [showInput, setShowInput] = useState(false)
    const [showUploadArticle, setShowUploadArticle] = useState(false)
    const [showUploadVideo, setShowUploadVideo] = useState(false)
    const [showQuestionForm, setShowQuestionForm] = useState(false)
    const [ItemAdded, setItemAdded] = useState(false)

    useEffect(() => {
        const getLesson = async () => {
            try {
                console.log(courseId)
                const res = await axiosPrivate.get(`/lessons/get-lesson/${lessonId}`);
                setLesson(res.data);
            } catch (error) {

            }
        };
        getLesson();
        setItemAdded(false)
    }, [ItemAdded])

    const handleAddInput = () => {
        setShowInput(true)
    };

    const uploadVideo = async () => {
        try {
            const response = await axiosPrivate.patch(`/lessons/add-video`, { course_id: courseId, lesson_id: lessonId, title: newItem, link: videoUrl });
            setShowInput(false)
            setShowUploadVideo(false)
            setItemAdded(true)
        } catch (error) {
            console.log(error)
        }

    }
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setFileUrl(url);
            setFile(selectedFile);
        }
    };

    const uploadArticle = async () => {
        const formData = new FormData();
        formData.append('lectureFile', file);
        formData.append('title', newItem);
        formData.append('lesson_id', lessonId);
        formData.append('course_id', courseId);
        formData.append('duration', 10);

        try {
            const response = await axiosPrivate.patch('/lessons/add-lecture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure proper content type
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const addQuestion = async (e) => {
        try {
            e.preventDefault()
            console.log(exercise)
            const response = await axiosPrivate.patch(`/lessons/add-quiz`, { course_id: courseId, lesson_id: lessonId, exercises: [exercise] });
            setItemAdded(true)
            setShowQuestionForm(false)

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
                <div className="create-course-left">
                    <div className="create-course-title">Lesson Items</div>
                    <div className="create-course-inputs">
                        {lesson && lesson.items.map((item, index) => (
                            <div key={index}>
                                {item.type == 1 ?
                                    <div className="upload-video-lesson">
                                        <div style={{ marginTop: '20px' }}>
                                            {ReactPlayer.canPlay(item.link) ? (
                                                <div className='preview-window'>
                                                    <ReactPlayer url={item.link} width="100%" height="100%" />
                                                </div>
                                            ) : (
                                                <div className='preview-window'>
                                                    <img className='no-preview' src={nopreviewavailable} alt="No preview video available" />
                                                </div>

                                            )}
                                        </div>
                                        <div className='upload-video-lesson-inputs'>
                                            <div className='upload-video-lesson-input'>
                                                <label htmlFor="">{item.title}</label>

                                            </div>
                                            <div className='upload-video-lesson-input'>
                                                <label htmlFor="">{item.link}</label>

                                            </div>
                                            <div className='upload-video-lesson-input'>
                                                <label htmlFor="">{item.duration}</label>

                                            </div>
                                        </div>
                                    </div>
                                    : <div>
                                    </div>}

                            </div>
                        ))}
                        <div className="add-input">
                            <AddIcon></AddIcon>
                            <button className='add-more' onClick={handleAddInput}>Add Item</button>
                        </div>
                        {showInput === true &&
                            <div className="choose-type">
                                <div className='item-type' onClick={() => { setShowUploadArticle(false); setShowUploadVideo(true); setShowInput(false) }}>
                                    <VideoLibraryIcon></VideoLibraryIcon>
                                    <span>Video</span>
                                </div>
                                <div className='item-type' onClick={() => { setShowUploadArticle(true); setShowInput(false); setShowUploadVideo(false) }}>
                                    <PictureAsPdfIcon></PictureAsPdfIcon>
                                    <span>Article</span>
                                </div>
                            </div>
                        }
                        {showUploadVideo === true &&
                            <div className="upload-video-lesson">
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
                                <div className='upload-video-lesson-inputs'>
                                    <div className='upload-video-lesson-input'>
                                        <label htmlFor="">Enter video title</label>
                                        <input
                                            className='inin'
                                            type="text"
                                            value={newItem}
                                            onChange={(e) => setNewItem(e.target.value)}
                                            placeholder="video title"
                                            style={{ width: '300px', padding: '5px' }}
                                        />
                                    </div>
                                    <div className='upload-video-lesson-input'>
                                        <label htmlFor="">Video link</label>
                                        <input
                                            className='inin'
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            onBlur={(e) => setVideoUrl(e.target.value)}
                                            placeholder="Paste YouTube link here"
                                            style={{ width: '300px', padding: '5px' }}
                                        />
                                    </div>
                                    <button className='upload-button' onClick={uploadVideo}>Upload</button>
                                </div>

                            </div>

                        }
                        {showUploadArticle === true &&
                            <div className="upload-video-lesson">
                                <div style={{ marginTop: '20px' }}>
                                    {fileUrl ? (
                                        <div className='preview-window'>
                                            <PDF
                                                file={fileUrl}
                                                onLoadSuccess={({ numPages }) => console.log(`Loaded ${numPages} pages`)}
                                            />
                                        </div>
                                    ) : (
                                        <div className='preview-window'>
                                            <img className='no-preview' src={nopreviewavailable} alt="No preview video available" />
                                        </div>

                                    )}

                                </div>
                                <div className='upload-video-lesson-inputs'>
                                    <div className='upload-video-lesson-input'>
                                        <label htmlFor="">Enter Article title</label>
                                        <input
                                            className='inin'
                                            type="text"
                                            value={newItem}
                                            onChange={(e) => setNewItem(e.target.value)}
                                            placeholder="video title"
                                            style={{ width: '300px', padding: '5px' }}
                                        />
                                    </div>
                                    <div className='upload-video-lesson-input'>
                                        <label className="label1">Upload Article pdf</label>
                                        <input
                                            type="file"
                                            class="form-control"
                                            accept="application/pdf"
                                            required
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    <button className='upload-button' onClick={uploadArticle}>Upload</button>
                                </div>

                            </div>

                        }
                    </div>
                    <div className='new-quiz'>
                        <div className='create-quiz'>Lesson quiz</div>
                        {lesson && lesson.quiz.map((question, index) => (
                            <div key={index}>
                                <div className="q-input-container">
                                    <label htmlFor="">Question</label>
                                    <span>{question.question}</span>
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Choice A</label>
                                    <span>{question.choiceA}</span>
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Choice B</label>
                                    <span>{question.choiceB}</span>
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Choice C</label>
                                    <span>{question.choiceC}</span>
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Choice D</label>
                                    <span>{question.choiceD}</span>
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Comment</label>
                                    <span>{question.comment}</span>
                                </div>
                            </div>
                        ))}
                        <div className="add-input">
                            <AddIcon></AddIcon>
                            <button className='add-more' onClick={() => setShowQuestionForm(true)}>Add Question</button>
                        </div>
                        {showQuestionForm === true &&
                            <form onSubmit={addQuestion} className='new-question'>
                                <div className="q-input-container">
                                    <label htmlFor="">Question</label>
                                    <input type="text" className='q-input' placeholder='Enter question' onChange={(e) => setExercise({ ...exercise, question: e.target.value })} />
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Choice A</label>
                                    <input type="text" className='q-input' placeholder='First choice' onChange={(e) => setExercise({ ...exercise, choiceA: e.target.value })} />
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Choice B</label>
                                    <input type="text" className='q-input' placeholder='Second choice' onChange={(e) => setExercise({ ...exercise, choiceB: e.target.value })} />
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Choice C</label>
                                    <input type="text" className='q-input' placeholder='Third choice' onChange={(e) => setExercise({ ...exercise, choiceC: e.target.value })} />
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Choice D</label>
                                    <input type="text" className='q-input' placeholder='Fourth choice' onChange={(e) => setExercise({ ...exercise, choiceD: e.target.value })} />
                                </div>
                                <div className="q-input-container">
                                    <label htmlFor="">Comment</label>
                                    <input type="text" className='q-input' placeholder='Enter comment.. will appear when choosing wrong answer' onChange={(e) => setExercise({ ...exercise, comment: e.target.value })} />
                                </div>
                                <select className='no-border-select' id="options" onChange={(e) => setExercise({ ...exercise, answer: e.target.value })} >
                                    <option value="" disabled>Select the right choice</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                                <button type='submit'>Add question</button>

                            </form>
                        }

                    </div>



                </div>
            </div>

        </div>
    )
}

export default CreateLesson