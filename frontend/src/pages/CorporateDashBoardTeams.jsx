import React, { useState, useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const CorporateDashBoardTeams = () => {
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate();

    const handleRowClick = (teamId) => {
        navigate(`/team/${teamId}`);
    };
    const [corporate, setCorporate] = useState()
    const [traineeAdded, setTraineeAdded] = useState(false)
    const [show, setShow] = useState()

    const [name, setName] = useState("")
    const [validName, setValidName] = useState(true)
    const [errorName, setErrorName] = useState(true)


    const [error, setError] = useState("")



    const validateTeamName = () => {
        if ((name.length > 2 && name.length < 21) || name === "") {
            setValidName(true)
        } else {
            setValidName(false)
            setErrorName("Team name should contain 3-20 characters")
        }
        setError(false)
    }




    useEffect(() => {
        const getCorporate = async () => {
            try {
                const res = await axiosPrivate.get(`/corporates/teams`);
                setCorporate(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        getCorporate();
    }, [traineeAdded]);

    const handleAdd = async (e) => {
        e.preventDefault()
        if (name === "") {
            setError("Please enter all team name")
        }

        else if (!validName) {
            setError("Please enter valid name")
        }

        else {
            try {
                const response = await axiosPrivate.post('/teams/', { teamName: name })
                setShow(false)
                setTraineeAdded(!traineeAdded)

            } catch (err) {
                console.log(err)
                if (!err?.response) {
                    setError('No Server Response');
                }
                else {
                    const error = err.response.data.error
                    setError(error)
                }

            }
        }
    }
    const [isDivVisible, setIsDivVisible] = useState(false);
    const [toggleList, setToggleList] = useState()

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 767) {
                setIsDivVisible(false);
            } else {
                setIsDivVisible(true);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleIconClick = () => {
        setToggleList(!toggleList) // Toggle visibility on small screens
    };

    return (
        <div class="teach-with-us">
            <Modal
                className="modal-content"
                isOpen={show}
                onRequestClose={() => setShow(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent overlay
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
                        opacity: 1
                    }
                }}
            >
                <div className="preview-content">
                    <h3>Create New Team</h3>
                    <form action="submit">
                        <div className="input">
                            <label className="label1">Team name</label>
                            <input className="in" type='text' onChange={(e) => setName(e.target.value)} value={name} onBlur={()=>validateTeamName()} />
                            {validName === false && <h6 style={{ color: 'red' }}>{errorName}</h6>}
                        </div>
                        {error !== "" && <p>{error}</p>}
                        <button type="submit" class="btn-05" onClick={handleAdd}>Add</button>
                    </form>
                </div>
            </Modal>
            <div class="wrapp-content">
                <header className="wrapp-header">
                    <div class="main-nav">
                        <div class="container">
                            <div className="flex-row">
                                <Link to="/" class="logo">
                                    <img src={logo} alt="" />
                                </Link>
                                {isDivVisible &&
                                    <ul class="main-nav__list">
                                        <li>
                                            <Link to={'/corporate-dashboard/trainees'}>Trainees</Link>
                                        </li>
                                        <li class="active">
                                            <Link to={'/corporate-dashboard/teams'}>Teams</Link>
                                        </li>
                                        <li>
                                            <Link to={'/corporate-dashboard/plan&payment'}>Plan & Payment</Link>
                                        </li>
                                    </ul>
                                }
                                <div className="flex-column">
                                    {!isDivVisible &&
                                        <ul className="main-nav__list">
                                            <li class="active">
                                                <Link to={'/corporate-dashboard/teams'}>Teams</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>

                                    }
                                    {!isDivVisible && toggleList &&
                                        <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                            <li>
                                                <Link to={'/corporate-dashboard/trainees'}>Trainees</Link>
                                            </li>
                                            <li>
                                                <Link to={'/corporate-dashboard/plan&payment'}>Plan & Payment</Link>
                                            </li>
                                        </ul>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main class="content-row">
                    <div class="container margin-top-40">
                        <div class="row dashboard-row">
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div class="dashboard-card">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Teams</h5>
                                        <h4 class="mb-3" data-plugin="counterup">{corporate?.teams.length}</h4>
                                        <span class="badge badge-success mr-1"> +11% </span> <span class="text-muted">From previous period</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div class="dashboard-card">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Enrollments</h5>
                                        <h4 class="mb-3">$<span data-plugin="counterup">46,782</span></h4>
                                        <div className="flex-row-03">
                                            <WatchLaterIcon style={{ color: '#a0ce4e' }}></WatchLaterIcon>
                                            <h6 class="text-muted">total hours</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div class="dashboard-card">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Total completed hours</h5>
                                        <h4 class="mb-3">$<span data-plugin="counterup">15.9</span></h4>
                                        <span class="badge badge-warning mr-1"> 0% </span> <span class="text-muted">From previous period</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 margin-bottom-20">
                                <div class="dashboard-card">
                                    <div class="card-body">
                                        <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">avarage completed Hours / day</h5>
                                        <h4 class="mb-3" data-plugin="counterup">1,890</h4>
                                        <span class="badge badge-success mr-1"> +89% </span> <span class="text-muted">Last year</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='button-row'>
                        <button class="btn-04" onClick={() => setShow(true)}>Add New Team</button>
                    </div>
                    <div class="container">
                        <div class="row dashboard-row margin-bottom-97">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="card-title overflow-hidden">Teams</h4>
                                    <div className="table-responsive">
                                        <table className="table table-centered table-hover table-xl mb-0" id="recent-orders">
                                            <thead>
                                                <tr>
                                                    <th><h4>Name</h4></th>
                                                    <th ><h4>Trainees</h4></th>
                                                    <th ><h4>Courses</h4></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {corporate?.teams.length > 0 && corporate?.teams.map((team, index) => {
                                                    return (
                                                        <tr
                                                            key={index}
                                                            onClick={() => handleRowClick(team._id)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <td><h5>{team.name}</h5></td>
                                                            <td className="text-truncate"><h5>{team.trainees.length}</h5></td>
                                                            <td className="text-truncate"><h5>{team.courses.length}</h5></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        {corporate?.teams?.length === 0 && <div className='no-data'>There is no teams</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default CorporateDashBoardTeams