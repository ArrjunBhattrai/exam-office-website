import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPass from "./pages/Auth/ForgotPass";
import ResetPass from "./pages/Auth/ResetPass";

import AdminHome from "./pages/Admin/AdminHome";
import SessionManagement from "./pages/Admin/SessionManagament";
import BranchManagement from "./pages/Admin/BranchManagment";
import CourseManagement from "./pages/Admin/CourseManagement";
import SubjectDataUpload from "./pages/Admin/SubjectDataUpload";
import StudentDataUpload from "./pages/Admin/StudentDataUpload";
import ATKTDataUpload from "./pages/Admin/ATKTDataUpload";
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
import MarksFeed from "./pages/Faculty/MarksFeed";
import FacCorrectionReq from "./pages/Faculty/FacCorrectionReq";
import ATKTMarksFeed from "./pages/Faculty/ATKTMarksFeed";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/reset-password" element={<ResetPass />} />

          <Route path="/admin/home" element={<AdminHome />} />
          <Route
            path="/admin/session-management"
            element={<SessionManagement />}
          />
          <Route
            path="/admin/branch-management"
            element={<BranchManagement />}
          />
          <Route
            path="/admin/course-management"
            element={<CourseManagement />}
          />                    
          <Route
            path="/admin/subject-data-upload"
            element={<SubjectDataUpload />}
          />
          <Route
            path="/admin/student-data-upload"
            element={<StudentDataUpload />}
          />
          <Route
            path="/admin/atkt-data-upload"
            element={<ATKTDataUpload />}
          />
          <Route path="/admin/req" element={<AdminRequest />} />
          <Route
            path="/admin/progress-report"
            element={<AdminProgressReport />}
          />

          <Route path="/hod/home" element={<HODHome />} />
          <Route
            path="/hod/faculty-allocation"
            element={<FacultyAllocation />}
          />
          <Route path="/hod/department-details" element={<HODViewDeptt />} />
          <Route
            path="/hod/correction-request"
            element={<HODCorrectionReq />}
          />
          <Route path="/hod/progress-report" element={<HodProgressReport />} />
          <Route
            path="/hod/registration-request"
            element={<RegistrationRequest />}
          />

          <Route path="/faculty/home" element={<FacultyHome />} />
          <Route path="/faculty/view-subjects" element={<ViewSubjects />} />
          <Route path="/faculty/marks-feed" element={<MarksFeed />} />
          <Route path="/faculty/atkt-marks-feed" element={<ATKTMarksFeed />} />
          <Route
            path="/faculty/correction-request"
            element={<FacCorrectionReq />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
