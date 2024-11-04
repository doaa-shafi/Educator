import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import logo from '../assets/logo_dark.png'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import dayjs from 'dayjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the plugin with Chart.js
Chart.register(ChartDataLabels);

const InstructorDashBoardWallet = () => {
    const { auth } = useAuth()
    const axiosPrivate = useAxiosPrivate()
    const [instructor, setInstructor] = useState()
    const [transactions, setTransactions] = useState([])
    const [revenue, setRevenue] = useState()

    const [showTransactionsActions, setShowTransactionsActions] = useState(false)
    const [showRevenueOptions,setShowRevenueOptions]=useState(false)
    const [revenueStatisticsOption, setRevenueStatisticsOption] = useState("day")

    useEffect(() => {
        const getPayments = async () => {
            try {
                const res = await axiosPrivate.get(`/payments/`);
                setTransactions(res.data)
                console.log(res.data)
                let revenue = res.data.reduce((total, trans) => total + trans.amount, 0);
                setRevenue(revenue);
            } catch (error) {
                console.error(error);
                setTransactions([]); // Ensure courses is set to an empty array on error
            }
        };

        getPayments();
    }, []);
    const totalAmountByCourse = useMemo(() => {
        return transactions.reduce((acc, transaction) => {
            const courseId = transaction.courseId.title;
            acc[courseId] = (acc[courseId] || 0) + transaction.amount;
            return acc;
        }, {});
    }, [transactions]);

    // Aggregate by Date (Day, Month, Year)
    const totalAmountByDay = useMemo(() => {
        return transactions.reduce((acc, transaction) => {
            const day = dayjs(transaction.createdAt).format('YYYY-MM-DD');
            acc[day] = (acc[day] || 0) + transaction.amount;
            return acc;
        }, {});
    }, [transactions]);

    const totalAmountByMonth = useMemo(() => {
        return transactions.reduce((acc, transaction) => {
            const month = dayjs(transaction.createdAt).format('YYYY-MM');
            acc[month] = (acc[month] || 0) + transaction.amount;
            return acc;
        }, {});
    }, [transactions]);

    const totalAmountByYear = useMemo(() => {
        return transactions.reduce((acc, transaction) => {
            const year = dayjs(transaction.createdAt).format('YYYY');
            acc[year] = (acc[year] || 0) + transaction.amount;
            return acc;
        }, {});
    }, [transactions]);

    // Prepare data for Chart.js
    const prepareChartData = (data, label) => {
        return {
            labels: Object.keys(data),
            datasets: [
                {
                    label: label,
                    data: Object.values(data),
                },
            ],
        };
    };

    const options = {
        responsive: true,
        indexAxis: 'y', // Makes the chart horizontal
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            datalabels: {
                anchor: 'start',
                align: 'end',
                offset: 0,
                formatter: (value, context) => {
                    return context.chart.data.labels[context.dataIndex];
                },
                color: '#333',
                font: {
                    size: 13,
                    weight: 200,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    useEffect(() => {
        const getInstructor = async () => {
            try {
                const res = await axiosPrivate.get(`/instructors/?includedCourses=none`);
                setInstructor(res.data.instructor);
            } catch (error) {
                console.error(error);
            }
        };

        getInstructor();
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
                            <div class="col-lg-2">
                                <div class="card">
                                    <div class="card-body">
                                        <div className="flex-row padding-bottom-10">
                                            <h4 class="card-title d-inline-block">Wallet</h4>
                                            <MoreVertIcon />
                                        </div>
                                        <div className="amount-01">
                                            <h2 >${instructor?.wallet}</h2>
                                        </div>
                                        <div class="row text-center mt-4">
                                            <div class="col-12">
                                                {instructor?.wallet > 0 ?
                                                    <h4>Withdraw</h4> :
                                                    <h4>You cannot withdraw money under $</h4>
                                                }
                                                <p class="text-muted mb-0">Total withdrawed money : {revenue - instructor?.wallet}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5">
                                <div class="card">
                                    <div class="card-body">
                                        <div className="flex-row padding-bottom-10">
                                            <h4 class="card-title d-inline-block">Revenue Per Course</h4>
                                            <MoreVertIcon />
                                        </div>
                                        <Bar data={prepareChartData(totalAmountByCourse, 'Total Revenue per Course')} options={options} />

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

                            <div class="col-lg-5">
                                <div class="card">
                                    <div class="card-body">
                                        <div className="flex-row padding-bottom-10">
                                            <h4 class="card-title d-inline-block">Revenue Per Day</h4>
                                            <div className="flex-column">
                                                <span onClick={() => setShowRevenueOptions(!showRevenueOptions)}>
                                                    <MoreVertIcon />
                                                </span>
                                                {showRevenueOptions &&
                                                    <ul className={`main-nav__list_3`}>
                                                        <li onClick={()=>setRevenueStatisticsOption("day")}>
                                                            Revenue Per Day
                                                        </li>
                                                        <li onClick={()=>setRevenueStatisticsOption("month")}>
                                                            Revenue Per Month
                                                        </li>
                                                        <li onClick={()=>setRevenueStatisticsOption("year")}>
                                                            Revenue Per Year
                                                        </li>
                                                    </ul>
                                                }
                                            </div>
                                        </div>
                                        {revenueStatisticsOption === "day" && <Bar data={prepareChartData(totalAmountByDay, 'Total Revenue per Day')} />}
                                        {revenueStatisticsOption === "month" && <Bar data={prepareChartData(totalAmountByMonth, 'Total Revenue per Month')} />}
                                        {revenueStatisticsOption === "year" && <Bar data={prepareChartData(totalAmountByYear, 'Total Revenue per Year')} />}
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
                                        <div className="flex-row padding-bottom-10">
                                            <h4 class="card-title overflow-hidden">All Transactions</h4>
                                            <div className="flex-column">
                                                <span onClick={() => setShowTransactionsActions(!showTransactionsActions)}>
                                                    Sort By <MoreVertIcon />
                                                </span>
                                                {showTransactionsActions &&
                                                    <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                                        <li>
                                                            Newest
                                                        </li>
                                                        <li >
                                                            Oldest
                                                        </li>
                                                        <li>
                                                            Highest Amount
                                                        </li>
                                                        <li>
                                                            Lowest Amount
                                                        </li>

                                                    </ul>
                                                }
                                            </div>

                                        </div>
                                        <div class="table-responsive">
                                            <table
                                                class="table table-borderless table-hover table-centered table-nowrap mb-0">
                                                <tbody>
                                                    {transactions.map((transaction, index) =>
                                                        <tr>
                                                            <td>
                                                                <h5 class="font-size-15 mb-1 font-weight-normal">{format(new Date(transaction.createdAt), 'MMMM do, yyyy')}</h5>
                                                                <span class="text-muted font-size-12">Date</span>
                                                            </td>
                                                            <td>
                                                                <h5 class="font-size-15 mb-1 font-weight-normal">{transaction.courseId.title}</h5>
                                                                <span class="text-muted font-size-12">Course</span>
                                                            </td>
                                                            <td>
                                                                <h5 class="font-size-15 mb-1 font-weight-normal">$ {transaction.amount}</h5>
                                                                <span class="text-muted font-size-12">Amount</span>
                                                            </td>
                                                            {transaction.payerId.__t === "IndividualTrainee" &&
                                                                <td>
                                                                    <span class="badge p-2 type-01"><h5 style={{ "marginBottom": '0px', color: "black" }}>{transaction.payerId.__t}</h5></span>
                                                                </td>
                                                            }
                                                            {transaction.payerId.__t === "Corporate" &&
                                                                <td>
                                                                    <span class="badge p-2 type-02"><h5 style={{ "marginBottom": '0px', color: "black" }}>{transaction.payerId.__t}</h5></span>
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