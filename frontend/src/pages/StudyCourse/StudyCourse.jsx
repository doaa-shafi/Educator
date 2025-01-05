import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ReactPlayer from 'react-player';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import logo from '../../assets/logo_white.png'
import './StudyCourse.css';

const StudyPage = () => {
    const location = useLocation();
    const courseId = location.pathname.split("/")[2];
    const axiosPrivate = useAxiosPrivate();

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [quizChanged, setQuizChanged] = useState(false)
    const [enrollment, setEnrollment] = useState();
    const [lessons, setLessons] = useState([]);

    const baseURL = "http://localhost:7000";
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizResult, setQuizResult] = useState(null);
    const answerMap = {
        'choiceA': 'A',
        'choiceB': 'B',
        'choiceC': 'C',
        'choiceD': 'D'
    };

    useEffect(() => {
        const getEnrollment = async () => {
            try {
                const res = await axiosPrivate.get(`/enrollments/${courseId}`);
                console.log(res.data)
                setEnrollment(res.data.enrollment);
                setLessons(res.data.lessons);
                setSelectedLesson(res.data.lessons[0])
                setSelectedItem({...res.data.lessons[0].items[0],itemIndex:0})
            } catch (error) {
                console.log(error);
            }
        };
        getEnrollment();
    }, []);

    const [expandedLesson, setExpandedLesson] = useState(null);

    const toggleLesson = (index) => {
        if (expandedLesson === index) {
            setExpandedLesson(null);
        } else {
            setExpandedLesson(index);
        }
    };

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertVisible(true);
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000); // Hide the alert after 3 seconds
    };



    const handleSelectItem = (lesson, item, itemIndex) => {
        setSelectedLesson(lesson);
        setSelectedItem({ ...item, itemIndex });
    };

    const handleCompleteItem = async (item, itemIndex) => {
        console.log(selectedLesson)
        try {
            await axiosPrivate.patch('/enrollments/', {
                courseId: courseId,
                lessonId: selectedLesson._id,
                itemNumber: itemIndex,
            });
            // Fetch updated enrollment data to reflect progress changes
            const res = await axiosPrivate.get(`/enrollments/${courseId}`);
            setEnrollment(res.data.enrollment);
            document.getElementById("progress").scrollIntoView({ behavior: 'smooth' });
            showAlert("Item marked as completed!");
        } catch (error) {
            console.log(error);
        }
    };



    useEffect(() => {
        const populateQuiz = async () => {
            if (!enrollment || !selectedLesson) return;

            const matchedLesson = enrollment.lessons.find(lesson =>
                lesson.lessonID.toString() === selectedLesson._id.toString()
            );

            // Set initial quiz answers from enrollment if they exist
            if (matchedLesson?.quiz?.answers?.length > 0) {
                setQuizAnswers(matchedLesson.quiz.answers);
                console.log(matchedLesson?.quiz?.answers)
                // If the quiz is passed, fetch correct answers and compare them
                if (matchedLesson?.quiz?.passed) {
                    try {
                        const res = await axiosPrivate.get(`/lessons/${selectedLesson._id}/quiz`);
                        const correctAnswers = res.data; // Assuming this is the list of correct answers
                        console.log(res.data)
                        // Compare the user's answers with the correct answers to create the boolean result array
                        const result = matchedLesson?.quiz?.answers.map((answer, index) => answer === correctAnswers[index]);

                        setQuizResult({ passed: true, results: result, percentage: matchedLesson.quiz.grade });
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                setQuizAnswers([])
                setQuizResult(null)

            }

        };

        populateQuiz();
        console.log(quizAnswers)
        console.log(quizResult)
    }, [quizChanged]);


    const handleAnswerChange = (e, questionIndex) => {
        const { value } = e.target;
        console.log(value)
        // Directly map value to "A", "B", "C", or "D"

        setQuizAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[questionIndex] = answerMap[value];
            console.log(updatedAnswers)
            return updatedAnswers;
        });
    };


    const handleSubmitQuiz = async () => {
        try {
            console.log(enrollment.course)
            console.log(selectedLesson)
            const response = await axiosPrivate.patch(`enrollments/submit-quiz`, {
                courseId: enrollment.course,  // Make sure to pass courseId if needed
                lessonId: selectedLesson._id,  // Make sure to pass lessonId if needed
                answers: quizAnswers,
            });

            const result = response.data;
            console.log(result)
            setQuizResult(result);
            // Fetch updated enrollment data to reflect progress changes
            const res = await axiosPrivate.get(`/enrollments/${courseId}`);
            setEnrollment(res.data.enrollment);
            document.getElementById("progress").scrollIntoView({ behavior: 'smooth' });
            showAlert("Quiz submitted successfully!");
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    return (
        <div className="home-01">
            {alertVisible && (
                <div className="custom-alert-01">
                    {alertMessage}
                </div>
            )}
            <div class="sub-header sticky" id="progress">
                <div class="container">
                    <div className="flex-row">
                        <div className="flex-row">
                            <Link to="/" class="logo">
                                <img src={logo} alt="" />
                            </Link>
                            <ul class="main-nav__list">
                                <li>
                                    <Link to={"/instructor-dashboard/draft-courses"}>{enrollment?.course?.title}</Link>
                                </li>
                                <li>
                                    <Link to={"/instructor-dashboard/open-courses"}>{enrollment?.course?.subject}</Link>
                                </li>
                            </ul>
                        </div>
                        <ul className="main-nav__list">
                            <li>
                                <Link to={"/instructor-dashboard/landing-page"}>
                                    {
                                        enrollment?.done === true &&
                                        <span className="certificate" style={{ cursor: "pointer" }} >
                                            <WorkspacePremiumIcon />
                                            <span>Get certificate</span>
                                        </span>
                                    }
                                    {
                                        enrollment?.done === false &&
                                        <span className="certificate">
                                            {`${((enrollment.completedDuration / enrollment.totalDuration) * 100).toFixed(2)}%`}
                                        </span>
                                    }
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div >
                <div className="content-display margin-bottom-20">
                    <div className="content-window">
                        {selectedItem ? (
                            selectedItem.type === 1 ? (
                                <ReactPlayer url={selectedItem.link} width="100%" height="100%" controls />
                            ) : selectedItem.type === 2 ? (
                                <embed src={`${baseURL}${selectedItem.link}`} width="100%" height="100%" />
                                // <PDF
                                //     file={encodeURI(`${baseURL}${selectedItem.link}`)}
                                //     onLoadSuccess={({ numPages }) => console.log(`Loaded ${numPages} pages`)}
                                // />
                            ) : selectedItem.type === 'quiz' ? (
                                <div className="quiz-container">
                                    <h3>{selectedItem.title}</h3>
                                    {selectedItem?.quiz?.map((question, index) => (
                                        <div key={index} className="quiz-question">
                                            <p>{question.question}</p>
                                            <div className="quiz-options">
                                                {['choiceA', 'choiceB', 'choiceC', 'choiceD'].map((choiceKey, i) => (
                                                    <div className="quiz-option">
                                                        <input
                                                            type="radio"
                                                            name={`question-${index}`}
                                                            value={choiceKey}
                                                            checked={quizAnswers[index] === answerMap[choiceKey]}
                                                            onChange={(e) => handleAnswerChange(e, index)}
                                                        />
                                                        <label key={i}>
                                                            {question[choiceKey]}  {/* Display the choice text */}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            {quizResult && quizResult.passed && (
                                                <div
                                                    className={`quiz-comment ${quizResult.results[index] ? 'correct' : 'incorrect'}`}
                                                >
                                                    {question.comment}
                                                </div>
                                            )}
                                        </div>

                                    ))}
                                    <button onClick={handleSubmitQuiz} className="tab-button">
                                        Submit Quiz
                                    </button>
                                    {quizResult && !quizResult.passed && (
                                        <div className="try-again-message">Try again! You need to score at least 75%.</div>
                                    )}
                                </div>
                            ) : null
                        ) : (
                            <div className="placeholder">Select a lesson item to view the content.</div>
                        )}
                    </div>
                    {/* <div className="tabs">
                        <button className="tab-button">Questions</button>
                        <button className="tab-button">Notes</button>
                        {selectedItem && selectedItem.type !== 'quiz' && (
                            <button className="mark-completed-button" onClick={() => handleCompleteItem(selectedItem, selectedItem.itemIndex)}>
                                Mark as Completed
                            </button>
                        )}
                    </div> */}
                </div>
                <div className='row margin-top-10'>
                    <div id="contactInfoContainer" class="theiaStickySidebar margin-bottom-60 ">
                        {lessons.map((lesson, index) => (
                            <div key={index} className="lesson">
                                <h4 className="lesson-title" onClick={() => toggleLesson(index)}>
                                    {lesson.title}
                                    <ArrowDropDownIcon />
                                </h4>
                                {expandedLesson === index && (
                                    <ol className="items-list">
                                        {lesson.items.map((item, itemIndex) => (
                                            <li
                                                key={itemIndex}
                                                className="lessons-nav-item"
                                                onClick={() => handleSelectItem(lesson, item, itemIndex)}
                                            >
                                                {item.title}
                                            </li>
                                        ))}
                                        <div
                                            className="quiz-link"
                                            onClick={() => { handleSelectItem(lesson, { type: 'quiz', title: 'Quiz', quiz: lesson.quiz }); setQuizChanged(!quizChanged) }}
                                        >
                                            Quiz
                                        </div>
                                    </ol>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudyPage;
