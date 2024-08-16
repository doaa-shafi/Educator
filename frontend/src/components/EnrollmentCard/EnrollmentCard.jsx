import React from 'react';
import {Link} from 'react-router-dom'
import ReactPlayer from 'react-player';
import './EnrollmentCard.css'; 
import Stars from '../Stars/Stars'; 

const EnrollmentCard = ({ enrollment }) => {
    

    return (
        <Link className="enrollment-card" to={`/course/${enrollment.course._id}`}>
            <div className="card-header">
                <h3 className="course-title">{enrollment.course.title}</h3>
            </div>
            <div className="card-content">
                <ReactPlayer url={enrollment.course.previewVideo} width="100%" height="200px" />
                <div className="progress-bar">
                    <div
                        className="progress-bar-filled"
                        style={{ width: `${(enrollment.completedDuration/enrollment.totalDuration)*100}%` }}
                    ></div>
                </div>
                <div className="rating-section">
                    <Stars value={enrollment.myRating.rating} /> 
                </div>
            </div>
        </Link>
    );
};

export default EnrollmentCard;
