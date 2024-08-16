import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from 'react-router-dom'
import './InstructorDashBoardSideMenue.css'

const InstructorDashBoardSideMenue = () => {
   
    return (

        <div className="instructor-dashboard-side-menue">
            <div className="instructor-dashboard-side-menue-section">
                <div className="instructor-dashboard-side-menue-section-title">Your courses</div>
                <div className="instructor-dashboard-side-menue-section-links">
                    <Link>Opened courses</Link>
                    <Link>Draft courses</Link>
                    <Link>Closed courses</Link>
                </div>
            </div>
            <div className="instructor-dashboard-side-menue-section">
                <div className="instructor-dashboard-side-menue-section-title">Your courses</div>
                <div className="instructor-dashboard-side-menue-section-links">
                    <Link>Opened courses</Link>
                    <Link>Draft courses</Link>
                    <Link>Closed courses</Link>
                </div>
            </div>
        </div>



    )
}

export default InstructorDashBoardSideMenue