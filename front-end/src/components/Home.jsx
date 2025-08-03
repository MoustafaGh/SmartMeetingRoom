import Container from "./Container";
import "./Home.css";
import SideBar from "./SideBar";
import { useState } from "react";

function Home({ onLogout, userRole, username }) {
  const [activePage, setActivePage] = useState("Home");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`Home ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <SideBar
        activePage={activePage}
        setActivePage={setActivePage}
        onSignOut={onLogout}
        userRole={userRole}
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <Container activePage={activePage} username={username} />
    </div>
  );
}

export default Home;
