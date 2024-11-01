import React from 'react'
import Footer from '../components/Footer'
import logo from '../assets/logo_dark.png'

const Categories = () => {
    return (
        <body>
            <div class="wrapp-content">
                <header class="wrapp-header">
                    <div class="main-nav">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <a href="./" class="logo">
                                        <img src={logo} alt="" />
                                    </a>
                                    <div class="main-nav__btn">
                                        <div class="icon-left"></div>
                                        <div class="icon-right"></div>
                                    </div>
                                    <div class="search-block">
                                        <button class="search-btn">Search</button>
                                        <form action="./" class="search-block__form">
                                            <input class="search-block__form-text" type="text" name="search-name" placeholder="Search..." />
                                        </form>
                                    </div>
                                    <ul class="main-nav__list">
                                        <li>
                                            <a href="index.html">Home</a>
                                            <ul>
                                                <li>
                                                    <a href="index.html">Home 1</a>
                                                </li>
                                                <li>
                                                    <a href="index_02.html">Home 2</a>
                                                </li>
                                                <li>
                                                    <a href="index_03.html">Home 3</a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="events.html">Events</a>
                                            <ul>
                                                <li>
                                                    <a href="single_event.html">Single event</a>
                                                </li>
                                                <li>
                                                    <a href="events_calendar.html">Events calendar</a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="#">Pages</a>
                                            <ul>
                                                <li>
                                                    <a href="mission.html">Our Mission</a>
                                                </li>
                                                <li>
                                                    <a href="process.html">Process</a>
                                                </li>
                                                <li>
                                                    <a href="about.html">About</a>
                                                </li>
                                                <li>
                                                    <a href="become_a_teacher.html">Become a Teacher</a>
                                                </li>
                                                <li>
                                                    <a href="for_business.html">For Business</a>
                                                </li>
                                                <li>
                                                    <a href="services.html">Services</a>
                                                </li>
                                                <li>
                                                    <a href="team.html">Our Team</a>
                                                </li>
                                                <li>
                                                    <a href="single_team.html">Single Team</a>
                                                </li>
                                                <li>
                                                    <a href="404.html">404</a>
                                                </li>
                                                <li>
                                                    <a href="single_course.html">Single course</a>
                                                </li>
                                                <li>
                                                    <a href="typography.html">Typography</a>
                                                </li>
                                                <li>
                                                    <a href="coming_soon.html">Coming soon</a>
                                                </li>
                                                <li>
                                                    <a href="gallery.html">Gallery</a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <a href="blog_with_right_sidebar.html">News</a>
                                            <ul>
                                                <li>
                                                    <a href="blog_fullwidth.html">Fullwidth Listing</a>
                                                </li>
                                                <li>
                                                    <a href="blog_with_right_sidebar.html">With Right Sidebar</a>
                                                </li>
                                                <li>
                                                    <a href="blog_with_left_sidebar.html">With Left Sidebar</a>
                                                </li>
                                                <li>
                                                    <a href="blog_post_right_sidebar.html">Blog post</a>
                                                    <ul>
                                                        <li>
                                                            <a href="blog_post_fullwidth.html">Fullwidth</a>
                                                        </li>
                                                        <li>
                                                            <a href="blog_post_right_sidebar.html">With Right Sidebar</a>
                                                        </li>
                                                        <li>
                                                            <a href="blog_post_left_sidebar.html">With Left Sidebar</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li class="active">
                                            <a href="courses.html">Courses</a>
                                        </li>
                                        <li>
                                            <a href="contacts.html">Contacts</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                /
                <main class="content-row">
                    <div class="page-title-wrapp">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h1 class="page-title-01">Courses</h1>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <ul class="breadcrumbs">
                                        <li class="active">
                                            <a href="index.html">Home</a>
                                        </li>
                                        <li>Courses</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="content-box padding-top-20 padding-bottom-36">
                        <div class="container">
                            <div class="row sort-group filter-button-group">
                                <div class="col-lg-12">
                                    <a class="sort-item" href="#" data-filter="*">All</a>
                                    <a class="sort-item" href="#" data-filter=".economy">Economy</a>
                                    <a class="sort-item" href="#" data-filter=".languages">Languages</a>
                                    <a class="sort-item" href="#" data-filter=".design">Design</a>
                                    <a class="sort-item" href="#" data-filter=".biology">Biology</a>
                                    <a class="sort-item" href="#" data-filter=".history">History</a>
                                    <a class="sort-item" href="#" data-filter=".mathematics">Mathematics</a>
                                    <a class="sort-item" href="#" data-filter=".technologies">Technologies</a>
                                </div>
                            </div>
                            <div class="row grid">
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 economy languages history">
                                    <div class="product-list__item">
                                        <figure class="product-list__img">
                                            <a href="single_course.html">
                                                <img src="img/product_list/product_img-01.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div class="product-list__content">
                                            <a class="product-list__category" href="#">Economy</a>
                                            <h3 class="product-list__title">
                                                <a href="single_course.html">Macroeconomy</a>
                                            </h3>
                                            <ul class="product-list__star-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                            <p class="product-list__price">$ 150</p>
                                        </div>
                                        <div class="product-list__item-info">
                                            <p class="item-info__text-01">14 Lessons</p>
                                            <p class="item-info__text-02">25 Seats</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 languages mathematics biology">
                                    <div class="product-list__item">
                                        <figure class="product-list__img">
                                            <a href="single_course.html">
                                                <img src="img/product_list/product_img-02.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div class="product-list__content">
                                            <a class="product-list__category" href="#">Biology</a>
                                            <h3 class="product-list__title">
                                                <a href="single_course.html">Anatomy Course</a>
                                            </h3>
                                            <ul class="product-list__star-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                            <p class="product-list__price">$ 90</p>
                                        </div>
                                        <div class="product-list__item-info">
                                            <p class="item-info__text-01">10 Lessons</p>
                                            <p class="item-info__text-02">14 Seats</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 design history economy">
                                    <div class="product-list__item">
                                        <figure class="product-list__img">
                                            <a href="single_course.html">
                                                <img src="img/product_list/product_img-03.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div class="product-list__content">
                                            <a class="product-list__category" href="#">Mathematics</a>
                                            <h3 class="product-list__title">
                                                <a href="single_course.html">Geometry Course</a>
                                            </h3>
                                            <ul class="product-list__star-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                            <p class="product-list__price">$ 180</p>
                                        </div>
                                        <div class="product-list__item-info">
                                            <p class="item-info__text-01">21 Lessons</p>
                                            <p class="item-info__text-02">56 Seats</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 biology languages">
                                    <div class="product-list__item">
                                        <figure class="product-list__img">
                                            <a href="single_course.html">
                                                <img src="img/product_list/product_img-04.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div class="product-list__content">
                                            <a class="product-list__category" href="#">Design</a>
                                            <h3 class="product-list__title">
                                                <a href="single_course.html">Interior Design</a>
                                            </h3>
                                            <ul class="product-list__star-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                            <p class="product-list__price">$ 210</p>
                                        </div>
                                        <div class="product-list__item-info">
                                            <p class="item-info__text-01">17 Lessons</p>
                                            <p class="item-info__text-02">15 Seats</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 history economy design">
                                    <div class="product-list__item">
                                        <figure class="product-list__img">
                                            <a href="single_course.html">
                                                <img src="img/product_list/product_img-05.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div class="product-list__content">
                                            <a class="product-list__category" href="#">History</a>
                                            <h3 class="product-list__title">
                                                <a href="single_course.html">World History</a>
                                            </h3>
                                            <ul class="product-list__star-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                            <p class="product-list__price">$ 70</p>
                                        </div>
                                        <div class="product-list__item-info">
                                            <p class="item-info__text-01">23 Lessons</p>
                                            <p class="item-info__text-02">36 Seats</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 mathematics biology">
                                    <div class="product-list__item">
                                        <figure class="product-list__img">
                                            <a href="single_course.html">
                                                <img src="img/product_list/product_img-06.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div class="product-list__content">
                                            <a class="product-list__category" href="#">Design</a>
                                            <h3 class="product-list__title">
                                                <a href="single_course.html">Graphic Design</a>
                                            </h3>
                                            <ul class="product-list__star-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                            <p class="product-list__price">$ 250</p>
                                        </div>
                                        <div class="product-list__item-info">
                                            <p class="item-info__text-01">50 Lessons</p>
                                            <p class="item-info__text-02">25 Seats</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 economy mathematics economy technologies">
                                    <div class="product-list__item">
                                        <figure class="product-list__img">
                                            <a href="single_course.html">
                                                <img src="img/product_list/product_img-07.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div class="product-list__content">
                                            <a class="product-list__category" href="#">Technology</a>
                                            <h3 class="product-list__title">
                                                <a href="single_course.html">Word Press</a>
                                            </h3>
                                            <ul class="product-list__star-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                            <p class="product-list__price">$ 180</p>
                                        </div>
                                        <div class="product-list__item-info">
                                            <p class="item-info__text-01">21 Lessons</p>
                                            <p class="item-info__text-02">56 Seats</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-12 col-sm-4 col-md-3 col-lg-3 design technologies history">
                                    <div class="product-list__item">
                                        <figure class="product-list__img">
                                            <a href="single_course.html">
                                                <img src="img/product_list/product_img-08.jpg" alt="" />
                                            </a>
                                        </figure>
                                        <div class="product-list__content">
                                            <a class="product-list__category" href="#">Languages</a>
                                            <h3 class="product-list__title">
                                                <a href="single_course.html">English Basic</a>
                                            </h3>
                                            <ul class="product-list__star-list">
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <i class="fa fa-star" aria-hidden="true"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                            <p class="product-list__price">$ 115</p>
                                        </div>
                                        <div class="product-list__item-info">
                                            <p class="item-info__text-01">35 Lessons</p>
                                            <p class="item-info__text-02">47 Seats</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="courses-pagination">
                                        <ul class="pagination-list">
                                            <li class="active">
                                                <a href="#">1</a>
                                            </li>
                                            <li>
                                                <a href="#">2</a>
                                            </li>
                                            <li>
                                                <a href="#">3</a>
                                            </li>
                                            <li>
                                                <a href="#">next</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer></Footer>
            </div>
        </body>


    )
}

export default Categories