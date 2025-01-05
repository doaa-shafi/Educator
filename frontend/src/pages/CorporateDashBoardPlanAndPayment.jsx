import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'react-modal';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import logo from '../assets/logo_dark.png'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EventIcon from '@mui/icons-material/Event';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';


const CorporateDashBoardPlanAndPayment = () => {
  const axiosPrivate = useAxiosPrivate()
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);



  const [corporate, setCorporate] = useState()
  const [show, setShow] = useState()
  const [show2, setShow2] = useState()


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
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create a PaymentMethod
    const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (paymentError) {
      setError(paymentError.message);
      setIsProcessing(false);
      return;
    }

    // Send the details to the backend to create the subscription
    try {
      const response = await axiosPrivate.patch('/corporates/renew', {
        paymentMethodId: paymentMethod.id, // Stripe token to be passed to the backend
      });

      setShow(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }

    setIsProcessing(false);
  };

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
          <h6 style={{ color: 'red' }}>
            Password must be at least 8 characters
          </h6>
          <h6 style={{ color: 'red' }}>
            Password must contain at least one uppercase letter
          </h6>
          <h6 style={{ color: 'red' }}>
            Password must contain at least one lowercase letter
          </h6>
          <h6 style={{ color: 'red' }}>
            Password must contain at least one number
          </h6>
          <h6 style={{ color: 'red' }}>
            Password must contain at least one special character (#?!@$%^&*-)
          </h6>
          <button class="btn-05" >confirm</button>
        </div>
      </Modal>
      <Modal
        className="modal-content"
        isOpen={show2}
        onRequestClose={() => setShow2(false)}
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
          <form onSubmit={handleSubmit}>

            <CardElement options={{ hidePostalCode: true }} />
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit" className='btn-01' disabled={!stripe || isProcessing}>
              {isProcessing ? 'Processing...' : 'Subscribe'}
            </button>

          </form>
        </div>
      </Modal>
      <div class="wrapp-content">
        <header className="wrapp-header dashboard-header">
          <div class="main-nav">
            <div class="container">
              <div className="flex-row padding-around">
                <Link to="/" class="logo">
                  <img src={logo} alt="" />
                </Link>
                {isDivVisible &&
                  <ul class="main-nav__list">
                    <li>
                      <Link to={'/corporate-dashboard/trainees'}>Trainees</Link>
                    </li>
                    <li>
                      <Link to={'/corporate-dashboard/courses'}>Courses Registry</Link>
                    </li>
                    <li class="active">
                      <Link to={'/corporate-dashboard/plan&payment'}>Plan & Payment</Link>
                    </li>
                  </ul>
                }
                {!isDivVisible &&
                  <div className="flex-column">

                    <ul className="main-nav__list">
                      <li class="active">
                        <Link to={'/corporate-dashboard/plan&payment'}>Plan & Payment</Link>
                      </li>
                      <li>
                        {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                      </li>
                    </ul>
                    {toggleList &&
                      <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                        <li>
                          <Link to={'/corporate-dashboard/trainees'}>Trainees</Link>
                        </li>
                        <li>
                          <Link to={'/corporate-dashboard/courses'}>Courses Registry</Link>
                        </li>
                      </ul>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </header>
        <main class="content-row">
          <div class="container margin-top-40">
            {corporate?.status === "Pending" &&
              <>
                <div className="row error-02 margin-bottom-20">
                  <p>
                    Your corporate account is currently pending due to a subscription renewal failure. Trainees cannot access their courses until the subscription is renewed successfully.
                  </p>
                  <div className="button-row">
                        <button
                            className="btn-04"
                            onClick={() => setShow2(true)}
                        >
                            renew
                        </button>
                    </div>
                </div>
              </>
            }
            <div class="row dashboard-row">
              <div className="col-lg-6 col-md-12 margin-bottom-20">
                <div class="dashboard-card">
                  <div class="card-body">
                    <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Subscription Due Date</h5>
                    <div className='flex-row-03'>
                      <EventIcon className='icon-03'/>{' '}
                      <h6 className="text-muted">
                        kkkkk
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 margin-bottom-20">
                <div class="dashboard-card">
                  <div class="card-body">
                    <h5 class="text-muted text-uppercase mt-0 margin-bottom-10">Amount To Pay</h5>
                    <div className='flex-row-03'>
                      <AttachMoneyIcon className='icon-03'/>{' '}
                      <h6 className="text-muted">
                        kkkkk
                      </h6>
                    </div>
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