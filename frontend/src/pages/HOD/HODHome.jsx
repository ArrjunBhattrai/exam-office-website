import { useEffect, useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import "./hod.css";
import {logoutUser} from "../../utils/logout"
import Sidebar from "../../components/Sidebar";
import ActivityHeader from "../../components/ActivityHeader";
import RedFooter from "../../components/RedFooter";
import RedHeader from "../../components/RedHeader";
import { FaHome, FaPen, FaSignOutAlt } from "react-icons/fa";
import { fetchLatestSession } from "../../utils/fetchSession"; 

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const HODHome = () => {
  const { userId, isAuthenticated, role, token, branchId } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated || role != "hod") {
    return (
      <div>
        You are not authorized to view this page. Please login to get access to
        this page.
      </div>
    );
  }

  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await fetchLatestSession(token);
        setSession(data);
      } catch (err) {
        setError("No current session found");
        setSession(null);
      }
    };

    loadSession();
  }, [token]);

  const handleLogout = () => {
    logoutUser(dispatch);
  };

  return (
    <div className="home-container">
      <div className="user-bg">
        <RedHeader />
        <div className="user-content">
          <ActivityHeader />

          <div className="user-main">
            <div className="sidebars">
              <Sidebar
                className="sidebar-0"
                title="HOD Activities"
                activities={[
                  {
                    name: "View Department Details",
                    path: "/hod/department-details",
                  },
                  {
                    name: "Registration Requests",
                    path: "/hod/registration-request",
                  },
                  {
                    name: "Faculty Allocation",
                    path: "/hod/faculty-allocation",
                  },
                  {
                    name: "Upload Electives Data",
                    path: "/hod/elective-data",
                  },
                ]}
              />
            </div>

            <div className="user-info">
              <div className="user-icons">
                <button
                  className="icon-btn"
                  onClick={() => (window.location.href = "/hod-home")}
                >
                  <FaHome className="icon" />
                  Home
                </button>
                <button
                  className="icon-btn"
                  onClick={() =>
                    (window.location.href = "/edit-user-information")
                  }
                >
                  <FaPen className="icon" />
                  Edit Info
                </button>
                <button
                  className="icon-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="icon" />
                  Logout
                </button>
              </div>
              <div className="user-sec">
                <p>
                  <span>Welcome: </span>
                  <span className="user-name">{userId && `[${userId}]`}</span>
                </p>

                <p>
                  <span className="user-role">Role: </span>
                  <span className="user-name">[{role && `${role}`}]</span>
                </p>
              </div>
              <div className="fac-alloc">
                {session ? (
                  <p className="session-text">
                    Current Session: {monthNames[session.start_month]} {session.start_year} -{" "}
                    {monthNames[session.end_month]} {session.end_year}
                  </p>
                ) : (
                  <p className="session-text">{error}</p>
                )}
              </div>
            </div>
          </div>

          <RedFooter />
        </div>
      </div>
    </div>
  );
};

export default HODHome;
