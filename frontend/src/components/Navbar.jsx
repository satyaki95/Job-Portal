import { useEffect, useRef, useState } from "react";
import { navbarStyles as s } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import {
  Bookmark,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Home,
  LogIn,
  LogOut,
  Menu,
  Search,
  User,
  UserPen,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { id: "home", label: "Home", path: "/", icon: <Home size={18} /> },
  { id: "jobs", label: "Jobs", path: "/jobs", icon: <Search size={18} /> },
  { id: "saved", label: "Saved", path: "/saved", icon: <Bookmark size={18} /> },
  { id: "applications", label: "Applications", path: "/applications", icon: <ClipboardList size={18} /> },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    icon: <UserPen size={18} />,
  },
];

const STORAGE_KEY = "jobportal_user";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
      else setUser(null);
    } catch (e) {
      setUser(null);
    }
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isUserMenuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNavClick = (item) => {
    setIsMobileMenuOpen(false);
  };

  const isNavItemActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("appliedJob");
    localStorage.removeItem("savedJobs");
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  // to toggle
  const toggleUserMenu = () => setIsUserMenuOpen((v) => !v);

  // to get initial letter of name
  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <nav className={s.navbar(isScrolled)}>
      <div className={s.container}>
        <div className={s.flexContainer}>
          <div className={s.logoSection}>
            <div className={s.logoWrapper}>
              <Link to="/">
                <img
                  src={logo}
                  alt="logo"
                  width={36}
                  height={36}
                  className={s.logoImage}
                />
              </Link>
            </div>
            <div className={s.logoTextContainer}>
              <span className={s.logoTitle}>JobPortal</span>
              <span className={s.logoSubtitle}>Find your dream job</span>
            </div>
          </div>
          {/* desktop navigation */}
          <div className={s.desktopNav}>
            {navItems.map((item) => (
              <div
                key={item.id}
                className={s.navItemContainer}
                onMouseEnter={() => setIsHovered(item.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <Link
                  to={item.path}
                  onClick={() => handleNavClick(item)}
                  className={s.navButton(isNavItemActive(item.path))}
                >
                  <span className={s.navIcon(isHovered === item.id)}>
                    {item.icon}
                  </span>
                  <span className={s.navLabel}>{item.label}</span>
                </Link>
                <div className={s.navUnderline(isHovered === item.id)}></div>
              </div>
            ))}
          </div>
          {/* desktop right actions */}
          <div className={s.desktopActions}>
            <div className={s.actionInner}>
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className={s.loginButton}
                >
                  <div className={s.loginButtonBg}></div>
                  <div className={s.loginButtonContent}>
                    <LogIn className={s.loginIcon} />
                    <span className={s.loginText}>Login</span>
                  </div>
                </button>
              ) : (
                <div className={s.profileButtonContainer} ref={userMenuRef}>
                  <button onClick={toggleUserMenu} className={s.profileButton}>
                    <div className={s.profileAvatar}>
                      {getInitials(user.name)}
                    </div>
                    <div className={s.profileInfo}>
                      <span className={s.profileName}>{user.name}</span>
                      {isUserMenuOpen ? (
                        <ChevronUp className={s.profileChevron} />
                      ) : (
                        <ChevronDown className={s.profileChevron} />
                      )}
                    </div>
                  </button>
                  <div className={s.userDropdown(isUserMenuOpen)}>
                    <Link
                      to="/viewprofile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={s.dropdownItem}
                    >
                      <User className={s.dropdownIcon} />
                      <span className={s.dropdownText}>View profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`${s.dropdownItem} w-full text-left`}
                    >
                      <LogOut className={s.dropdownIcon} />
                      <span className={s.dropdownText}>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* mobile toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={s.mobileToggle}
          >
            {isMobileMenuOpen ? (
              <X className={s.mobileToggleIcon} />
            ) : (
              <Menu className={s.mobileToggleIcon} />
            )}
          </button>
        </div>
        {/* mobile menu */}
        <div className={s.mobileMenu(isMobileMenuOpen)}>
          <div className={s.mobileMenuCard}>
            <div className={s.mobileMenuSpace}>
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => handleNavClick(item)}
                  className={s.mobileNavButton(isNavItemActive(item.path))}
                >
                  <div
                    className={s.mobileNavIconWrapper(
                      isNavItemActive(item.path),
                    )}
                  >
                    {item.icon}
                  </div>
                  <span className={s.mobileNavLabel}>{item.label}</span>
                </Link>
              ))}
              <div className={s.mobileDivider}>
                <div className={s.mobileMenuSpace}>
                  {!user ? (
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className={s.mobileLoginButton}
                    >
                      <LogIn className=" w-5 h-5" />
                      <span className=" font-medium">Login</span>
                    </button>
                  ) : (
                    <>
                      <div className={s.mobileUserInfo}>
                        <div className={s.mobileAvatar}>
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className={s.mobileUserName}>{user.name}</div>
                        </div>
                      </div>
                      <div className={s.mobileProfileGrid}>
                        <Link
                          to="/viewprofile"
                          className={s.mobileProfileButton}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className=" w-5 h-5" />
                          <span className=" font-medium">Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className={s.mobileProfileButton}
                        >
                          <LogOut className=" w-5 h-5" />
                          <span className=" font-medium">Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{s.globalStyles}</style>
    </nav>
  );
};

export default Navbar;
