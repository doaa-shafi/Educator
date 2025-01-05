import { Routes, Route } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
//public
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TeachWithUs from "./pages/TeachWithUs";
import Enterprise from "./pages/Enterprise/Enterprise";
import AboutCourse from "./pages/AboutCourse2";
import Courses from './pages/Courses'
//instructor dashboard
import InstructorDashBoardDraftCourses from "./pages/InstructorDashBoardDraftCourses";
import InstructorDashBoardClosedCourses from "./pages/InstructorDashBoardClosedCourses";
import InstructorDashBoardOpenedCourses from "./pages/InstructorDashBoardOpenCourses";
import InstructorDashBoardLandingPage from "./pages/InstructorDashBoardLandingPage";
import InstructorDashBoardWallet from "./pages/InstructorDashBoardWallet";
//create course
import CreateCourse from "./pages/CreateCourse";
import CreateLesson from "./pages/CreateLesson";

import StudyPage from "./pages/StudyCourse/StudyCourse";
import ITraineeDashBoardEnrollments from "./pages/ITraineeDashBoardEnrollments";

import CorporateDashBoardTrainees from "./pages/CorporateDashBoardTrainees";
import CorporateDashBoardTrainee from "./pages/corporateDashBoardTrainee";
import CorporateDashBoardTeam from "./pages/CorporateDashBoardTeam";
import CorporateDashBoardPlanAndPayment from "./pages/CorporateDashBoardPlanAndPayment";
import CorporateDashBoardCourses from "./pages/CorporateDashBoardCourses";

import InstructorCoursePreview from "./pages/InstructorCoursePreview";
import InstructorLandingPage from "./pages/InstructorLandingPage";

const stripePromise = loadStripe('pk_test_51QHO02DO3byePzbJj26959Nt4iMfqcb4cjCpwlEuQqUCrPMdaMVqa2BLhx0zgNHVbXIyxEMCq4iqHFlZ6i3VbDk100GIhfxyR6');


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/for-buisness" element={<Enterprise />} />
        <Route path="/teach-with-us" element={<TeachWithUs />} />
        <Route path="sign-in" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="/course-preview/:id" element={<AboutCourse />} />
        <Route path="/courses/:category?" element={<Courses />} />
        <Route path="/instructor/:id" element={<InstructorLandingPage />} />
        <Route path="/course/:id" element={<StudyPage />} />
        <Route
          path="/ITrainee-dashboard-enrollments"
          element={<ITraineeDashBoardEnrollments />}
        />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={["Corporate"]} />}>
          <Route
            path="/corporate-dashboard/trainees"
            element={<CorporateDashBoardTrainees />}
          />
          <Route
            path="/corporate-dashboard/trainees/:id"
            element={<CorporateDashBoardTrainee />}
          />
          <Route
            path="/corporate-dashboard/courses"
            element={<CorporateDashBoardCourses />}
          />
        
          <Route
            path="/team/:id"
            element={<CorporateDashBoardTeam />}
          />
          <Route
            path="/corporate-dashboard/Plan&Payment/"
            element={<CorporateDashBoardPlanAndPayment />}
          />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Instructor"]} />}>
          <Route
            path="/instructor-dashboard/draft-courses"
            element={<InstructorDashBoardDraftCourses />}
          />
          <Route
            path="/instructor-dashboard/open-courses"
            element={<InstructorDashBoardOpenedCourses />}
          />
          <Route
            path="/instructor-dashboard/closed-courses"
            element={<InstructorDashBoardClosedCourses />}
          />
          <Route
            path="/instructor-dashboard/landing-page"
            element={<InstructorDashBoardLandingPage />}
          />
          <Route
            path="/instructor-dashboard/wallet"
            element={<InstructorDashBoardWallet />}
          />
          <Route
            path="/create-course/:id"
            element={<CreateCourse />}
          />
          <Route
            path="/create-course/:courseId/create-lesson/:lesson_id"
            element={<CreateLesson />}
          />
          <Route
            path="/instructor-course-preview/:courseId"
            element={<InstructorCoursePreview />}
          />
          
        </Route>

        <Route element={<RequireAuth allowedRoles={[]} />}></Route>

        <Route element={<RequireAuth allowedRoles={[]} />}></Route>

        {/* catch all */}
      </Route>
    </Routes>
  );
}

export default App;
