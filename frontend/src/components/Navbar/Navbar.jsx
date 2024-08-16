import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import './Navbar.css'

export default function Navbar() {
    const [menuClick, setMenuClick] = useState(false)
    const [searchClick, setSearchClick] = useState(false)
    const [mobile, setMobile] = useState(false)
    const show = () => {
        if (window.innerWidth <= 1300) {
            setMobile(true)
        }
        else {
            setMobile(false)
        }
    }
    window.addEventListener('resize', show)
    useEffect(() => {
        show();
    }, [])
    return (
        <div className='Navbar'>

            {mobile && <div className="nav-item">{menuClick ? <CloseIcon /> : <MenuIcon />}</div>}
            <div className="nav-left">
                <div className="nav-item logo"><CastForEducationIcon className='nav-logo-icon' /> <span className='nav-logo-name'>Educator</span></div>
                {!mobile && <div className="nav-item">Categories<ExpandMoreIcon /></div>}
            </div>
            {!mobile &&
                <div className='navbar-search'>
                    <SearchIcon className='search-icon' />
                    <input className='search-input' type="text" name="" id="" placeholder='Search...' />
                </div>}
            {mobile && <div className='nav-item'><SearchIcon /></div>}

            {!mobile &&
                <div className='links'>
                    <div className='nav-item nav-link'><Link to='/for-enterprise' className='nav-links' >Enterprise</Link></div>
                    <div className='nav-item nav-link'><Link to='/teach-with-us' className='nav-links'>Teach with us</Link></div>
                    <div className='nav-item nav-link'><Link to='/login' className='nav-links' >Login</Link></div>
                    <div className='nav-item nav-link'><Link to='/sign-up' className='nav-links' >Sign Up</Link></div>
                </div>
            }

        </div>
    )
}
