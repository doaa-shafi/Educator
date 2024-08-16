import SignUp from './pages/SignUp/SignUp';
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import TeachWithUs from './pages/TeachWithUs/TeachWithUs';
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import Enterprise from './pages/Enterprise/Enterprise';
import CorporateDashBoard from './pages/CorporateDashBoard/CorporateDashBoard';
import InstructorDashBoardDraftCourses from './pages/InstructorDashBoardDraftCourses/InstructorDashBoardDraftCourses';
import CreateCourseBasicInfo from './pages/CreateCourseBasicInfo/CreateCourseBasicInfo';
import CreateCourseLearning from './pages/CreateCourseLearning/CreateCourseLearning';
import CreateCoursePricing from './pages/CreateCoursePricing/CreateCoursePricing';
import CreateCourseLessons from './pages/CreateCourseLessons/CreateCourseLessons';
import CreateLesson from './pages/CreateLesson/CreateLesson'
import StudyPage from './pages/StudyCourse/StudyCourse';
import AboutCourse from './pages/AboutCourse/AboutCourse';
import ITraineeDashBoardEnrollments from './pages/ITraineeDashBoardEnrollments/ITraineeDashBoardEnrollments';



function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="/for-enterprise" element={<Enterprise />} />
        <Route path="/teach-with-us" element={<TeachWithUs />} />
        <Route path="/instructor-dashboard/draft-courses" element={<InstructorDashBoardDraftCourses />} />
        <Route path="/create-course-info/:id" element={<CreateCourseBasicInfo />} />
        <Route path="/create-course-learnings/:id" element={<CreateCourseLearning />} />
        <Route path="/create-course-pricing/:id" element={<CreateCoursePricing />} />
        <Route path="/create-course-lessons/:id" element={<CreateCourseLessons />} />
        <Route path="/create-course/:courseId/create-lesson/:lesson_id" element={<CreateLesson/>} />
        <Route path="/course-preview/:id" element={<AboutCourse />} />
        <Route path="/course/:id" element={<StudyPage />} />
        <Route path="/ITrainee-dashboard-enrollments" element={<ITraineeDashBoardEnrollments />} />
        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={['corporate']} />}>
        <Route path="/corporate-dashboard" element={<CorporateDashBoard />} />
       
        
        </Route>

        <Route element={<RequireAuth allowedRoles={['instructor']} />}>
        
        </Route>


        <Route element={<RequireAuth allowedRoles={[]} />}>
          
        </Route>

        <Route element={<RequireAuth allowedRoles={[]} />}>
          
        </Route>

        {/* catch all */}
      </Route>
    </Routes>
  );
}

export default App;