import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";

import AdminLogin from "./pages/Admin/AdminAuth/AdminLogin";
import AdminRegister from "./pages/Admin/AdminAuth/AdminRegsiter";
import AdminHome from "./pages/Admin/AdminActivities/AdminHome";
import CourseManagement from "./pages/Admin/AdminActivities/Course";
import BranchManagement from "./pages/Admin/AdminActivities/BranchManagment";
import SessionManagement from "./pages/Admin/AdminActivities/SessionManagament";
import FacultyManagement from "./pages/Admin/AdminActivities/FacultyManagement";
import AssignHOD from "./pages/Admin/AdminActivities/AssignHOD";
import AdminNewSub from "./pages/Admin/AdminActivities/AdminNewSub";
import AdminUpload from "./pages/Admin/AdminActivities/AdminUpload";
import AdminRequest from "./pages/Admin/AdminActivities/AdminRequest";
import AdminProgressReport from "./pages/Admin/AdminActivities/AdminProgressReport";

import HODLogin from "./pages/HOD/HODAuth/HODLogin";
import HODRegister from "./pages/HOD/HODAuth/HODRegister";
import HODHome from "./pages/HOD/HODActivities/HODHome";
import FacultyAllocation from "./pages/HOD/HODActivities/FacultyAllocation";
import HODViewDeptt from "./pages/HOD/HODActivities/HODViewDeptt";
import HODCorrectionReq from "./pages/HOD/HODActivities/HODCorrectionReq";

import FacultyLogin from "./pages/Faculty/FacultyAuth/FacultyLogin";
import FacultyRegister from "./pages/Faculty/FacultyAuth/FacultyRegister";
import FacultyHome from "./pages/Faculty/FacultyActivities/FacultyHome";
import ViewSubjects from "./pages/Faculty/FacultyActivities/ViewSubjects";
import FacCorrectionReq from "./pages/Faculty/FacultyActivities/FacCorrectionReq";
import FacFilledForm from "./pages/Faculty/FacultyActivities/FacFilledForm";
import MarksFeed from "./pages/Faculty/FacultyActivities/MarksFeed";
import MarksEntry from "./pages/Faculty/FacultyActivities/MarksEntry";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* admin routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/course-management" element={<CourseManagement />} />
          <Route path="/branch-management" element={<BranchManagement />} />
          <Route path="/session-management" element={<SessionManagement />} />
          <Route path="/faculty-management" element={<FacultyManagement />} />
          <Route path="/assign-hod" element={<AssignHOD />} />
          <Route path="/admin-new-sub" element={<AdminNewSub />} />
          <Route path="/admin-upload" element={<AdminUpload />} />
          <Route path="/admin-req" element={<AdminRequest />} />
          <Route path="/admin-prog-report" element={<AdminProgressReport />} />

          {/* hod routes */}
          <Route path="/hod-login" element={<HODLogin />} />
          <Route path="/hod-register" element={<HODRegister />} />
          <Route path="/hod-home" element={<HODHome />} />
          <Route path="/hod-fac-alloc" element={<FacultyAllocation />} />
          <Route path="/hod-deptt-details" element={<HODViewDeptt />} />
          <Route path="/hod-correction-req" element={<HODCorrectionReq />} />

          {/* faculty routes */}
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/faculty-register" element={<FacultyRegister />} />
          <Route path="/fac-home" element={<FacultyHome />} />
          <Route path="/fac-view-sub" element={<ViewSubjects />} />
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
