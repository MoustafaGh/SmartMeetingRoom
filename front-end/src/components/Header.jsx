import './Header.css';

function Header({ username }) {
  return (
    <header>
      <div className="left-section">
        <h2 className="user-name">{username}</h2>
      </div>
      <div className="center-section">
        <h2 className="company-name">Integrated Digital System</h2>
      </div>
    </header>
  );
}

export default Header;
