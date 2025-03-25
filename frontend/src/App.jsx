import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import FacultyLogin from "./pages/Faculty/FacultyAuth/FacultyLogin";
import FacultyRegister from "./pages/Faculty/FacultyAuth/FacultyRegister";
import HODLogin from "./pages/HOD/HODAuth/HODLogin";
import HODRegister from "./pages/HOD/HODAuth/HODRegister";
import Home from "./pages/Home/Home";
import AdminLogin from "./pages/Admin/AdminAuth/AdminLogin";
import AdminRegister from "./pages/Admin/AdminAuth/AdminRegsiter";
import HODHome from "./pages/HOD/HODActivities/HODHome";
import FacultyAllocation from "./pages/HOD/HODActivities/FacultyAllocation";
import FacultyAllocationTable from "./pages/HOD/HODActivities/FacultyAllocationTable";
import UploadCSV from "./pages/HOD/HODActivities/UploadCSV";
import HODCorrectionReq from "./pages/HOD/HODActivities/HODCorrectionReq";
import HODViewDeptt from "./pages/HOD/HODActivities/HODViewDeptt";
import CreateNewFaculty from "./pages/HOD/HODActivities/CreateNewFaculty";
import DeleteForm from "./pages/HOD/FormDashboard/DeleteForm";
import FilledForm from "./pages/HOD/FormDashboard/FilledForm";
import SavedForm from "./pages/HOD/FormDashboard/SavedForm";
import ProgressReport from "./pages/HOD/FormDashboard/ProgressReport";
import FacultyHome from "./pages/Faculty/FacultyActivities/FacultyHome";
import ViewSubjects from "./pages/Faculty/FacultyActivities/ViewSubjects";
import FacCorrectionReq from "./pages/Faculty/FacultyActivities/FacCorrectionReq";
import FacSavedForm from "./pages/Faculty/FacultyActivities/FacSavedForm";
import FacFilledForm from "./pages/Faculty/FacultyActivities/FacFilledForm";
import MarksFeed from "./pages/Faculty/FacultyActivities/MarksFeed";
import FacDeleteForm from "./pages/Faculty/FacultyActivities/FacDeleteForm";
import AdminHome from "./pages/Admin/AdminActivities/AdminHome";
import AdminUpload from "./pages/Admin/AdminActivities/AdminUpload";
import AdminNewSub from "./pages/Admin/AdminActivities/AdminNewSub";
import AdminUpdateSub from "./pages/Admin/AdminActivities/AdminUpdateSub";
import AdminDeleteSub from "./pages/Admin/AdminActivities/AdminDeleteSub";
import AdminRequest from "./pages/Admin/AdminActivities/AdminRequest";
import AdminDeleteForm from "./pages/Admin/AdminActivities/AdminDeleteForm";
import AdminSavedForm from "./pages/Admin/AdminActivities/AdminSavedForm";
import AdminFilledForm from "./pages/Admin/AdminActivities/AdminFilledForm";
import AdminProgressReport from "./pages/Admin/AdminActivities/AdminProgressReport";
import MarksEntry from "./pages/Faculty/FacultyActivities/MarksEntry";
import BranchManagement from "./pages/Admin/AdminActivities/BranchManagment";
import CourseManagement from "./components/Course/Course";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hod-login" element={<HODLogin />} />
          <Route path="/hod-register" element={<HODRegister />} />
          <Route path="/faculty-login" element={<FacultyLogin />} />
          <Route path="/faculty-register" element={<FacultyRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />

          <Route path="/hod-home" element={<HODHome />} />
          <Route path="/hod-fac-alloc" element={<FacultyAllocation />} />
          <Route
            path="/hod-fac-alloc-table"
            element={<FacultyAllocationTable />}
          />
          <Route path="/hod-upload" element={<UploadCSV />} />
          <Route path="/hod-correction-req" element={<HODCorrectionReq />} />
          <Route path="/hod-deptt-details" element={<HODViewDeptt />} />
          <Route path="/hod-new-fac" element={<CreateNewFaculty />} />
          <Route path="/delete-form" element={<DeleteForm />} />
          <Route path="/filled-form" element={<FilledForm />} />
          <Route path="/saved-form" element={<SavedForm />} />
          <Route path="/progress-report" element={<ProgressReport />} />

          <Route path="/fac-home" element={<FacultyHome />} />
          <Route path="/fac-view-sub" element={<ViewSubjects />} />
          <Route path="/fac-correction-req" element={<FacCorrectionReq />} />
          <Route path="/fac-saved-form" element={<FacSavedForm />} />
          <Route path="/fac-filled-form" element={<FacFilledForm />} />
          <Route path="/fac-delete-form" element={<FacDeleteForm />} />
          <Route path="/fac-marks-feed" element={<MarksFeed />} />
          <Route path="/fac-marks-entry" element={<MarksEntry />} />

          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/admin-upload" element={<AdminUpload />} />
          <Route path="/admin-new-sub" element={<AdminNewSub />} />
          <Route path="/admin-update-sub" element={<AdminUpdateSub />} />
          <Route path="/admin-delete-sub" element={<AdminDeleteSub />} />
          <Route path="/admin-req" element={<AdminRequest />} />
          <Route path="/admin-delete-form" element={<AdminDeleteForm />} />
          <Route path="/admin-saved-form" element={<AdminSavedForm />} />
          <Route path="/admin-filled-form" element={<AdminFilledForm />} />
          <Route path="/admin-prog-report" element={<AdminProgressReport />} />

          <Route path="/course-management" element={<CourseManagement />} />
          <Route path="/branch-management" element={<BranchManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
