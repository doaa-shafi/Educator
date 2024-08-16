import React from 'react'
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './CorporateDashBoard.css';
const CorporateDashBoard = () => {
    return (

        <div>
            <Navbar></Navbar>
            <div className='corporate-db'>
                <div className="corporate-db-side-menue">
                    <div className="section">
                        <div className="section-title">Your Trainees</div>
                        <div className="section-links">
                            <Link to='/for-enterprise'></Link>
                        </div>
                    </div>
                    <div className="section">
                        <div className="section-title">Payment</div>
                        <div className="section-links">
                            <Link to='/for-enterprise'></Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CorporateDashBoard