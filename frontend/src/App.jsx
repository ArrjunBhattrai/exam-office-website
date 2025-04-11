import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminHome from "./pages/Admin/AdminHome";
import CourseManagement from "./pages/Admin/Course";
import BranchManagement from "./pages/Admin/BranchManagment";
import SessionManagement from "./pages/Admin/SessionManagament";
import AcademicSchemeUpload from "./pages/Admin/AcademicSchemeUpload";
import StudentDataUpload from "./pages/Admin/StudentDataUpload";
import AdminRequest from "./pages/Admin/AdminRequest";
import AdminProgressReport from "./pages/Admin/AdminProgressReport";

import HODHome from "./pages/HOD/HODHome";
import HODViewDeptt from "./pages/HOD/HODViewDeptt";
import RegistrationRequest from "./pages/HOD/RegistrationRequest";
import FacultyAllocation from "./pages/HOD/FacultyAllocation";
import HODCorrectionReq from "./pages/HOD/HODCorrectionReq";
import HodProgressReport from "./pages/HOD/HodProgressReport";



import FacultyHome from "./pages/Faculty/FacultyHome";
import ViewSubjects from "./pages/Faculty/ViewSubjects";
import FacCorrectionReq from "./pages/Faculty/FacCorrectionReq";
import FacFilledForm from "./pages/Faculty/FacFilledForm";
import MarksFeed from "./pages/Faculty/MarksFeed";
import MarksEntry from "./pages/Faculty/MarksEntry";


//Faculty imports
// import FacultyHome from "./pages/Faculty/FacultyHome";
// import ViewSubjects from "./pages/Faculty/ViewSubjects";
// import FacCorrectionReq from "./pages/Faculty/FacCorrectionReq";
// import FacFilledForm from "./pages/Faculty/FacFilledForm";
// import MarksFeed from "./pages/Faculty/MarksFeed";
// import MarksEntry from "./pages/Faculty/MarksEntry";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/course-management" element={<CourseManagement />} />
          <Route path="/admin/branch-management" element={<BranchManagement />} />
          <Route path="/admin/session-management" element={<SessionManagement />} />
          <Route path="/admin/academic-scheme-upload" element={<AcademicSchemeUpload />} />
          <Route path="/admin/student-data-upload" element={<StudentDataUpload />} />
          <Route path="/admin/req" element={<AdminRequest />} />
          <Route path="/admin/progress-report" element={<AdminProgressReport />} />
           
          <Route path="/hod/home" element={<HODHome />} />
          <Route path="/hod/faculty-allocation" element={<FacultyAllocation />} />
          <Route path="/hod/department-details" element={<HODViewDeptt />} />
          <Route path="/hod/correction-request" element={<HODCorrectionReq />} />
          <Route path="/hod/progress-report" element={<HodProgressReport />} />
          <Route path="/hod/registration-request" element={<RegistrationRequest />} />

          <Route path="/fac-view-sub" element={<ViewSubjects />} />
          <Route path="/fac-home" element={<FacultyHome />} />
          <Route path="/fac-correction-req" element={<FacCorrectionReq />} />
          <Route path="/fac-filled-form" element={<FacFilledForm />} />
          <Route path="/fac-marks-feed" element={<MarksFeed />} />
          <Route path="/fac-marks-entry" element={<MarksEntry />} />
           
        </Routes>
      </div>
    </Router>
  );
}

export default App;
