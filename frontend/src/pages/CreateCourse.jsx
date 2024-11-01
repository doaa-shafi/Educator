import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import axios from 'axios'
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import nopreviewavailable from '../assets/no-preview-available.png'
import logo from '../assets/logo_white.png'
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import useCategory from '../hooks/useCategory';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DeleteIcon from '@mui/icons-material/Delete';

const CreateCourse = () => {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const categories = useCategory()
    const courseId = location.pathname.split("/")[2];

    const [course, setCourse] = useState({});
    const [reqInputs, setReqInputs] = useState([]);
    const [outInputs, setOutInputs] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [newLesson, setNewLesson] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [lessonAdded, setLessonAdded] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [priceTiers, setPriceTiers] = useState([]);
    const [exchangeRates, setExchangeRates] = useState({});

    const [unSavedChanges, setUnSavedChanges] = useState(0)
    const [previewVideoChanged, setPreviewVideoChanged] = useState(false)
    
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (unSavedChanges > 0) {
                const confirmationMessage = "You have unsaved changes. Are you sure you want to leave?";
                event.preventDefault();
                event.returnValue = confirmationMessage; // Only a generic message is shown by modern browsers
                return confirmationMessage;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [unSavedChanges]);

    const showSuccess = (message) => {
        setAlertMessage(message);
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 2000); // Hide the alert after 3 seconds
    };

    const showError = (message) => {
        setAlertMessage(message);
        setShowErrorAlert(true);
    };

    useEffect(() => {
        const getCourse = async () => {
            try {
                const res = await axiosPrivate.get(`/courses/draft/${courseId}`);
                setCourse(res.data)
                setReqInputs(res.data.requirements || [" "])
                setOutInputs(res.data.learnings || [" "])
            } catch (error) {
                console.log(error)
            }
        };
        getCourse();
    }, [])


    const handleAddReqInput = () => {
        setReqInputs([...reqInputs, '']);
    };


    const handleDeleteReqInput = (index) => {
        const updatedReqInputs = reqInputs.filter((_, i) => i !== index);
        setReqInputs(updatedReqInputs);
        setCourse((prevCourse) => ({
            ...prevCourse,
            requirements: updatedReqInputs,
        }));
        setUnSavedChanges(unSavedChanges + 1);
    };

    const handleReqInputChange = (index, event) => {
        const values = [...reqInputs];
        values[index] = event.target.value;
        setReqInputs(values);
        setCourse((prevCourse) => ({
            ...prevCourse,
            requirements: values,
        }));
        setUnSavedChanges(unSavedChanges + 1)
    };

    const handleAddOutInput = () => {
        setOutInputs([...outInputs, '']);
    };

    const handleDeleteOutInput = (index) => {
        const updatedOutInputs = outInputs.filter((_, i) => i !== index);
        setOutInputs(updatedOutInputs);
        setCourse((prevCourse) => ({
            ...prevCourse,
            learnings: updatedOutInputs,
        }));
        setUnSavedChanges(unSavedChanges + 1);
    };

    const handleOutInputChange = (index, event) => {
        const values = [...outInputs];
        values[index] = event.target.value;
        setOutInputs(values);
        setCourse((prevCourse) => ({
            ...prevCourse,
            learnings: values,
        }));
        setUnSavedChanges(unSavedChanges + 1)
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse((prevCourse) => {
            const keys = name.split('.');
            if (keys.length > 1) {
                const [parentKey, childKey] = keys;
                return {
                    ...prevCourse,
                    [parentKey]: {
                        ...prevCourse[parentKey],
                        [childKey]: value,
                    },
                };
            } else {
                return {
                    ...prevCourse,
                    [name]: value,
                };
            }
        });
        if (name === "previewVideo") {
            setPreviewVideoChanged(true)
        }
        console.log(course);
        setUnSavedChanges(unSavedChanges + 1)
    };


    const handleChange2 = (name, value) => {
        setCourse((prevCourse) => {
            const keys = name.split('.');
            if (keys.length > 1) {
                const [parentKey, childKey] = keys;
                return {
                    ...prevCourse,
                    [parentKey]: {
                        ...prevCourse[parentKey],
                        [childKey]: value,
                    },
                };
            } else {
                return {
                    ...prevCourse,
                    [name]: value,
                };
            }
        });
        console.log(course)
        setUnSavedChanges(unSavedChanges + 1)
    };

    const handlePriceChange = (value) => {
        if (selectedCurrency !== 'USD') {
            setCourse((prevCourse) => ({
                ...prevCourse,
                "price": value / exchangeRates[selectedCurrency],
            }));
        }
        else {
            setCourse((prevCourse) => ({
                ...prevCourse,
                "price": value,
            }));
        }

        console.log(course)
        setUnSavedChanges(unSavedChanges + 1)
    };


    // Function to save the course data
    const saveCourse = async () => {
        try {
            let response
            if (!previewVideoChanged) {
                const { previewVideo, thumbnail, ...courseData } = course;
                response = await axiosPrivate.patch(`/courses/${course._id}`, courseData);
            } else {
                const { thumbnail, ...courseData } = course;
                response = await axiosPrivate.patch(`/courses/${course._id}`, courseData);
            }

            console.log('Course updated successfully', response.data);
            setUnSavedChanges(0)
            console.log("lolol")
            showSuccess("Course updated successfully")
            console.log("lolo")

        } catch (error) {
            console.error('Failed to update course', error);
            showError(error.response.data.error)
        }
    };



    useEffect(() => {
        const getLessons = async () => {
            try {
                console.log(courseId)
                const res = await axiosPrivate.get(`/lessons/get-lessons`, { params: { courseId: courseId } });
                setLessons(res.data);
            } catch (error) {

            }
        };
        getLessons();
        setLessonAdded(false)
    }, [lessonAdded])

    const levels = [
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' },
    ];

    const priceTiersUSD = [
        { value: 10, label: '$10' },
        { value: 20, label: '$20' },
        { value: 30, label: '$30' },
        // Add more tiers as needed
    ];

    const currencyOptions = [
        { value: 'USD', label: 'USD - United States Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound Sterling' },
        { value: 'AUD', label: 'AUD - Australian Dollar' },
        { value: 'CAD', label: 'CAD - Canadian Dollar' },
        { value: 'CHF', label: 'CHF - Swiss Franc' },
        { value: 'CNY', label: 'CNY - Chinese Yuan' },
        { value: 'JPY', label: 'JPY - Japanese Yen' },
        { value: 'INR', label: 'INR - Indian Rupee' },
        { value: 'MXN', label: 'MXN - Mexican Peso' },
        { value: 'NZD', label: 'NZD - New Zealand Dollar' },
        { value: 'RUB', label: 'RUB - Russian Ruble' },
        { value: 'BRL', label: 'BRL - Brazilian Real' },
        { value: 'HKD', label: 'HKD - Hong Kong Dollar' },
        { value: 'SGD', label: 'SGD - Singapore Dollar' },
        { value: 'NOK', label: 'NOK - Norwegian Krone' },
        { value: 'KRW', label: 'KRW - South Korean Won' },
        { value: 'TRY', label: 'TRY - Turkish Lira' },
        { value: 'ZAR', label: 'ZAR - South African Rand' },
        { value: 'SEK', label: 'SEK - Swedish Krona' },
        { value: 'DKK', label: 'DKK - Danish Krone' },
        { value: 'PLN', label: 'PLN - Polish Zloty' },
        { value: 'THB', label: 'THB - Thai Baht' },
        { value: 'IDR', label: 'IDR - Indonesian Rupiah' },
        { value: 'HUF', label: 'HUF - Hungarian Forint' },
        { value: 'CZK', label: 'CZK - Czech Koruna' },
        { value: 'ILS', label: 'ILS - Israeli New Shekel' },
        { value: 'CLP', label: 'CLP - Chilean Peso' },
        { value: 'PHP', label: 'PHP - Philippine Peso' },
        { value: 'AED', label: 'AED - United Arab Emirates Dirham' },
        { value: 'SAR', label: 'SAR - Saudi Riyal' },
        { value: 'MYR', label: 'MYR - Malaysian Ringgit' },
        { value: 'RON', label: 'RON - Romanian Leu' },
        { value: 'ARS', label: 'ARS - Argentine Peso' },
        { value: 'BGN', label: 'BGN - Bulgarian Lev' },
        { value: 'HRK', label: 'HRK - Croatian Kuna' },
        { value: 'EGP', label: 'EGP - Egyptian Pound' },
        { value: 'ISK', label: 'ISK - Icelandic Krona' },
        { value: 'NGN', label: 'NGN - Nigerian Naira' },
        { value: 'PKR', label: 'PKR - Pakistani Rupee' },
        { value: 'QAR', label: 'QAR - Qatari Rial' },
        { value: 'UAH', label: 'UAH - Ukrainian Hryvnia' },
        { value: 'VND', label: 'VND - Vietnamese Dong' },
        { value: 'MAD', label: 'MAD - Moroccan Dirham' },
        { value: 'DZD', label: 'DZD - Algerian Dinar' },
        { value: 'TND', label: 'TND - Tunisian Dinar' },
        { value: 'LBP', label: 'LBP - Lebanese Pound' },
        { value: 'JOD', label: 'JOD - Jordanian Dinar' },
        { value: 'OMR', label: 'OMR - Omani Rial' },
        { value: 'BHD', label: 'BHD - Bahraini Dinar' },
        { value: 'KWD', label: 'KWD - Kuwaiti Dinar' },
        { value: 'BND', label: 'BND - Brunei Dollar' },
        { value: 'FJD', label: 'FJD - Fijian Dollar' },
        { value: 'PGK', label: 'PGK - Papua New Guinean Kina' },
        { value: 'SBD', label: 'SBD - Solomon Islands Dollar' },
        { value: 'TOP', label: 'TOP - Tongan Paʻanga' },
        { value: 'BWP', label: 'BWP - Botswanan Pula' },
        { value: 'GHS', label: 'GHS - Ghanaian Cedi' },
        { value: 'KES', label: 'KES - Kenyan Shilling' },
        { value: 'UGX', label: 'UGX - Ugandan Shilling' },
        { value: 'RWF', label: 'RWF - Rwandan Franc' },
        { value: 'TZS', label: 'TZS - Tanzanian Shilling' },
        { value: 'XOF', label: 'XOF - West African CFA Franc' },
        { value: 'XAF', label: 'XAF - Central African CFA Franc' },
        { value: 'MUR', label: 'MUR - Mauritian Rupee' },
        { value: 'SCR', label: 'SCR - Seychellois Rupee' },
        { value: 'NPR', label: 'NPR - Nepalese Rupee' },
        { value: 'LKR', label: 'LKR - Sri Lankan Rupee' },
        { value: 'MMK', label: 'MMK - Myanmar Kyat' },
        { value: 'BDT', label: 'BDT - Bangladeshi Taka' },
        { value: 'BAM', label: 'BAM - Bosnia and Herzegovina Convertible Mark' },
        { value: 'MKD', label: 'MKD - Macedonian Denar' },
        { value: 'RSD', label: 'RSD - Serbian Dinar' },
        { value: 'MZN', label: 'MZN - Mozambican Metical' },
        { value: 'ANG', label: 'ANG - Netherlands Antillean Guilder' },
        { value: 'AWG', label: 'AWG - Aruban Florin' },
        { value: 'BBD', label: 'BBD - Barbadian Dollar' },
        { value: 'BZD', label: 'BZD - Belize Dollar' },
        { value: 'BMD', label: 'BMD - Bermudian Dollar' },
        { value: 'BOB', label: 'BOB - Bolivian Boliviano' },
        { value: 'BSD', label: 'BSD - Bahamian Dollar' },
        { value: 'BTN', label: 'BTN - Bhutanese Ngultrum' },
        { value: 'BIF', label: 'BIF - Burundian Franc' },
        { value: 'CVE', label: 'CVE - Cape Verdean Escudo' },
        { value: 'KYD', label: 'KYD - Cayman Islands Dollar' },
        { value: 'KMF', label: 'KMF - Comorian Franc' },
        { value: 'CDF', label: 'CDF - Congolese Franc' },
        { value: 'DJF', label: 'DJF - Djiboutian Franc' },
        { value: 'ERN', label: 'ERN - Eritrean Nakfa' },
        { value: 'SZL', label: 'SZL - Eswatini Lilangeni' },
        { value: 'ETB', label: 'ETB - Ethiopian Birr' },
        { value: 'GMD', label: 'GMD - Gambian Dalasi' },
        { value: 'GTQ', label: 'GTQ - Guatemalan Quetzal' },
        { value: 'GNF', label: 'GNF - Guinean Franc' },
        { value: 'GYD', label: 'GYD - Guyanaese Dollar' },
        { value: 'HTG', label: 'HTG - Haitian Gourde' },
        { value: 'HNL', label: 'HNL - Honduran Lempira' },
        { value: 'KZT', label: 'KZT - Kazakhstani Tenge' },
        { value: 'KGS', label: 'KGS - Kyrgystani Som' },
        { value: 'LAK', label: 'LAK - Laotian Kip' },
        { value: 'LRD', label: 'LRD - Liberian Dollar' },
        { value: 'LSL', label: 'LSL - Lesotho Loti' },
        { value: 'LYD', label: 'LYD - Libyan Dinar' },
        { value: 'MOP', label: 'MOP - Macanese Pataca' },
        { value: 'MWK', label: 'MWK - Malawian Kwacha' },
        { value: 'MVR', label: 'MVR - Maldivian Rufiyaa' },
        { value: 'MGA', label: 'MGA - Malagasy Ariary' },
        { value: 'MNT', label: 'MNT - Mongolian Tugrik' },
        { value: 'MDL', label: 'MDL - Moldovan Leu' },
        { value: 'MRO', label: 'MRO - Mauritanian Ouguiya' },
        { value: 'NAD', label: 'NAD - Namibian Dollar' },
        { value: 'NIO', label: 'NIO - Nicaraguan Córdoba' },
        { value: 'PAB', label: 'PAB - Panamanian Balboa' },
        { value: 'PGK', label: 'PGK - Papua New Guinean Kina' },
        { value: 'PYG', label: 'PYG - Paraguayan Guarani' },
        { value: 'SHP', label: 'SHP - Saint Helena Pound' },
        { value: 'WST', label: 'WST - Samoan Tala' },
        { value: 'STD', label: 'STD - São Tomé and Príncipe Dobra' },
        { value: 'SLL', label: 'SLL - Sierra Leonean Leone' },
        { value: 'SYP', label: 'SYP - Syrian Pound' },
        { value: 'SOS', label: 'SOS - Somali Shilling' },
        { value: 'SDG', label: 'SDG - Sudanese Pound' },
        { value: 'SRD', label: 'SRD - Surinamese Dollar' },
        { value: 'TJS', label: 'TJS - Tajikistani Somoni' },
        { value: 'SVC', label: 'SVC - Salvadoran Colón' },
        { value: 'TMT', label: 'TMT - Turkmenistani Manat' },
        { value: 'UZS', label: 'UZS - Uzbekistan Som' },
        { value: 'VUV', label: 'VUV - Vanuatu Vatu' },
        { value: 'XCD', label: 'XCD - East Caribbean Dollar' },
        { value: 'YER', label: 'YER - Yemeni Rial' },
        { value: 'ZMW', label: 'ZMW - Zambian Kwacha' },
        { value: 'ZWL', label: 'ZWL - Zimbabwean Dollar' }
    ];




    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
                setExchangeRates(response.data.rates);
            } catch (error) {
                console.error('Error fetching exchange rates', error);
            }
        };

        fetchExchangeRates();
        console.log(exchangeRates)
    }, [])


    useEffect(() => {
        if (selectedCurrency && exchangeRates[selectedCurrency]) {
            const newTiers = priceTiersUSD.map(tier => ({
                value: tier.value * exchangeRates[selectedCurrency],
                label: `${(tier.value * exchangeRates[selectedCurrency]).toFixed(2)} ${selectedCurrency}`,
            }));
            setPriceTiers(newTiers);
        }
    }, [selectedCurrency, exchangeRates]);


    const handleAddInput = () => {
        setShowInput(true)
    };

    const addNewLesson = async () => {
        try {
            const response = await axiosPrivate.post(`/lessons/create-lesson`, { courseId, title: newLesson });
            setShowInput(false)
            setLessonAdded(true)
        } catch (error) {
            console.log(error)
            showError(error.response.data.error)
        }

    }

    const publish = async () => {
        try {
            const respone = await axiosPrivate.patch('/courses/publish', { courseId })
            showSuccess("Course published successfully")
        } catch (error) {
            console.log(error)
            showError(error.response.data.error)
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

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            fontFamily: 'Montserrat, Aria, sans-serif',
            fontSize: '15px',
            color: '#555',
            fontWeight: '500'
        }),
        option: (provided) => ({
            ...provided,
            fontFamily: 'Montserrat, Aria, sans-serif',
            fontSize: '15px', // Corrected to 'fontSize'
            color: '#555',
            fontWeight: '500'
        }),
        singleValue: (provided) => ({
            ...provided,
            fontFamily: 'Montserrat, Aria, sans-serif',
            fontSize: '15px', // Corrected to 'fontSize'
            color: '#555',
            fontWeight: '500'
        }),
    }


    return (
        <body className='home-01'>
            <Modal
                className="modal-content"
                isOpen={showSuccessAlert}
                onRequestClose={() => setShowSuccessAlert(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        padding: '20px',
                        top: '23%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '20%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        fontSize: '16px',
                        opacity: 1,
                        zIndex: '100',
                        borderRadius: "7px"
                    },
                }}
            >
                <div className="preview-content">
                    <span>{alertMessage}</span>
                </div>
            </Modal>

            <Modal
                className="modal-content"
                isOpen={showErrorAlert}
                onRequestClose={() => setShowErrorAlert(false)}
                contentLabel="Course Preview"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                    },
                    content: {
                        display: 'flex',
                        padding: '20px',
                        top: '23%', // Vertically center
                        left: '50%', // Horizontally center
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%', // Necessary to maintain horizontal centering
                        transform: 'translate(-50%, -50%)', // Keeps the modal centered horizontally
                        width: '50%', // Always take 50% of the screen width
                        maxWidth: '600px', // Optional: Max width for larger screens
                        minWidth: '300px', // Optional: Min width for smaller screens
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        fontSize: '16px',
                        opacity: 1,
                        zIndex: '100',
                        borderRadius: "7px"
                    },
                }}
            >
                <div className="preview-content">
                    <span>{alertMessage}</span>
                    <span>{"   "}</span>
                    <CloseIcon style={{ cursor: "pointer" }} onClick={() => setShowErrorAlert(false)} />
                </div>
            </Modal>
            <div>
                <div class="sub-header">
                    <div class="container">
                        <div className="flex-row">
                            <div className="flex-row">
                                <Link to="/" class="logo">
                                    <img src={logo} alt="" />
                                </Link>
                                {isDivVisible &&
                                    <ul class="main-nav__list">
                                        <li class="active">
                                            <Link>Draft Courses</Link>
                                        </li>
                                        <li>
                                            <ArrowForwardIosIcon className='icon-01' />
                                        </li>
                                        <li>
                                            <Link>{course?.title}</Link>
                                        </li>
                                    </ul>
                                }
                            </div>
                            <button class="header-btn" onClick={saveCourse}>
                                {unSavedChanges > 0 && <FiberManualRecordIcon />}
                                save
                            </button>
                        </div>
                    </div>
                </div>

                <main>
                    <div className='padding-top-93'></div>
                    <div class="contact">
                        <div class="row">
                            <div class="col-lg-8" id="mainContent">
                                <div class="row box first">
                                    <div class="box-header">
                                        <h3><strong>1</strong>Basic Info</h3>
                                        <p>As you complete this section, think about creating a compelling Course Landing Page that demonstrates why someone would want to enroll in your course.</p>
                                    </div>
                                    <div class="col-lg-6 col-md-12">
                                        <div class="form-group">
                                            <input class="form-control" placeholder="Course Title" type="text" data-parsley-pattern="^[a-zA-Z\s.]+$" required name='title' value={course?.title} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <Select
                                                styles={selectStyles}
                                                class="wide"
                                                placeholder="Course Category"
                                                options={categories.map((cat) => ({
                                                    value: cat.name,
                                                    label: cat.name,
                                                }))}
                                                name="subject"
                                                value={course?.subject ? { value: course.subject, label: course.subject } : null}
                                                onChange={(option) => handleChange2("subject", option.value)} />
                                        </div>
                                    </div>
                                    <div class=" col-md-12">
                                        <div class="form-group">
                                            <textarea id="inputMessage" class="form-control" placeholder="Course Description" data-parsley-pattern="^[a-zA-Z0-9\s.:,!?']+$"
                                                required name="description" value={course?.description} onChange={handleChange}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row box">
                                    <div class="box-header">
                                        <h3><strong>2</strong>Preview Video</h3>
                                        <p> Focus on creating a brief Course Preview Video that highlights key benefits and motivates students to enroll.</p>
                                    </div>
                                    <div class="col-lg-6 col-md-12">
                                        <div class="form-group">
                                            <input id="phone" class="form-control" placeholder="Preview Video Link" type="text" name="previewVideo" value={course?.previewVideo} onChange={handleChange} />
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            {ReactPlayer.canPlay(course?.previewVideo) ? (
                                                <div className='preview-window'>
                                                    <ReactPlayer url={course?.previewVideo} width="100%" height="100%" />
                                                </div>
                                            ) : (
                                                <div className='preview-window'>
                                                    <img className='no-preview' src={nopreviewavailable} alt="No preview video available" />
                                                </div>

                                            )}
                                        </div>
                                    </div>

                                </div>
                                <div class="row box">
                                    <div class="box-header">
                                        <h3><strong>3</strong>Intended Learners</h3>
                                        <p>As you complete this section, focus on outlining the Intended Learners by defining course outcomes, skill levels, and any necessary prerequisites to ensure clarity for potential students.</p>
                                    </div>
                                    <div class="col-md-12 margin-bottom-20">
                                        <div className="form-group">
                                            <Select
                                                styles={selectStyles}
                                                class="wide"
                                                options={levels}
                                                name="level"
                                                value={levels.find(option => option.value === course?.level) || null}
                                                onChange={(option) => handleChange2("level", option.value)}
                                                placeholder="Course Level" />
                                        </div>
                                    </div>
                                    <div className="col-md-12 margin-bottom-20">
                                        <h4 className='label-01'>Course Requirements</h4>
                                        <div className='padding-top-10'></div>
                                        {reqInputs && reqInputs.map((input, index) => (
                                            <div key={index} className='form-group' >
                                                <input
                                                    class="form-control less-width"
                                                    type="text"
                                                    value={input}
                                                    onChange={(event) => handleReqInputChange(index, event)}
                                                />
                                                <DeleteIcon onClick={() => handleDeleteReqInput(index)} style={{color:"darkred",cursor:"pointer", fontSize:"16px"}}/>
                                            </div>
                                        ))}
                                        <div className="add-input">
                                            <AddIcon></AddIcon>
                                            <button className='add-more' onClick={handleAddReqInput}>Add input </button>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <h4 className='label-01'>Course Outcomes</h4>
                                        <div className='padding-top-10'></div>
                                        {outInputs && outInputs.map((input, index) => (
                                            <div key={index} className='form-group'>
                                                <input
                                                    class="form-control less-width"
                                                    type="text"
                                                    value={input}
                                                    onChange={(event) => handleOutInputChange(index, event)}
                                                />
                                                <DeleteIcon onClick={() => handleDeleteOutInput(index)} style={{color:"darkred",cursor:"pointer",fontSize:"16px"}}/>
                                            </div>
                                        ))}
                                        <div className="add-input">
                                            <AddIcon></AddIcon>
                                            <button className='add-more' onClick={handleAddOutInput}>Add input</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row box">
                                    <div class="box-header">
                                        <h3><strong>4</strong>Pricing</h3>
                                        <p>Consider putting a price that fit the value earned from your course. Discounts can encourage users to enroll</p>
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <Select
                                                styles={selectStyles}
                                                placeholder='Select currency'
                                                options={currencyOptions}
                                                value={currencyOptions.find(option => option.value === selectedCurrency) || null}
                                                onChange={(option) => setSelectedCurrency(option.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="form-group">
                                            <Select
                                                styles={selectStyles}
                                                placeholder='Select price tier'
                                                options={priceTiers}
                                                name='price'
                                                onChange={(option) => handlePriceChange(option.value)}
                                                value={priceTiers.find(option => option.value === course?.price)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className='form-group'>
                                            <input
                                                className='form-control'
                                                placeholder='Discount Percentage'
                                                type="number"
                                                name='discount.quantity'
                                                value={course?.discount?.quantity}
                                                onChange={handleChange}
                                            />
                                            {/* {errors.quantity && <div style={{ color: 'red' }}>{errors.quantity}</div>} */}
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-12">
                                        <div className='form-group'>
                                            <DatePicker
                                                className='form-control'
                                                placeholderText='Discount Start Date'
                                                selected={course?.discount?.discountStart}
                                                onChange={(date) => handleChange2("discount.discountStart", date)}
                                                minDate={new Date()}
                                                dateFormat="yyyy-MM-dd"
                                            />
                                            {/* {errors.discountStart && <div style={{ color: 'red' }}>{errors.discountStart}</div>} */}
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-12'>
                                        <div className='form-group'>
                                            <DatePicker
                                                className='form-control'
                                                placeholderText='Discount End Date'
                                                selected={course?.discount?.discountEnd}
                                                onChange={(date) => handleChange2("discount.discountEnd", date)}
                                                minDate={course?.discount?.discountStart}
                                                dateFormat="yyyy-MM-dd"
                                            />
                                            {/* {errors.discountEnd && <div style={{ color: 'red' }}>{errors.discountEnd}</div>} */}
                                        </div>
                                    </div>
                                </div>
                                <div class="row box">
                                    <div class="box-header" id="lessons">
                                        <h3><strong>5</strong>Lessons</h3>
                                        <p>As you complete this section, focus on adding and organizing lesson titles. Each lesson link will guide you to create detailed content, ensuring a clear learning structure for your students.</p>
                                    </div>
                                    <ol class="col-md-12">
                                        {lessons.map((lesson, index) => (
                                            <li key={index}>
                                                <Link to={`/create-course/${courseId}/create-lesson/${lesson._id}`} className='lesson-link'>{lesson.title}</Link>
                                            </li>
                                        ))}
                                    </ol>
                                    <div className="col-md-12">
                                        <div className="add-input margin-bottom-20">
                                            <AddIcon></AddIcon>
                                            <button className='add-more' onClick={handleAddInput}>Add Input</button>
                                        </div>
                                        {showInput === true &&
                                            <>
                                                <div className='col-lg-6 col-md-12 margin-bottom-10'>
                                                    <input type="text" value={newLesson} onChange={(e) => setNewLesson(e.target.value)}
                                                        className='form-control' placeholder='Lesson Title' />
                                                </div>
                                                <div className='col-lg-6 col-md-12' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                    <button className='btn-05' onClick={addNewLesson}>Save</button>
                                                </div>
                                            </>
                                        }

                                    </div>
                                </div>
                                <div class="row box">
                                    <div class="col-12">
                                        <div class="form-group">
                                            <button class="btn-form-func" onClick={saveCourse}>
                                                <span class="btn-form-func-content" >Save Changes</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4" id="sidebar">
                                <div id="contactInfoContainer" class="theiaStickySidebar">
                                    <div class="contact-box">
                                        <h2 className={unSavedChanges > 0 ? 'error' : ''}>{unSavedChanges > 0 && <FiberManualRecordIcon />} {unSavedChanges} Unsaved Changes</h2>
                                        <button className={unSavedChanges > 0 ? 'btn-05' : 'btn-06'} onClick={saveCourse}>Save</button>
                                    </div>
                                    <div class="contact-box">
                                        <i class="icon icon-envelope"></i>
                                        <h2>{lessons.length} Lessons Created</h2>
                                        <a style={{cursor:"pointer"}} onClick={()=>document.getElementById("lessons").scrollIntoView({ behavior: 'smooth' })}>Click them to complete</a>
                                    </div>
                                    <div class="contact-box">
                                        <h2>Publish Your Course</h2>
                                        <a>Complete Landing page and all lessons content then publish your course</a>
                                        <button className='btn-05' onClick={publish}>Publish</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </body>
    )
}

export default CreateCourse