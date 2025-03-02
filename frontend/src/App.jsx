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
          <Route path="/hod-fac-alloc-table" element={<FacultyAllocationTable />} />          
          <Route path="/hod-upload" element={<UploadCSV />} />          
          <Route path="/hod-correction-req" element={<HODCorrectionReq />} />          
          <Route path="/hod-deptt-details" element={<HODViewDeptt />} />          
          <Route path="/hod-new-fac" element={<CreateNewFaculty/>} />          
          <Route path="/delete-form" element={<DeleteForm/>} /> 
          <Route path="/filled-form" element={<FilledForm/>} />          
          <Route path="/saved-form" element={<SavedForm/>} />        
          <Route path="/progress-report" element={<ProgressReport/>} />        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
