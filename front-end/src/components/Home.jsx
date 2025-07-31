import Container from "./Container";
import './Home.css';
import SideBar from './SideBar';
import { useState } from "react";

function Home({ onLogout, userRole, username }) {
  const [activePage, setActivePage] = useState('Home');
  const [notificationCount] = useState(7);

  return (
    <div className="Home">
      <SideBar
        activePage={activePage}
        setActivePage={setActivePage}
        onSignOut={onLogout}
        notificationCount={notificationCount}
        userRole={userRole}
      />
      <Container 
      activePage={activePage} 
      username={username} />
    </div>
  );
}

export default Home;