import Container from "./Container";
import './Home.css';
import SideBar from './SideBar';
import { useState } from "react";

function Home() {
  const [activePage, setActivePage] = useState('Home');
  const [notificationCount] = useState(7); // Example count

  return (
    <div className="Home">
      <SideBar
        activePage={activePage}
        setActivePage={setActivePage}
        notificationCount={notificationCount}
      />
      <Container activePage={activePage} />
    </div>
  );
}

export default Home;
