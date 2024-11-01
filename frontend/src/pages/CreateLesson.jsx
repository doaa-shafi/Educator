import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import PDF from 'react-pdf-js';
import nopreviewavailable from '../assets/no-preview-available.png'
import AddIcon from '@mui/icons-material/Add';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import logo from '../assets/logo_white.png'
import Select from 'react-select';

const CreateLesson = () => {

    const location = useLocation()
    const courseId = location.pathname.split("/")[2];
    const lessonId = location.pathname.split("/")[4];

    const axiosPrivate = useAxiosPrivate()
    const [lesson, setLesson] = useState()
    const [newItem, setNewItem] = useState("")
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [exercise, setExercise] = useState({ question: "", choiceA: "", choiceB: "", choiceC: "", choiceD: "", answer: "", comment: "" })
    const [showInput, setShowInput] = useState(false)
    const [showUploadArticle, setShowUploadArticle] = useState(false)
    const [showUploadVideo, setShowUploadVideo] = useState(false)
    const [showQuestionForm, setShowQuestionForm] = useState(false)
    const [ItemAdded, setItemAdded] = useState(false)
    const [deletedItemTitle, setDeletedItemTitle] = useState()
    const [deletedItemIndex, setDeletedItemIndex] = useState()
    const [deletedQuestionIndex, setDeletedQuestionIndex] = useState()
    const [showConfirmDeleteItem, setShowConfirmDeleteItem] = useState(false)
    const [showConfirmDeleteQuestion, setShowConfirmDeleteQuestion] = useState(false)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    const showSuccess = (message) => {
        setAlertMessage(message);
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 2000); // Hide the alert after 3 seconds
    };

    const showError = (message) => {
        setAlertMessage(message);
        setShowErrorAlert(true);
    };


    const answers = [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
    ]

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
            const response = await axiosPrivate.patch(`/lessons/add-video`, { course_id: courseId, lesson_id: lessonId, title: newItem, link: url });
            setShowInput(false)
            setShowUploadVideo(false)
            setLesson(response.data)
            setNewItem("")
            setUrl("")
            showSuccess("Video uploaded successfully")
        } catch (error) {
            console.log(error)
            showError(error.response.data.error)
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
            setShowInput(false)
            setShowUploadArticle(false)
            setLesson(response.data)
            setNewItem("")
            setFile(null)
            setFileUrl("")
            showSuccess("Article uploaded successfully")
        } catch (error) {
            console.log(error)
            showError(error.response.data.error)
        }
    }
    const addQuestion = async (e) => {
        try {
            e.preventDefault()
            console.log(exercise)
            const response = await axiosPrivate.patch(`/lessons/add-quiz`, { course_id: courseId, lesson_id: lessonId, exercise });
            setLesson(response.data)
            setShowQuestionForm(false)
            showSuccess("Question added successfully")
            setExercise({ question: "", choiceA: "", choiceB: "", choiceC: "", choiceD: "", answer: "", comment: "" })
        } catch (error) {
            console.log(error)
            showError(error.response.data.error)
        }
    }

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            fontFamily: 'Montserrat, Aria, sans-serif',
            fontSize: '15px',
            color: '#555',
            fontWeight: '500'
        }),
        option: (provided) => ({
            ...provided,
            fontFamily: 'Montserrat, Aria, sans-serif',
            fontSize: '15px', // Corrected to 'fontSize'
            color: '#555',
            fontWeight: '500'
        }),
        singleValue: (provided) => ({
            ...provided,
            fontFamily: 'Montserrat, Aria, sans-serif',
            fontSize: '15px', // Corrected to 'fontSize'
            color: '#555',
            fontWeight: '500'
        }),
    }


    const deleteItem = async (e) => {
        try {
            e.preventDefault()
            console.log(deletedItemIndex, deletedItemTitle)
            const response = await axiosPrivate.patch("/lessons/delete-item", { lessonId, itemIndex: deletedItemIndex, itemTitle: deletedItemTitle })
            console.log(response.data)
            setLesson(response.data.lesson)
            setShowConfirmDeleteItem(false)
            setDeletedItemTitle("")
            showSuccess("Item deleted successfully")
        } catch (error) {
            console.log(error)
            showError(error.response.data.error)
        }
    }
    const deleteQuestion = async (e) => {
        try {
            e.preventDefault()
            console.log(deletedQuestionIndex)
            const response = await axiosPrivate.patch("/lessons/delete-question", { lessonId, itemIndex: deletedItemIndex, itemTitle: deletedItemTitle })
            console.log(response.data)
            setLesson(response.data.lesson)
            setShowConfirmDeleteQuestion(false)
            showSuccess("Question deleted successfully")

        } catch (error) {
            console.log(error)
            showError(error.response.data.error)
        }
    }



    return (
        <body className='home-01'>
            <Modal
                className="modal-content"
                isOpen={showConfirmDeleteItem}
                onRequestClose={() => setShowConfirmDeleteItem(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        top: '50%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '50%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#fff',
                        opacity: 1,
                    },
                }}
            >
                <div className="preview-content">
                    <h3>Are you sure?</h3>
                    <p>You are about to open this item, Write item title to confirm</p>
                    <form action="submit">
                        <div className="input">
                            <input
                                className="input-01"
                                type="text"
                                onChange={(e) => setDeletedItemTitle(e.target.value)}
                                value={deletedItemTitle}
                            />
                        </div>
                        {/* {error !== '' && <p>{error}</p>} */}
                        <button class="contin" type='submit' onClick={deleteItem}>Confirm</button>
                    </form>
                </div>
            </Modal>

            <Modal
                className="modal-content"
                isOpen={showConfirmDeleteQuestion}
                onRequestClose={() => setShowConfirmDeleteQuestion(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '20px',
                        top: '50%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '50%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#fff',
                        opacity: 1,
                    },
                }}
            >
                <div className="preview-content">
                    <h3>Are you sure?</h3>
                    <p>You are about to open this question, Write item title to confirm</p>
                    <button class="contin" type='submit' onClick={deleteQuestion}>Confirm</button>
                </div>
            </Modal>

            <Modal
                className="modal-content"
                isOpen={showSuccessAlert}
                onRequestClose={() => setShowSuccessAlert(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        padding: '20px',
                        top: '23%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '20%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        fontSize: '16px',
                        opacity: 1,
                        zIndex: '100',
                        borderRadius: "7px"
                    },
                }}
            >
                <div className="preview-content">
                    <span>{alertMessage}</span>
                </div>
            </Modal>

            <Modal
                className="modal-content"
                isOpen={showErrorAlert}
                onRequestClose={() => setShowErrorAlert(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        padding: '20px',
                        top: '23%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '50%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        fontSize: '16px',
                        opacity: 1,
                        zIndex: '100',
                        borderRadius: "7px"
                    },
                }}
            >
                <div className="preview-content">
                    <span>{alertMessage}</span>
                    <span>{"   "}</span>
                    <CloseIcon style={{ cursor: "pointer" }} onClick={() => setShowErrorAlert(false)} />
                </div>
            </Modal>
            <div>
                <div class="sub-header">
                    <div class="container">
                        <div className="flex-row">
                            <div className="flex-row">
                                <Link to="/" class="logo">
                                    <img src={logo} alt="" />
                                </Link>
                                <ul class="main-nav__list">
                                    <li class="active">
                                        <Link>Draft Courses</Link>
                                    </li>
                                    <li>
                                        <ArrowForwardIosIcon className='icon-01' />
                                    </li>
                                    <li>
                                        <Link></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <main>
                    <div className='padding-top-93'></div>
                    <div class="contact">
                        <div class="row">
                            <div class="col-lg-12" id="mainContent">
                                <div class="row box first">
                                    <div class="box-header">
                                        <h3><strong>1</strong>Lesson Curriculum Items</h3>
                                        <p>Add all videos and articles for this lesson here.</p>
                                    </div>
                                    <div >
                                        {lesson && lesson.items.map((item, index) => (
                                            <div key={index}>
                                                {item.type == 1 ?
                                                    <div className='col-md-8'>
                                                        <div className='col-lg-6 col-md-12'>
                                                            <div style={{ marginBottom: '20px' }}>
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
                                                        </div>
                                                        <div className='col-lg-6 col-md-12'>
                                                            <div className='form-group'>
                                                                <label className='form-control'>{item.title}</label>
                                                            </div>
                                                            <div className='form-group'>
                                                                <label className='form-control'>{item.link}</label>
                                                            </div>
                                                            <div className='form-group'>
                                                                <label className='form-control'>{item.duration} Minutes</label>
                                                            </div>
                                                            <div className="form-group">
                                                                <DeleteIcon style={{ color: "darkred", cursor: "pointer", fontSize: "16px" }}
                                                                    onClick={() => { setShowConfirmDeleteItem(true); setDeletedItemIndex(index) }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='col-md-8'>
                                                        <div className='col-lg-6 col-md-12'>
                                                            <div style={{ marginBottom: '20px' }}>
                                                                {item.link ? (
                                                                    <div className='preview-window'>
                                                                        <PDF
                                                                            file={item.link}
                                                                            onLoadSuccess={({ numPages }) => console.log(`Loaded ${numPages} pages`)}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className='preview-window'>
                                                                        <img className='no-preview' src={nopreviewavailable} alt="No preview video available" />
                                                                    </div>

                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className='col-lg-6 col-md-12'>
                                                            <div className='form-group'>
                                                                <label className='form-control'>{item.title}</label>
                                                            </div>
                                                            <div className='form-group'>
                                                                <label className='form-control'>{item.link}</label>
                                                            </div>
                                                            <div className='form-group'>
                                                                <label className='form-control'>{item.duration} Minutes</label>
                                                            </div>
                                                            <div className="form-group">
                                                                <DeleteIcon style={{ color: "darkred", cursor: "pointer", fontSize: "16px" }}
                                                                    onClick={() => { setShowConfirmDeleteItem(true); setDeletedItemIndex(index) }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        ))}
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <div className="add-input">
                                                    <AddIcon></AddIcon>
                                                    <button className='add-more' onClick={handleAddInput}>Add Item</button>
                                                </div>
                                            </div>
                                        </div>
                                        {showInput === true &&
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="choose-type">
                                                        <div className='item-type' onClick={() => { setShowUploadArticle(false); setShowUploadVideo(true); setShowInput(false) }}>
                                                            <VideoLibraryIcon style={{ fontSize: "20px" }}></VideoLibraryIcon>
                                                            <span>Video</span>
                                                        </div>
                                                        <div className='item-type' onClick={() => { setShowUploadArticle(true); setShowInput(false); setShowUploadVideo(false) }}>
                                                            <PictureAsPdfIcon style={{ fontSize: "20px" }}></PictureAsPdfIcon>
                                                            <span>Article</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {showUploadVideo === true &&
                                            <div className='col-md-8'>
                                                <div className='col-lg-6 col-md-12'>
                                                    <div style={{ marginBottom: '20px' }}>
                                                        {ReactPlayer.canPlay(url) ? (
                                                            <div className='preview-window'>
                                                                <ReactPlayer url={url} width="100%" height="100%" />
                                                            </div>
                                                        ) : (
                                                            <div className='preview-window'>
                                                                <img className='no-preview' src={nopreviewavailable} alt="No preview video available" />
                                                            </div>

                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-12">

                                                    <div className='form-group'>
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            value={newItem}
                                                            onChange={(e) => setNewItem(e.target.value)}
                                                            placeholder="video title"

                                                        />
                                                    </div>
                                                    <div className='form-group'>
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            value={url}
                                                            onChange={(e) => setUrl(e.target.value)}
                                                            placeholder="Paste YouTube link here"

                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <button className='btn-05' onClick={uploadVideo}>Upload</button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {showUploadArticle === true &&
                                            <div className='col-md-8'>
                                                <div className="col-lg-6 col-md-12">
                                                    <div style={{ marginBottom: '20px' }}>
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
                                                </div>
                                                <div className='col-lg-6 col-md-12'>
                                                    <div className='form-group'>

                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            value={newItem}
                                                            onChange={(e) => setNewItem(e.target.value)}
                                                            placeholder="Article title"

                                                        />
                                                    </div>
                                                    <div className='form-group'>
                                                        <label className="label1">Upload Article pdf</label>
                                                        <input
                                                            type="file"
                                                            class="form-control"
                                                            accept="application/pdf"
                                                            required
                                                            onChange={handleFileChange}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <button className='btn-05' onClick={uploadArticle}>Upload</button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div class="row box">
                                    <div class="box-header">
                                        <h3><strong>2</strong>Lesson Quiz</h3>
                                        <p>Add all lesson quiz questions here in an MCQ form.</p>
                                    </div>
                                    <div class="col-lg-6 col-md-12">
                                        <ol>
                                            {lesson && lesson.quiz.map((question, index) => (
                                                <li key={index} className='col-md-12' >
                                                    <div className="col-md-12 ">
                                                        <div className="form-group">
                                                            <label className='margin-bottom-10'>Question <DeleteIcon style={{ color: "darkred", cursor: "pointer", fontSize: "16px" }} onClick={() => { setShowConfirmDeleteQuestion(true); setDeletedQuestionIndex(index) }} /></label>
                                                            <label className='form-control'>  {question.question}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label className='margin-bottom-10'>Choice A</label>
                                                            <label className='form-control'>{question.choiceA}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label className='margin-bottom-10'>Choice B</label>
                                                            <label className='form-control'>{question.choiceB}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label className='margin-bottom-10'>Choice C</label>
                                                            <label className='form-control'>{question.choiceC}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label className='margin-bottom-10'>Choice D</label>
                                                            <label className='form-control'>{question.choiceD}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label className='margin-bottom-10'>Answer</label>
                                                            <label className='form-control'>{question.answer}</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group">
                                                            <label className='margin-bottom-10'>Comment</label>
                                                            <label className='form-control'>{question.comment}</label>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                        <div className="col-lg-6 col-md-12">
                                            <div className="form-group">
                                                <div className="add-input">
                                                    <AddIcon></AddIcon>
                                                    <button className='add-more' onClick={() => setShowQuestionForm(true)}>Add Question</button>
                                                </div>
                                            </div>
                                        </div>
                                        {showQuestionForm === true &&
                                            <form onSubmit={addQuestion} >
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <input type="text" className='form-control' placeholder='Enter question' onChange={(e) => setExercise({ ...exercise, question: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <input type="text" className='form-control' placeholder='First choice' onChange={(e) => setExercise({ ...exercise, choiceA: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className='form-group'>
                                                        <input type="text" className='form-control' placeholder='Second choice' onChange={(e) => setExercise({ ...exercise, choiceB: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className='form-group'>
                                                        <input type="text" className='form-control' placeholder='Third choice' onChange={(e) => setExercise({ ...exercise, choiceC: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className='form-group'>
                                                        <input type="text" className='form-control' placeholder='Fourth choice' onChange={(e) => setExercise({ ...exercise, choiceD: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className='form-group'>
                                                        <input type="text" className='form-control' placeholder='Comment' onChange={(e) => setExercise({ ...exercise, comment: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div class="col-md-12 margin-bottom-20">
                                                    <div className="form-group">
                                                        <Select
                                                            class="wide"
                                                            styles={selectStyles}
                                                            options={answers}
                                                            name="answer"
                                                            value={answers.find(option => option.value === exercise?.answer) || null}
                                                            onChange={(option) => setExercise({ ...exercise, answer: option.value })}
                                                            placeholder="Select Answer" />
                                                    </div>
                                                </div>
                                                <div className='col-md-12'>
                                                    <div className="form-group">
                                                        <button type='submit' className='btn-05'>Save question</button>
                                                    </div>
                                                </div>
                                            </form>
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </body>
    )
}

export default CreateLesson