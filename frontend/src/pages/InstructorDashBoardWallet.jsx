import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import logo from '../assets/logo_dark.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { format } from 'date-fns';

const InstructorDashBoardWallet = () => {
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const [Transactions, setTransactions] = useState([])
    const [revenue,setRevenue]=useState()

    useEffect(() => {
        const getPayments = async () => {
            try {
                const res = await axiosPrivate.get(`/payments/`);
                setTransactions(res.data)
                let revenue = res.data.reduce((total, trans) => total + trans.amount, 0);
                setRevenue(revenue);
            } catch (error) {
                console.error(error);
                setTransactions([]); // Ensure courses is set to an empty array on error
            }
        };

        getPayments();
    }, []);

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
        <div class='teach-with-us'>
            <div class="wrapp-content">
                <div className="wrapp-header">
                    <div class="main-nav">
                        <div class="container">
                            <div className="flex-row">
                                <Link to="/" class="logo">
                                    <img src={logo} alt="" />
                                </Link>
                                {isDivVisible &&
                                    <ul class="main-nav__list">
                                        <li >
                                            <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                                        </li>
                                        <li >
                                            <Link to={'/instructor-dashboard/open-courses'}>Open Courses</Link>
                                        </li>
                                        <li>
                                            <Link to={'/instructor-dashboard/closed-courses'}>Closed Courses</Link>
                                        </li>
                                        <li class="active">
                                            <Link to={'/instructor-dashboard/wallet'}>Wallet</Link>
                                        </li>
                                        <li>
                                            <Link to={'/instructor-dashboard/landing-page'}>Landing page</Link>
                                        </li>
                                    </ul>
                                }
                                <div className="flex-column">
                                    {!isDivVisible &&
                                        <ul className="main-nav__list">
                                            <li class="active">
                                                <Link to={'/instructor-dashboard/wallet'}>Wallet</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>

                                    }
                                    {!isDivVisible && toggleList &&
                                        <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                            <li>
                                                <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                                            </li>
                                            <li >
                                                <Link to={'/instructor-dashboard/open-courses'}>Open Courses</Link>
                                            </li>
                                            <li>
                                                <Link to={'/instructor-dashboard/closed-courses'}>Closed Courses</Link>
                                            </li>
                                            <li>
                                                <Link to={'/instructor-dashboard/landing-page'}>Landing page</Link>
                                            </li>

                                        </ul>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="page-content padding-top-33">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-xl-3 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <i class="bx bx-layer float-right m-0 h2 text-muted"></i>
                                        <h6 class="text-muted text-uppercase mt-0">Total Enrollments</h6>
                                        <h3 class="mb-3" data-plugin="counterup">1,587</h3>
                                        <span class="badge badge-success mr-1"> +11% </span> <span class="text-muted">From previous period</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <i class="bx bx-dollar-circle float-right m-0 h2 text-muted"></i>
                                        <h6 class="text-muted text-uppercase mt-0">Revenue</h6>
                                        <h3 class="mb-3">$<span data-plugin="counterup">{revenue}</span></h3>
                                        <span class="badge badge-danger mr-1"> -29% </span> <span class="text-muted">From previous period</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <i class="bx bx-bx bx-analyse float-right m-0 h2 text-muted"></i>
                                        <h6 class="text-muted text-uppercase mt-0">Average Price</h6>
                                        <h3 class="mb-3">$<span data-plugin="counterup">15.9</span></h3>
                                        <span class="badge badge-warning mr-1"> 0% </span> <span class="text-muted">From previous period</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card">
                                    <div class="card-body">
                                        <i class="bx bx-basket float-right m-0 h2 text-muted"></i>
                                        <h6 class="text-muted text-uppercase mt-0">Product Sold</h6>
                                        <h3 class="mb-3" data-plugin="counterup">1,890</h3>
                                        <span class="badge badge-success mr-1"> +89% </span> <span class="text-muted">Last year</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="margin-top-30"></div>
                        <div class="row">
                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown float-right position-relative">
                                            <a href="#" class="dropdown-toggle h4 text-muted" data-toggle="dropdown"
                                                aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <ul class="dropdown-menu dropdown-menu-right">
                                                <li><a href="#" class="dropdown-item">Action</a></li>
                                                <li><a href="#" class="dropdown-item">Another action</a></li>
                                                <li><a href="#" class="dropdown-item">Something else here</a></li>
                                                <li class="dropdown-divider"></li>
                                                <li><a href="#" class="dropdown-item">Separated link</a></li>
                                            </ul>
                                        </div>
                                        <h4 class="card-title d-inline-block">Daily Sales</h4>

                                        <div id="morris-donut-example" class="morris-chart" style={{ height: "260px" }}></div>

                                        <div class="row text-center mt-4">
                                            <div class="col-6">
                                                <h4>5,459</h4>
                                                <p class="text-muted mb-0">Total Sales</p>
                                            </div>
                                            <div class="col-6">
                                                <h4>18</h4>
                                                <p class="text-muted mb-0">Open Compaign</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown float-right position-relative">
                                            <a href="#" class="dropdown-toggle h4 text-muted" data-toggle="dropdown"
                                                aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <ul class="dropdown-menu dropdown-menu-right">
                                                <li><a href="#" class="dropdown-item">Action</a></li>
                                                <li><a href="#" class="dropdown-item">Another action</a></li>
                                                <li><a href="#" class="dropdown-item">Something else here</a></li>
                                                <li class="dropdown-divider"></li>
                                                <li><a href="#" class="dropdown-item">Separated link</a></li>
                                            </ul>
                                        </div>
                                        <h4 class="card-title d-inline-block">Statistics</h4>

                                        <div id="morris-bar-example" class="morris-chart" style={{ height: "260px" }}></div>

                                        <div class="row text-center mt-4">
                                            <div class="col-6">
                                                <h4>$1875.54</h4>
                                                <p class="text-muted mb-0">Revenue</p>
                                            </div>
                                            <div class="col-6">
                                                <h4>541</h4>
                                                <p class="text-muted mb-0">Total Offers</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown float-right position-relative">
                                            <a href="#" class="dropdown-toggle h4 text-muted" data-toggle="dropdown"
                                                aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <ul class="dropdown-menu dropdown-menu-right">
                                                <li><a href="#" class="dropdown-item">Action</a></li>
                                                <li><a href="#" class="dropdown-item">Another action</a></li>
                                                <li><a href="#" class="dropdown-item">Something else here</a></li>
                                                <li class="dropdown-divider"></li>
                                                <li><a href="#" class="dropdown-item">Separated link</a></li>
                                            </ul>
                                        </div>
                                        <h4 class="card-title d-inline-block">Total Revenue</h4>

                                        <div id="morris-line-example" class="morris-chart" style={{ height: "260px" }}></div>

                                        <div class="row text-center mt-4">
                                            <div class="col-6">
                                                <h4>$7841.12</h4>
                                                <p class="text-muted mb-0">Total Revenue</p>
                                            </div>
                                            <div class="col-6">
                                                <h4>17</h4>
                                                <p class="text-muted mb-0">Open Compaign</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="margin-top-30"></div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown float-right position-relative">
                                            <a href="#" class="dropdown-toggle h4 text-muted" data-toggle="dropdown"
                                                aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <ul class="dropdown-menu dropdown-menu-right">
                                                <li><a href="#" class="dropdown-item">Action</a></li>
                                                <li><a href="#" class="dropdown-item">Another action</a></li>
                                                <li><a href="#" class="dropdown-item">Something else here</a></li>
                                                <li class="dropdown-divider"></li>
                                                <li><a href="#" class="dropdown-item">Separated link</a></li>
                                            </ul>
                                        </div>
                                        <h4 class="card-title overflow-hidden">Total Transactions</h4>
                                        <p class="card-subtitle mb-4 font-size-13 overflow-hidden">Transaction period from 21 July to 25 Aug
                                        </p>
                                        <div class="table-responsive">
                                            <table
                                                class="table table-borderless table-hover table-centered table-nowrap mb-0">
                                                <tbody>
                                                    {Transactions.map((Transaction, index) =>
                                                        <tr>
                                                            <td>
                                                                <h5 class="font-size-15 mb-1 font-weight-normal">{format(new Date(Transaction.createdAt), 'MMMM do, yyyy')}</h5>
                                                                <span class="text-muted font-size-12">Date</span>
                                                            </td>
                                                            <td>
                                                                <h5 class="font-size-15 mb-1 font-weight-normal">{Transaction.courseId.title}</h5>
                                                                <span class="text-muted font-size-12">Course</span>
                                                            </td>
                                                            <td>
                                                                <h5 class="font-size-15 mb-1 font-weight-normal">$ {Transaction.amount}</h5>
                                                                <span class="text-muted font-size-12">Amount</span>
                                                            </td>
                                                            {Transaction.payerId.__t === "IndividualTrainee" &&
                                                                <td>
                                                                    <span class="badge p-2 type-01"><h5 style={{ "marginBottom": '0px', color: "black" }}>{Transaction.payerId.__t}</h5></span>
                                                                </td>
                                                            }
                                                            {Transaction.payerId.__t === "Corporate" &&
                                                                <td>
                                                                    <span class="badge p-2 type-02"><h5 style={{ "marginBottom": '0px', color: "black" }}>{Transaction.payerId.__t}</h5></span>
                                                                </td>
                                                            }
                                                        </tr>)}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="margin-top-30"></div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default InstructorDashBoardWallet