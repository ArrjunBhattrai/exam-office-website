import React from "react";
import { useSelector } from "react-redux";
import "./HODHome.css";
import Sidebar from "../../../components/Sidebar";
import ActivityHeader from "../../../components/ActivityHeader";
import RedFooter from "../../../components/RedFooter";
import RedHeader from "../../../components/RedHeader";

const HODHome = () => {
  const user = useSelector((state) => state.auth.user); // Get logged-in user
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="hod-home-container">
      <div className="hod-bg">
        <RedHeader />
        <div className="hod-content">
          <ActivityHeader />

          <div className="hod-main">
            <div className="sidebars">
            <Sidebar 
            className="sidebar-1"
              title=" HOD Activity"
              activities={[
                "Faculty Allocation",
                "Create New Faculty",
                "Upload Data for Electives",
                "View Correction Requests",
                "View Department Details",
              ]}
            />
            <Sidebar
            className="sidebar-2"
              title=" Form Dashboard"
              activities={[
                "View Saved Form",
                "View Filled Form",
                "Delete Filled Form",
              ]}
            />
            </div>
            

            <div className="hod-info">
                <div className="hod-sec">
                <p>
                <span>Welcome: </span>
                <span className="hod-name">{user?.name || "HOD IT"}</span>
              </p>
              <p>
                <span className="hod-role">Role: </span>
                <span className="hod-name">[{user?.role || "HOD"}]</span>
              </p>
              <p>
                <span className="hod-role">Department: </span>
                <span className="hod-name">
                  [{user?.department || "Department of Information Technology"}]
                </span>
              </p>
                </div>
            
            </div>
          </div>

          <RedFooter />
        </div>
      </div>
    </div>
    // <div>
    //   <ActivityHeader />
    //   <div>
    //
    //     <div className="hod-info">

    //         <>
    //           <p>
    //             <span>Welcome: </span>
    //             <span>{user?.name || "HOD IT"}</span>
    //           </p>
    //           <p>
    //             <span>Role: </span>
    //             <span>[{user?.role || "HOD"}]</span>
    //           </p>
    //           <p>
    //             <span>Department: </span>
    //             <span>[{user?.department || "Department of Information Technology"}]</span>
    //           </p>
    //         </>

    //     </div>
    //   </div>
    // </div>
  );
};

export default HODHome;
