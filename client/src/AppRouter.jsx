import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./components/LandingPage.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Step1 from "./components/GetStarted/Step1_Disability.jsx";
import Step2 from "./components/GetStarted/Step2_Skills.jsx";
import Step3 from "./components/GetStarted/Step3_JobType.jsx";
import Step4 from "./components/GetStarted/Step4_Location.jsx";
import Step5 from "./components/GetStarted/Step5_Salary.jsx";
import Step6 from "./components/GetStarted/Step6_Review.jsx";
import JobRecommendation from "./components/Jobs/JobRecommendation.jsx";
import Layout from "./components/Layout.jsx";
import { JobProvider } from "./context/JobContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SetupRoute } from "./components/SetupRoute";
import Profile from "./components/Profile/Profile.jsx";
import CreateResume from "./components/Resume/CreateResume.jsx";
import ResumePage from "./components/Resume/ResumePage.jsx";
import UploadResume from "./components/Resume/UploadResume.jsx";
import JobDetails from "./components/Jobs/JobDetails.jsx";
import InterviewPrep from "./components/Jobs/InterviewPrep.jsx";
import Certificate from "./components/Profile/Certificate.jsx";

const AppRouter = () => {
  return (
    <Router>
      <JobProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Get Started Flow - Protected but only for users who haven't completed setup */}
          <Route element={<SetupRoute />}>
            <Route path="/get-started/step1" element={<Step1 />} />
            <Route path="/get-started/step2" element={<Step2 />} />
            <Route path="/get-started/step3" element={<Step3 />} />
            <Route path="/get-started/step4" element={<Step4 />} />
            <Route path="/get-started/step5" element={<Step5 />} />
            <Route path="/get-started/step6" element={<Step6 />} />
          </Route>
          
          {/* Routes inside Layout - Protected and requires setup to be completed */}
          <Route element={<ProtectedRoute requireSetup={true} />}>
            <Route element={<Layout />}>
              <Route path="/jobs" element={<JobRecommendation />} />
              <Route path="/job-details" element={<JobDetails />} /> 
              <Route path="/interview-prep" element={<InterviewPrep />} />           
              <Route path="/profile" element={<Profile />} />
              <Route path="/certificate" element={<Certificate />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/create-resume" element={<CreateResume />} />
              <Route path="/upload-resume" element={<UploadResume />} />
              {/* <Route path="/settings" element={<div>Settings Page</div>} /> */}
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </JobProvider>
    </Router>
  );
};

export default AppRouter;