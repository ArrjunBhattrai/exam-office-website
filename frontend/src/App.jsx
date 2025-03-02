import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useSelector } from "react-redux";
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
