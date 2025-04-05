import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminHome from "./pages/Admin/AdminHome";
import CourseManagement from "./pages/Admin/Course";
import BranchManagement from "./pages/Admin/BranchManagment";
import SessionManagement from "./pages/Admin/SessionManagament";
import AssignHOD from "./pages/Admin/AssignHOD";
import AdminUpload from "./pages/Admin/AdminUpload";
import AdminRequest from "./pages/Admin/AdminRequest";
import AdminProgressReport from "./pages/Admin/AdminProgressReport";

import HODHome from "./pages/HOD/HODHome";
import FacultyAllocation from "./pages/HOD/FacultyAllocation";
import HODViewDeptt from "./pages/HOD/HODViewDeptt";
import HODCorrectionReq from "./pages/HOD/HODCorrectionReq";
import HodProgressReport from "./pages/HOD/HodProgressReport";
import RegistrationRequest from "./pages/HOD/RegistrationRequest";
/*
import FacultyLogin from "./pages/Faculty/FacultyLogin";
import FacultyRegister from "./pages/Faculty/FacultyRegister";
import FacultyHome from "./pages/Faculty/FacultyHome";
import ViewSubjects from "./pages/Faculty/ViewSubjects";
import FacCorrectionReq from "./pages/Faculty/FacCorrectionReq";
import FacFilledForm from "./pages/Faculty/FacFilledForm";
import MarksFeed from "./pages/Faculty/MarksFeed";
import MarksEntry from "./pages/Faculty/MarksEntry";
*/

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
          
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/course-management" element={<CourseManagement />} />
          <Route path="/branch-management" element={<BranchManagement />} />
          <Route path="/session-management" element={<SessionManagement />} />
          {/* <Route path="/faculty-management" element={<FacultyManagement />} /> */}
          <Route path="/assign-hod" element={<AssignHOD />} />
          {/* <Route path="/admin-new-sub" element={<AdminNewSub />} /> */}
          <Route path="/admin-upload" element={<AdminUpload />} />
          <Route path="/admin-req" element={<AdminRequest />} />
          <Route path="/admin-prog-report" element={<AdminProgressReport />} />
           
          <Route path="/hod-home" element={<HODHome />} />
          <Route path="/hod-fac-alloc" element={<FacultyAllocation />} />
          <Route path="/hod-deptt-details" element={<HODViewDeptt />} />
          <Route path="/hod-correction-req" element={<HODCorrectionReq />} />
          <Route path="/hod-prog-report" element={<HodProgressReport />} />
          <Route path="/hod-reg-req" element={<RegistrationRequest />} />

          {/*
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/faculty-register" element={<FacultyRegister />} />
          <Route path="/fac-home" element={<FacultyHome />} />
          <Route path="/fac-view-sub" element={<ViewSubjects />} />
          <Route path="/fac-correction-req" element={<FacCorrectionReq />} />
          <Route path="/fac-filled-form" element={<FacFilledForm />} />
          <Route path="/fac-marks-feed" element={<MarksFeed />} />
          <Route path="/fac-marks-entry" element={<MarksEntry />} />
           */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
