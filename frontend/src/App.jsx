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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
