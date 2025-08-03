import NavItem from './NavItem';
import './SideBar.css';
import { useState, useEffect } from 'react';
import api from '../api';

function Sidebar({ activePage, setActivePage, onSignOut, userRole }) {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const userId = parseInt(localStorage.getItem("userId"));
        const res = await api.get(`/Notification/user/${userId}`);
        const unread = res.data.filter(n => !n.isRead);
        setNotificationCount(unread.length);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotificationCount();
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div>
        <button className="nav-btn" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      </div>

      <NavItem 
      PageName="Home" 
      icon="house" 
      isActive={activePage === 'Home'} 
      collapsed={collapsed} 
      onClick={setActivePage} />
      <NavItem 
      PageName="Calendar" 
      icon="calendar" 
      isActive={activePage === 'Calendar'} 
      collapsed={collapsed} 
      onClick={setActivePage} />
      <NavItem
        PageName="Notifications"
        icon="bell"
        isActive={activePage === 'Notifications'}
        collapsed={collapsed}
        onClick={setActivePage}
        badgeCount={notificationCount}
      />
      <NavItem 
      PageName="ArchivedMeeting" 
      icon="archive" 
      isActive={activePage === 'ArchivedMeeting'} 
      collapsed={collapsed} 
      onClick={setActivePage} />
      {userRole === 'Admin' && (
        <NavItem 
        PageName="EMS" 
        icon="kanban"
         isActive={activePage === 'EMS'}
          collapsed={collapsed}
           onClick={setActivePage} />
      )}

      <div className="sign-out">
        <button onClick={onSignOut} className="sign-out-btn">
          <i className="bi bi-box-arrow-right"></i>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
