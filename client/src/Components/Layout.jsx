import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice'; // adjust the path as needed
import './Layout.css';
import './Main.css';

// Helper to generate a random color for avatar


const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, userData } = useSelector(state => state.auth);
  console.log(userData);
  function getAvatarColor(username) {
    if (!username || typeof username !== 'string') {
      // fallback color for no username
      return 'hsl(0, 0%, 70%)';
    }
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  }
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  // Get first letter for avatar
  const avatarLetter = userData?.username?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <header className="appbar">
        <div className="toolbar">
          <div className="brand">
            {/* ...SVG... */}
            <Link to="/" className="brand-title">
              PlantDoctor
            </Link>
          </div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/scan">Scan</Link>
            {!isLoggedIn ? (
              <Link to="/login">Login/Signup</Link>
            ) : (
              <div className="user-menu">
                <div
                  className="user-avatar"
                  style={{ background: getAvatarColor(userData.username) }}
                  onClick={() => setDropdownOpen(v => !v)}
                  tabIndex={0}
                  onBlur={() => setDropdownOpen(false)}
                >
                  {avatarLetter}
                </div>
                <span className="user-name" onClick={() => setDropdownOpen(v => !v)}>
                  {userData.username}
                  <svg
                    style={{ marginLeft: 4, verticalAlign: 'middle' }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                  >
                    <path fill="currentColor" d="M7 10l5 5 5-5z" />
                  </svg>
                </span>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </nav>
          <button className="menu-btn" aria-label="Open menu" onClick={handleSidebarToggle}>
            <span />
            <span />
            <span />
          </button>
        </div>

      </header>
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={handleSidebarClose}
      ></div>
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <button className="close-btn" onClick={handleSidebarClose} aria-label="Close menu">
          &times;
        </button>
        <div className="sidebar-brand">
          <Link to="/" onClick={handleSidebarClose}>
            Home
          </Link>
          <Link to="/scan" onClick={handleSidebarClose}>
            Scan
          </Link>
          {!isLoggedIn ? (
            <Link to="/login" onClick={handleSidebarClose}>
              Login/Signup
            </Link>
          ) : (
            <>
              <Link to="/dashboard" onClick={handleSidebarClose}>
                Dashboard
              </Link>
              <button
                className="sidebar-logout"
                onClick={() => {
                  handleSidebarClose();
                  handleLogout();
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </aside>
      <Outlet />
      <footer className="footer">
        <p>&copy; PlantDoctor. This Results are solely for experimental purposes.</p>
      </footer>
    </>
  );
};

export default Layout;
