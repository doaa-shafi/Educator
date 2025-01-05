import React from 'react'
import { Link } from 'react-router-dom'
import useCategory from '../hooks/useCategory'
import logo from '../assets/logo_white.png'

const Footer = () => {
	const categories = useCategory()
	const halfIndex = Math.ceil(categories.length / 2);
	const firstHalf = categories.slice(0, halfIndex);
	const secondHalf = categories.slice(halfIndex);
	return (
		<footer className="wrapp-footer">
			<div className="footer-box-01">
				<div className="container">
					<div className="row">
						<div className="col-sm-12 col-md-6 col-lg-3">
							<Link to="/" className="footer-logo">
								<img src={logo} alt="" className='logo'></img>
							</Link>
							<ul className="widget-contact">
								<li>
									<h4 className="widget-contact__title">Email:</h4>
									<p className="widget-contact__text">
										<a className="widget-contact__text-email" href="mailto:support@educatorplatform.com">support@educatorplatform.com</a>
									</p>
								</li>
							</ul>
						</div>
						<div className="col-sm-12 col-md-6 col-lg-3">
							<div className="widget-link">
								<h3 className="widget-title">Explore</h3>
								<ul className="widget-list">
									<li>
										<a href="#">For Instructors</a>
									</li>
									<li>
										<a href="#">For Buisness</a>
									</li>
									<li>
										<a href="#">Courses</a>
									</li>
									<li>
										<a href="#">Testimonials</a>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-sm-12 col-md-6 col-lg-3">
							<div className="widget-link">
								<h3 className="widget-title">Categories</h3>
								<ul className="widget-list">
									{firstHalf.map((cat) => (
										<li>
											<Link to={`/courses/${cat.name}`}>{cat.name}</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="col-sm-12 col-md-6 col-lg-3">
							<div className="widget-link">
								<h3 className="widget-title">Categories</h3>
								<ul className="widget-list">
									{secondHalf.map((cat) => (
										<li>
											<Link>{cat.name}</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-box-02">
				<div className="container">
					<div className="row">
						<div className="col-sm-4 col-md-4 col-lg-4">
							<p className="copy-info">&copy; 2017 Educator Platform. All Rights Reserved</p>
						</div>
						<div className="col-sm-4 col-md-4 col-lg-4 text-center">
							<ul className="social-list-01">
								<li>
									<a href="#">
										<i className="fa fa-facebook" aria-hidden="true"></i>
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-twitter" aria-hidden="true"></i>
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-instagram" aria-hidden="true"></i>
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-google-plus" aria-hidden="true"></i>
									</a>
								</li>
							</ul>
						</div>
						<div className="col-sm-4 col-md-4 col-lg-4">
							<div className="footer-info">
								<a className="footer-info__01" href="#">Privacy Policy</a>
								<a className="footer-info__02" href="#">Terms Of use</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<a href="#" className="back2top" title="Back to Top">Back to Top</a>
		</footer>
	)
}

export default Footer