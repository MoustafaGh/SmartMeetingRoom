import NavItem from './NavItem';
import './SideBar.css';
import { useState } from 'react';

function Sidebar({ activePage, setActivePage, onSignOut, notificationCount }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div>
        <button className="nav-btn" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
      </div>
      <NavItem PageName="Home" icon="house" isActive={activePage === 'Home'} collapsed={collapsed} onClick={setActivePage} />
      <NavItem PageName="Calendar" icon="calendar" isActive={activePage === 'Calendar'} collapsed={collapsed} onClick={setActivePage} />
      <NavItem
        PageName="Notifications"
        icon="bell"
        isActive={activePage === 'Notifications'}
        collapsed={collapsed}
        onClick={setActivePage}
        badgeCount={notificationCount}
      />
      <NavItem PageName="ArchivedClasses" icon="archive" isActive={activePage === 'ArchivedClasses'} collapsed={collapsed} onClick={setActivePage} />
      <NavItem PageName="EMS" icon="kanban" isActive={activePage === 'EMS'} collapsed={collapsed} onClick={setActivePage} />

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
