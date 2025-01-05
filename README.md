# Educator Platform

**Educator Platform** is an online education platform designed to facilitate learning and training for individuals and organizations. The platform supports multiple types of users, each with specific roles and permissions, including instructors, individual trainees, corporates, corporate trainees, and admins.

## Table of Contents

- [Project Overview](#project-overview)
- [User Roles and Features](#user-roles-and-features)
  - [Instructor](#instructor)
  - [Individual Trainee](#individual-trainee)
  - [Corporate](#corporate)
  - [Corporate Trainee](#corporate-trainee)
  - [Admin](#admin)
- [Revenue Model](#revenue-model)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [License](#license)

## Project Overview

Educator Platform is a comprehensive e-learning solution that provides a structured environment for instructors to create and monetize courses, individual learners to gain new skills, and corporations to manage the professional development of their employees. The platform supports multiple user roles with customized features for each role to ensure an effective and streamlined experience.

## User Roles and Features

### Instructor

Instructors are responsible for creating and managing course content on the platform. They have the following features:
- **Course Creation**: Instructors can create, update, and publish courses.
- **Revenue Share**: Instructors receive 70% of the price for each enrollment to their courses.
- **Student Management**: Instructors can view and track enrollments and progress for individual trainees and corporate trainees.
- **Certification**: Instructors may define completion criteria for their courses so that certifications can be awarded.

### Individual Trainee

Individual Trainees are users who enroll in courses to enhance their skills and knowledge. Key features include:
- **Course Enrollment**: Trainees can browse, purchase, and enroll in courses created by instructors.
- **Certification**: Upon successful completion of a course, trainees receive a certification.
- **Progress Tracking**: Trainees can track their course progress and manage completed courses in their profile.

### Corporate

Corporate accounts represent companies that manage training programs for their employees. Corporates have the following features:
- **Bulk Enrollment**: Corporates can register multiple trainees under their corporate account.
- **Course Assignment**: Corporates can assign courses to their trainees, providing customized training plans.
- **Progress Monitoring**: Corporates can monitor the progress of their trainees across various courses.
  
### Corporate Trainee

Corporate Trainees are employees enrolled in courses by their corporate employer. They have similar permissions to individual trainees but may have their courses assigned by the corporate account. Features include:
- **Course Access**: Corporate Trainees can access and complete courses assigned by their employer.
- **Certification**: Corporate Trainees also receive certifications upon course completion.
- **Progress Tracking**: They can track their own progress and view assigned courses.

### Admin

Admins have control over the platform's operations and user management. Their features include:
- **User Management**: Admins can manage user accounts across all roles (instructors, trainees, corporates, etc.).
- **Content Moderation**: Admins can review, approve, or remove courses based on platform policies.
- **Revenue and Financial Oversight**: Admins have access to revenue reports and can oversee payment distributions to instructors.
- **Platform Analytics**: Access to analytics and data on user engagement, course performance, and more.

## Revenue Model

The Educator Platform follows a revenue-sharing model:
- **Instructors** receive 70% of the enrollment fee for each individual or corporate trainee enrollment in their courses.
- **Platform** retains 30% of each enrollment fee as a service charge for maintaining the platform and providing support.

## Installation and Setup

To set up the Educator Platform locally, follow these steps:

### Prerequisites
- **Node.js** and **npm**: Make sure you have Node.js and npm installed.
- **Database**: Set up a MongoDB or other database for storing platform data.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/doaa-shafi/Educator.git


2.Install the dependencies:
    ```bash
    npm install--force  in both directories frontend and backend

3.Set up environment variables:
    Create a .env file in the root directory.
    Add your database connection string, API keys, and other environment variables.

4.Start the development server:
    npm run start for the frontend directory 
    node app.js   for backend directory

### Usage

Sign up as an instructor, individual trainee, or corporate.
Create courses (instructor) or Enroll in courses (individual trainee).
Add trainees, manage trainees (corporate), assign courses, and monitor their progress.
Track revenue and earnings as an instructor.
Admin functionalities allow user and course management to ensure platform quality.

### Technologies Used

Frontend: React, HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB
Payment Gateway: Stripe (for handling payments)
Authentication: JWT (JSON Web Token)


## Screenshots

### Home Page
This is the main landing page where users can browse courses and sign up.

![Home Page](./assets/homepage.png)

### Course Creation (Instructor View)
Instructors can create and manage their courses from this page.

![Course Creation](./assets/course-creation.png)









