import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { navbarStyles as s } from "../../assets/adminDummyStyles";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ChevronDown,
  Home,
  List,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import logoFallback from "../../assets/logo.png";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", Icon: Home },
  { key: "jobs", label: "Jobs", Icon: Briefcase },
  { key: "listJob", label: "List Job", Icon: List },
];

const ROUTES = {
  dashboard: "/employer",
  jobs: "/employer/addjobs",
  listJob: "/employer/list/jobs",
};

const EmployerNavbar = ({
  logoSrc,
  brandName = "Employer Hub",
  onNavigate,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const stored =
      localStorage.getItem("jobportal_user") || localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownKey, setOpenDropdownKey] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );
  const navContainerRef = useRef(null);
  const itemRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const isLGOnly = windowWidth >= 1024 && windowWidth < 1280;

  const pathToKey = useCallback((pathname) => {
    const found = Object.entries(ROUTES).find(([, path]) =>
      path === ROUTES.dashboard
        ? pathname === path
        : pathname === path || pathname.startsWith(`${path}/`),
    );
    return found ? found[0] : "dashboard";
  }, []);

  const active = pathToKey(location.pathname);

  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const updateIndicator = useCallback(() => {
    const container = navContainerRef.current;
    const element = itemRefs.current[active];
    if (!container || !element) return setIndicatorStyle({ left: 0, width: 0 });
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    setIndicatorStyle({
      left: elementRect.left - containerRect.left,
      width: elementRect.width,
    });
  }, [active]);

  useLayoutEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const handleNavigate = (key) => {
    setMobileMenuOpen(false);
    setOpenDropdownKey(null);
    onNavigate?.(key);
    navigate(ROUTES[key] || ROUTES.dashboard);
  };

  const handleLogout = () => {
    localStorage.removeItem("jobportal_user");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  const logoToUse = logoSrc || logoFallback;
  return (
    <header className={s.header}>
      <nav className={s.nav}>
        <div className={s.navContainer}>
          <div className={s.navContent}>
            <button
              className={s.logoContainer}
              onClick={() => handleNavigate("dashboard")}
            >
              <span className={s.logoWrapper}>
                <img src={logoToUse} alt="logo" className={s.logoImage} />
              </span>
              <span className={s.logoTextContainer}>
                <span className={s.logoBrandName}>{brandName}</span>
                <span className={s.logoSubtitle}>Build your next team</span>
              </span>
            </button>
            <div className={s.desktopNav}>
              <div ref={navContainerRef} className={s.navIndicatorContainer}>
                {indicatorStyle.width > 0 && (
                  <div
                    className={s.activeIndicator}
                    style={{
                      left: indicatorStyle.left,
                      width: indicatorStyle.width,
                    }}
                  />
                )}
                <ul className={s.navList}>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.Icon;
                    const parentActive =
                      active === item.key ||
                      item.dropdown?.some((sub) => active === sub.key);
                    return (
                      <React.Fragment key={item.key}>
                        <li
                          className={s.navItem}
                          onMouseEnter={() =>
                            item.dropdown &&
                            isLGOnly &&
                            setOpenDropdownKey(item.key)
                          }
                        >
                          <div
                            ref={(el) => {
                              itemRefs.current[item.key] = el;
                            }}
                            className={s.navItemWrapper}
                          >
                            <button
                              onClick={() =>
                                item.dropdown && isLGOnly
                                  ? setOpenDropdownKey(
                                      openDropdownKey === item.key
                                        ? null
                                        : item.key,
                                    )
                                  : handleNavigate(item.key)
                              }
                              className={`${s.navButton} ${parentActive ? s.navButtonActive : s.navButtonInactive}`}
                            >
                              <Icon className={s.navButtonIcon} />
                              <span className={s.navButtonText}>
                                {item.label}
                              </span>
                              {item.dropdown && isLGOnly && (
                                <ChevronDown className={s.navDropdownIcon} />
                              )}
                            </button>
                          </div>
                          {item.dropdown && isLGOnly && (
                            <div
                              className={`${s.dropdownPanel} ${openDropdownKey === item.key ? s.dropdownVisible : s.dropdownHidden}`}
                            >
                              <div className={s.dropdownContent}>
                                <div className={s.dropdownInner}>
                                  {item.dropdown.map((sub) => (
                                    <button
                                      key={sub.key}
                                      onClick={() => handleNavigate(sub.key)}
                                      className={`${s.dropdownItem} ${active === sub.key ? s.dropdownItemActive : s.dropdownItemInactive}`}
                                    >
                                      <span className={s.dropdownItemDot} />
                                      {sub.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                        {!isLGOnly &&
                          item.dropdown?.map((sub) => (
                            <li key={sub.key} className={s.subNavItem}>
                              <button
                                onClick={() => handleNavigate(sub.key)}
                                className={`${s.subNavButton} ${active === sub.key ? s.subNavButtonActive : s.subNavButtonInactive}`}
                              >
                                <span className={s.subNavDot} />
                                {sub.label}
                              </button>
                            </li>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className={s.rightActions}>
              <div className={s.desktopAuth}>
                {user && (
                  <div className={s.userMenuContainer}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={s.userMenuButton}
                    >
                      <User className={s.userIcon} />
                      <span className={s.userName}>{user.name}</span>
                      <ChevronDown className={s.userDropdownIcon} />
                    </button>
                    <div
                      className={`${s.userDropdown} ${userMenuOpen ? s.userDropdownVisible : s.userDropdownHidden}`}
                    >
                      <div className={s.userDropdownInner}>
                        <button
                          onClick={handleLogout}
                          className={s.logoutButton}
                        >
                          <LogOut className={s.logoutIcon} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={s.mobileMenuButton}
              >
                {mobileMenuOpen ? (
                  <X className={s.mobileMenuIcon} />
                ) : (
                  <Menu className={s.mobileMenuIcon} />
                )}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className={s.mobileMenu}>
              <div className={s.mobileMenuContent}>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.Icon;
                  return (
                    <div key={item.key} className={s.mobileNavItem}>
                      <button
                        onClick={() => handleNavigate(item.key)}
                        className={`${s.mobileNavButton} ${active === item.key ? s.mobileNavButtonActive : s.mobileNavButtonInactive}`}
                      >
                        <Icon className={s.mobileNavIcon} />
                        <span className={s.mobileNavText}>{item.label}</span>
                      </button>
                      {item.dropdown && (
                        <div className={s.mobileDropdown}>
                          {item.dropdown.map((sub) => (
                            <button
                              key={sub.key}
                              onClick={() => handleNavigate(sub.key)}
                              className={s.mobileDropdownItem}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {user && (
                  <button
                    onClick={handleLogout}
                    className={s.mobileLogoutButton}
                  >
                    <LogOut className={s.mobileNavIcon} />
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <style>{s.animations}</style>
    </header>
  );
};

export default EmployerNavbar;
