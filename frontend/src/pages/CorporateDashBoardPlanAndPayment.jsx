import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png'
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';


const CorporateDashBoardPlanAndPayment = () => {
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate();


  const [corporate, setCorporate] = useState()
  const [traineeAdded, setTraineeAdded] = useState(false)
  const [show, setShow] = useState()

  const [name, setName] = useState("")
  const [validName, setValidName] = useState(true)
  const [errorName, setErrorName] = useState(true)


  const [error, setError] = useState("")

  useEffect(() => {
    const getCorporate = async () => {
      try {
        const res = await axiosPrivate.get(`/corporates`);
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
          <h6 style={{ color:  'red' }}>
            Password must be at least 8 characters
          </h6>
          <h6 style={{ color : 'red' }}>
            Password must contain at least one uppercase letter
          </h6>
          <h6 style={{ color: 'red' }}>
            Password must contain at least one lowercase letter
          </h6>
          <h6 style={{ color : 'red' }}>
            Password must contain at least one number
          </h6>
          <h6 style={{ color : 'red' }}>
            Password must contain at least one special character (#?!@$%^&*-)
          </h6>
          <button class="btn-05" >confirm</button>
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
                    <li >
                      <Link to={'/corporate-dashboard/teams'}>Teams</Link>
                    </li>
                    <li class="active">
                      <Link to={'/corporate-dashboard/plan&payment'}>Plan & Payment</Link>
                    </li>
                  </ul>
                }
                <div className="flex-column">
                  {!isDivVisible &&
                    <ul className="main-nav__list">
                      <li class="active">
                        <Link to={'/corporate-dashboard/plan&payment'}>Plan & Payment</Link>
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
                      <li >
                        <Link to={'/corporate-dashboard/teams'}>Teams</Link>
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
                    <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Subscription Due Date</h5>
                    <h4 class="mb-3" data-plugin="counterup">{corporate?.teams.length}</h4>
                    <span class="badge badge-success mr-1"> +11% </span> <span class="text-muted">From previous period</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 margin-bottom-20">
                <div class="dashboard-card">
                  <div class="card-body">
                    <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Subscription Due Date</h5>
                    <h4 class="mb-3" data-plugin="counterup">{corporate?.teams.length}</h4>
                    <span class="badge badge-success mr-1"> +11% </span> <span class="text-muted">From previous period</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 margin-bottom-20">
                <div class="dashboard-card">
                  <div class="card-body">
                    <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">{corporate?.plan === "Standard" ? "Standard Plan -> your current plan" : "Standard Plan"}</h5>
                    <ul class="price-list">
                      <li>
                        <CheckIcon className='icon-01' /><span>Access to beginner and intermediate courses </span>
                      </li>
                      <li>
                        <CloseIcon className='icon-01' /><span>No access to advanced courses</span>
                      </li>
                      <li>
                        <PriorityHighIcon className='icon-01' /><span>You can add up to 20 trainee only</span>
                      </li>
                      <li >
                        <CloseIcon className='icon-01' /><span>Cannot create sub-teams</span>
                      </li>
                      <li>
                        <CheckIcon className='icon-01' /><span>Assign course to one trainee or the whole team</span>
                      </li>
                      <li>
                        <CloseIcon className='icon-01' /><span>Cannot assign course to sub-team</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 margin-bottom-20">
                <div class="dashboard-card">
                  <div class="card-body">
                    <h5 class="text-muted text-uppercase mt-0 margin-bottom-10"> {corporate?.plan === "Premium" ? "Premium Plan -> your current plan" : "Premium Plan"}</h5>
                    <ul class="price-list">
                      <li>
                        <CheckIcon className='icon-01' /><span>Access to beginner and intermediate courses</span>
                      </li>
                      <li>
                        <CheckIcon className='icon-01' /><span>Access to advanced courses</span>
                      </li>
                      <li>
                        <AllInclusiveIcon className='icon-01' /><span>No limit on number of added trainees</span>
                      </li>
                      <li>
                        <CheckIcon className='icon-01' /><span>create sub-teams</span>
                      </li>
                      <li>
                        <CheckIcon className='icon-01' /><span>Assign course to one trainee or the whole team</span>
                      </li>
                      <li>
                        <CheckIcon className='icon-01' /><span>Assign course to sub-team</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='button-row'>
            <button class="btn-04" onClick={() => setShow(true)}>{corporate?.plan == "Standard" ? "Upgrade your plan" : "Downgrade to Standard"}</button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CorporateDashBoardPlanAndPayment