import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Footer from '../components/Footer'
import logo from '../assets/logo_dark.png'
import upload_photo from '../assets/upload_photo.png'
import Stars from '../components/Stars/Stars'
import Avatar from '../components/Avatar/Avatar'
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PeopleIcon from '@mui/icons-material/People';

const InstructorDashBoardLandingPage = () => {
    const baseURL = "http://localhost:7000";
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const [instructor, setInstructor] = useState()
    const [courses, setCourses] = useState([])

    const [updateData, setUpdateData] = useState({})
    const [nameEditMode, setNameEditMode] = useState(false)
    const [emailEditMode, setEmailEditMode] = useState(false)
    const [bioEditMode, setBioEditMode] = useState(false)

    const goToCourse = (courseId) => {
        navigate(`/course-preview/${courseId}`);
    };
    const handleTabClick = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };
    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    useEffect(() => {
        const getInstructor = async () => {
            try {
                const res = await axiosPrivate.get(`/instructors/?includedCourses=open`);
                console.log(res.data.instructor)
                console.log(`${baseURL}${res.data.instructor?.image}`)
                setInstructor(res.data.instructor);
                setCourses(res.data.courses)

            } catch (error) {
                console.error(error);
            }
        };
        getInstructor();
    }, []);

    const handleBiographyChange = (content) => {
        setUpdateData((prev) => ({
            ...prev,
            miniBiography: content,
        }));
    };

    const handleUpdate = async () => {
        try {
            const res = await axiosPrivate.patch("/instructors/", updateData)
            setInstructor(res.data)
            setBioEditMode(false)
            setEmailEditMode(false)
            setNameEditMode(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await axiosPrivate.patch('/instructors/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Ensure proper content type
                    }
                });
                const imageUrl = response.data;
                setInstructor((prevInstructor) => ({
                    ...prevInstructor,
                    image: imageUrl,
                }));

                // Optionally, set selected image for immediate feedback before saving
                //setSelectedImage(URL.createObjectURL(file));
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
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
        <div class='teach-with-us'>
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
                                        <li >
                                            <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                                        </li>
                                        <li>
                                            <Link to={'/instructor-dashboard/open-courses'}>Open Courses</Link>
                                        </li>
                                        <li>
                                            <Link to={'/instructor-dashboard/closed-courses'}>Closed Courses</Link>
                                        </li>
                                        <li>
                                            <Link to={'/instructor-dashboard/wallet'}>Wallet</Link>
                                        </li>
                                        <li class="active">
                                            <Link to={'/instructor-dashboard/landing-page'}>Landing page</Link>
                                        </li>
                                    </ul>
                                }
                                {!isDivVisible &&
                                    <div className="flex-column">
                                        <ul className="main-nav__list">
                                            <li class="active">
                                                <Link to={'/instructor-dashboard/landing-page'}>Landing Page</Link>
                                            </li>
                                            <li>
                                                {toggleList ? <ExpandLessIcon onClick={handleIconClick} /> : <ExpandMoreIcon onClick={handleIconClick} />}
                                            </li>
                                        </ul>
                                        {toggleList &&
                                            <ul className={`main-nav__list_3 ${toggleList ? 'active' : ''}`}>
                                                <li>
                                                    <Link to={'/instructor-dashboard/draft-courses'}>Draft Courses</Link>
                                                </li>
                                                <li>
                                                    <Link to={'/instructor-dashboard/open-courses'}>Open Courses</Link>
                                                </li>
                                                <li>
                                                    <Link to={'/instructor-dashboard/closed-courses'}>Closed Courses</Link>
                                                </li>
                                                <li>
                                                    <Link to={'/instructor-dashboard/wallet'}>Wallet</Link>
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
                    <div class="content-box-01 single-team">
                        <div class="row">
                            <div class="col-md-12 col-lg-7 padding-bottom-20">
                                <figure class="single-team__info">
                                    <EditIcon onClick={() => { fileInputRef.current.click(); }} />
                                    <img src={selectedImage || `${baseURL}${instructor?.image}` || upload_photo} alt="" />
                                </figure>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div class="col-md-12 col-lg-5">
                                <div class="single-team__info">
                                    {!nameEditMode ?
                                        <h3 class="single-team__info-title">{capitalizeFirstLetter(instructor?.firstName)} {capitalizeFirstLetter(instructor?.lastName)}<EditIcon onClick={() => setNameEditMode(true)} /> </h3>
                                        : <div className='single-team__info-title'>
                                            <div>
                                                <input type="text" value={updateData.firstName || instructor?.firstName || ""} onChange={(e) => {
                                                    setUpdateData((prev) => ({
                                                        ...prev,
                                                        firstName: e.target.value,
                                                    }));

                                                }} className='input-01 input-02' />
                                                <input type="text" value={updateData.lastName || instructor?.lastName || ""} onChange={(e) => {
                                                    setUpdateData((prev) => ({
                                                        ...prev,
                                                        lastName: e.target.value,
                                                    }));
                                                }} className='input-01 input-02' />
                                            </div>
                                            <EditIcon onClick={() => setNameEditMode(true)} />
                                        </div>
                                    }
                                    <ul class="single-team__info-list">
                                        <li>
                                            <div><span>Category :</span> 1 Category</div>
                                        </li>
                                        <li>
                                            <div><span>Email :</span>
                                                {!emailEditMode ? <a href="mailto:samuel.williams@edu.com"> {instructor?.email}</a> :
                                                    <input type='email' value={updateData.email || instructor?.email || ""} onChange={(e) => {
                                                        setUpdateData((prev) => ({
                                                            ...prev,
                                                            email: e.target.value,
                                                        }));
                                                    }} />}</div>:

                                            <EditIcon onClick={() => setEmailEditMode(true)} />
                                        </li>
                                        <li>
                                            <div>
                                                <span>Published courses :</span>
                                                <a href="mailto:samuel.williams@edu.com"> {courses?.length}</a>
                                            </div>
                                        </li>
                                        <li onClick={() => handleTabClick('courses')} className='single-team__info-list-link'>
                                            Explore Instructor Courses
                                        </li>
                                    </ul>
                                    <Stars value={instructor?.avgRating} number={instructor?.ratingsCount}></Stars>
                                    <ul class="single-team__info-list">
                                        <li onClick={() => handleTabClick('reviews')} className='single-team__info-list-link'>
                                            Explore Reviews
                                        </li>
                                    </ul>
                                    <button className='btn-01' onClick={handleUpdate}>Save</button>
                                </div>
                            </div>
                        </div>
                        <div className="margin-top-54"></div>
                        <div class="row ">
                            <div class="col-lg-12">
                                <h3 class="margin-bottom-17">Biography <EditIcon onClick={() => setBioEditMode(true)} /></h3>
                                {!bioEditMode ?
                                    <div class="form-group">
                                        <textarea id="inputMessage" class="form-control" placeholder="Add Your Biography" data-parsley-pattern="^[a-zA-Z0-9\s.:,!?']+$"
                                            name="description" value={updateData.miniBiography || instructor?.miniBiography || ""} onChange={(e) => handleBiographyChange(e.target.value)} disabled></textarea>
                                    </div>
                                    :
                                    <>
                                        <div class="form-group">
                                            <textarea id="inputMessage" class="form-control" placeholder="Add Your Biography" data-parsley-pattern="^[a-zA-Z0-9\s.:,!?']+$"
                                                name="description" value={updateData.miniBiography || instructor?.miniBiography || ""} onChange={(e) => handleBiographyChange(e.target.value)}></textarea>
                                        </div>
                                        <button onClick={handleUpdate} className='btn-01'>Save</button>
                                    </>}
                            </div>
                        </div>
                        <div class="content-box-01 padding-top-93" id="courses">
                            <div class="container">
                                <div class="row" >
                                    <div class="col-lg-12 text-center">
                                        <h3 class="title-02 title-02--mr-01">Instructor Popular
                                            <span> Courses</span>
                                        </h3>
                                        <p class="subtitle-01">Explore the instructor's popular courses, ranked by enrollments and ratings. These courses reflect the preferences of students, showcasing the most engaging and well-rated content available.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-box-01 padding-bottom-100" >
                            <div class="container">
                                <div className="row products">
                                    <div class="col-lg-12">
                                        <ul className="product-list">
                                            {courses.length > 0 && courses.map(course => {
                                                const isDiscountValid = course?.discount?.quantity > 0 && new Date(course?.discount?.discountEnd) > new Date();
                                                const discountedPrice = isDiscountValid
                                                    ? (course.price - (course.price * course.discount.quantity / 100).toFixed(2))
                                                    : null;
                                                const daysLeft = isDiscountValid
                                                    ? Math.ceil((new Date(course.discount.discountEnd) - new Date()) / (1000 * 60 * 60 * 24))
                                                    : null;
                                                return (
                                                    <li className="product-list__item" key={course.id} onClick={() => goToCourse(course._id)}>
                                                        <img src={course.thumbnail} alt={course.title} />
                                                        <div className="product-list__content">
                                                            <Link className="product-list__category" href="#">{course.subject}</Link>
                                                            <h3 className="product-list__title">
                                                                {course.title}
                                                            </h3>

                                                            <p className="product-list__info-piece"><Stars value={course.avgRating} number={course.ratings.length}></Stars></p>
                                                            {isDiscountValid ? (
                                                                <>
                                                                    <p className="product-list__info-piece flex-row"><span className="flex-row"><span>${discountedPrice}</span><span style={{ textDecoration: 'line-through' }}>${course.price.toFixed(2)}</span> </span><span>{daysLeft} days left</span></p>
                                                                </>
                                                            ) : (
                                                                <p className="product-list__info-piece">${course.price.toFixed(2)}</p>
                                                            )}
                                                        </div>
                                                        <div className="product-list__item-info" style={{ textAlign: "center" }}>
                                                            <p className="product-list__info-piece"><PeopleIcon /><span>   </span>{course.enrolledStudents} Students</p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 text-center">
                                        {
                                            courses.length > 4 ?
                                                <Link href="courses.html" class="btn-01">See more</Link>
                                                : courses.length === 0 ?
                                                    <Link to={"/instructor-dashboard/draft-courses"} class="btn-01">Start creating courses</Link>
                                                    : <></>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-box-01 padding-top-93" id="reviews">
                            <div class="container">
                                <div class="row" >
                                    <div class="col-lg-12 text-center">
                                        <h3 class="title-02 title-02--mr-01">Instructor
                                            <span> Reviews </span>
                                        </h3>
                                        <p class="subtitle-01">Honest feedback from students on their learning experience with the instructor and his courses, helping you make informed choices</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="content-box-01 padding-bottom-100" >
                            <div class="container">
                                <div className="row products">
                                    <div class="col-lg-12">
                                        <ul className="product-list">
                                            {instructor?.ratings?.length > 0 && instructor.ratings.map(rating => {
                                                return (
                                                    <li className="product-list__item" key={rating._id}>
                                                        <Avatar username={rating.reviewerName}></Avatar>
                                                        <div className="product-list__content">
                                                            <Stars value={rating.rating}></Stars>
                                                            <div className='course-s-div'>
                                                                <p className='stars-p'>{rating.review}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );

                                            })}
                                        </ul>

                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 text-center">
                                        {
                                            instructor?.ratings?.length > 4 ?
                                                <Link href="courses.html" class="btn-01">See more</Link>
                                                : instructor?.ratings?.length === 0 ?
                                                    <Link to={"/instructor-dashboard/draft-courses"} class="btn-01">No Reviews yet</Link>
                                                    : <></>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer></Footer>
            </div>
        </div >
    )
}

export default InstructorDashBoardLandingPage