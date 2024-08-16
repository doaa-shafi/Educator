import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ReactPlayer from 'react-player';
import PDF from 'react-pdf-js';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import './StudyCourse.css';
import { axiosPrivate } from '../../api/axios';

const Sidebar = ({ lessons, onSelectItem }) => {
    const [expandedLesson, setExpandedLesson] = useState(null);

    const toggleLesson = (index) => {
        if (expandedLesson === index) {
            setExpandedLesson(null);
        } else {
            setExpandedLesson(index);
        }
    };

    return (
        <div className="sidebar">
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
                                    className="item"
                                    onClick={() => onSelectItem(lesson, item, itemIndex)}
                                >
                                    {item.title}
                                </li>
                            ))}
                            <div
                                className="quiz-link"
                                onClick={() => onSelectItem(lesson, { type: 'quiz', title: 'Quiz', quiz: lesson.quiz })}
                            >
                                Quiz
                            </div>
                        </ol>
                    )}
                </div>
            ))}
        </div>
    );
};


const ContentDisplay = ({ selectedItem, selectedLesson, onCompleteItem, enrollment }) => {
    const baseURL = "http://localhost:7000";
    const [quizAnswers, setQuizAnswers] = useState([]); 
    const [quizResult, setQuizResult] = useState(null);
    const axiosPrivate=useAxiosPrivate()
    const answerMap = {
        'choiceA': 'A',
        'choiceB': 'B',
        'choiceC': 'C',
        'choiceD': 'D'
    };

    useEffect(() => {
        const populateQuiz = async () => {
            if (!enrollment || !selectedLesson) return;
    
            const matchedLesson = enrollment.lessons.find(lesson =>
                lesson.lessonID.toString() === selectedLesson._id.toString()
            );
    
            // Set initial quiz answers from enrollment if they exist
            if (matchedLesson?.quiz?.answers) {
                setQuizAnswers(matchedLesson.quiz.answers);
            }
    console.log(matchedLesson?.quiz?.answers)
            // If the quiz is passed, fetch correct answers and compare them
            if (matchedLesson?.quiz?.passed) {
                try {
                    const res = await axiosPrivate.get(`/lessons/${selectedLesson._id}/quiz`);
                    const correctAnswers = res.data; // Assuming this is the list of correct answers
    console.log(res.data)
                    // Compare the user's answers with the correct answers to create the boolean result array
                    const result = quizAnswers.map((answer, index) => answer === correctAnswers[index]);
    
                    setQuizResult({ passed: true, results: result ,percentage:matchedLesson.quiz.grade});
    
                } catch (error) {
                    console.log(error);
                }
            }
        };
    
        populateQuiz();
        console.log(quizAnswers)
        console.log(quizResult)
    }, [selectedLesson]);
    

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
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    return (
        <div className="content-display">
            <div className="content-window">
                {selectedItem ? (
                    selectedItem.type === 1 ? (
                        <ReactPlayer url={selectedItem.link} width="100%" height="100%" controls />
                    ) : selectedItem.type === 2 ? (
                        <PDF
                            file={encodeURI(`${baseURL}${selectedItem.link}`)}
                            onLoadSuccess={({ numPages }) => console.log(`Loaded ${numPages} pages`)}
                        />
                    ) : selectedItem.type === 'quiz' ? (
                        <div className="quiz-container">
                            <h3>{selectedItem.title}</h3>
                            {selectedItem?.quiz?.map((question, index) => (
                                <div key={index} className="quiz-question">
                                    <p>{question.question}</p>
                                    <div className="quiz-options">
                                        {['choiceA', 'choiceB', 'choiceC', 'choiceD'].map((choiceKey, i) => (
                                            <label key={i} className="quiz-option">
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value={choiceKey}
                                                    checked={quizAnswers[index] === answerMap[choiceKey]}
                                                    onChange={(e) => handleAnswerChange(e, index)}
                                                />
                                                {question[choiceKey]}  {/* Display the choice text */}
                                            </label>
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
                            <button onClick={handleSubmitQuiz} className="submit-quiz-button">
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
            <div className="tabs">
                <button className="tab-button">Questions</button>
                <button className="tab-button">Notes</button>
                {selectedItem && selectedItem.type !== 'quiz' && (
                    <button className="mark-completed-button" onClick={() => onCompleteItem(selectedItem, selectedItem.itemIndex)}>
                        Mark as Completed
                    </button>
                )}
            </div>
        </div>
    );
};



const StudyPage = () => {
    const location = useLocation();
    const courseId = location.pathname.split("/")[2];
    const axiosPrivate = useAxiosPrivate();

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [enrollment, setEnrollment] = useState();
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const getEnrollment = async () => {
            try {
                const res = await axiosPrivate.get(`/enrollments/`, { params: { courseId: courseId } });
                setEnrollment(res.data.enrollment);
                setLessons(res.data.lessons);
            } catch (error) {
                console.log(error);
            }
        };
        getEnrollment();
    }, []);

    const handleSelectItem = (lesson, item, itemIndex) => {
        setSelectedLesson(lesson);
        setSelectedItem({ ...item, itemIndex });
    };

    const handleCompleteItem = async (item, itemIndex) => {
        try {
            await axiosPrivate.patch('/enrollments/', {
                courseId: courseId,
                lessonId: lessons.find(lesson => lesson.title === selectedLesson)._id,
                itemNumber: itemIndex,
            });
            // Fetch updated enrollment data to reflect progress changes
            const res = await axiosPrivate.get(`/enrollments/`, { params: { courseId: courseId } });
            setEnrollment(res.data.enrollment);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="study-page-container">
            <div className="topbar">
                <div className="left">
                    <span className="topbar-title">{enrollment?.course?.title}</span>
                    <span className="topbar-subject">{enrollment?.course?.subject}</span>
                </div>
                <div className="right">
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
                </div>
            </div>
            <div className="study-page">
                <Sidebar
                    lessons={lessons}
                    onSelectItem={handleSelectItem}
                />
                <ContentDisplay
                    selectedItem={selectedItem}
                    selectedLesson={selectedLesson}
                    onCompleteItem={handleCompleteItem}
                    enrollment={enrollment}
                />
            </div>
        </div>
    );
};

export default StudyPage;
