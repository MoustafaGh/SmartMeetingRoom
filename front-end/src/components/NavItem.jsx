import './NavItem.css';

function NavItem({ PageName, icon, isActive, collapsed, onClick, badgeCount }) {
  return (
    <div
      className={`nav-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(PageName)}
    >
      <span className="icon">
        <i className={`bi bi-${icon}`}></i>
        {badgeCount > 0 && PageName === 'Notifications' && (
          <span className="sidebar-badge">{badgeCount}</span>
        )}
      </span>
      {!collapsed && <span>{PageName}</span>}
    </div>
  );
}

export default NavItem;
