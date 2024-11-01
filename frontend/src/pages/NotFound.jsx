import React from 'react'
import Footer from '../components/Footer/Footer'

const NotFound = () => {
  return (
    <body>
	<div class="wrapp-content">
		<header class="wrapp-header">
			<div class="info-box-01">
				<div class="container">
					<div class="row">
						<div class="col-sm-4 col-md-4 col-lg-4 text-sm-center">
							<ul class="social-list-01">
								<li>
									<a href="#">
										<i class="fa fa-facebook" aria-hidden="true"></i>
									</a>
								</li>
								<li>
									<a href="#">
										<i class="fa fa-twitter" aria-hidden="true"></i>
									</a>
								</li>
								<li>
									<a href="#">
										<i class="fa fa-instagram" aria-hidden="true"></i>
									</a>
								</li>
								<li>
									<a href="#">
										<i class="fa fa-google-plus" aria-hidden="true"></i>
									</a>
								</li>
							</ul>
						</div>
						<div class="col-sm-8 col-md-8 col-lg-8 text-sm-center text-right">
							<div class="contact-block-01">
								<a class="contact-block-01__email" href="mailto:thesmart@edu.com">thesmart@edu.com</a>
								<p class="contact-block-01__phone">826 696 8370</p>
								<a class="contact-block-01__lang" href="#">Eng</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="main-nav">
				<div class="container">
					<div class="row">
						<div class="col-lg-12">
							<a href="./" class="logo">
								<img src="img/logo_dark.png" alt=""/>
							</a>
							<div class="main-nav__btn">
								<div class="icon-left"></div>
								<div class="icon-right"></div>
							</div>
							<div class="search-block">
								<button class="search-btn">Search</button>
								<form action="./" class="search-block__form">
									<input class="search-block__form-text" type="text" name="search-name" placeholder="Search..."/>
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
								<li class="active">
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
										<li class="active">
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
								<li>
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
		<main class="content-row">
			<div class="content-box-01 page404">
				<div class="container">
					<div class="row">
						<div class="col-lg-12">
							<h3 class="page404-title">404</h3>
							<p class="page404-subtitle">Oops! Page Not Found!</p>
							<p class="page404-text">Either Something Get Wrong or the Page Doesn't Exist Anymore.</p>
							<form action="./" class="page404-form">
								<div class="page404-form__box">
									<input class="page404-form__inp-text" placeholder="Search..." type="text" name="inp-text"/>
									<button class="page404-form__inp-btn" type="button">Search</button>
								</div>
							</form>
							<a class="btn-01" href="#">Take me home</a>
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

export default NotFound