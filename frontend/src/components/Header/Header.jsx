import { NavLink, Link } from "react-router-dom";

import { Container, Button } from "react-bootstrap";
import "./header.css";

import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import { getAvatarUrl } from "../../utils/getAvar.js";
import logo from "../../assets/images/logo.png";
import { pushError, pushSuccess } from "../Toast";
import { useTheme } from "../../theme/Theme.jsx";
import { baseUrl } from "../../config/index.js";

function toggleDropdown() {
  var dropdownMenus = document.getElementsByClassName("user__icon__dropdown");
  for (var i = 0; i < dropdownMenus.length; i++) {
    var menu = dropdownMenus[i];

    if (menu.style.display === "none") {
      menu.setAttribute("aria-hidden", "false");
    } else {
      menu.setAttribute("aria-hidden", "true");
    }
  }
}

const Header = () => {
  const { color } = useTheme();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const avatarUrl = getAvatarUrl(user?.avatar, baseUrl);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/logout`, {
        method: "GET",
        credentials: "include", // Send cookies with the request
      });

      if (response.ok) {
        localStorage.removeItem("loggedInBefore");
        pushSuccess("Logged out successfully");
        setUser(null);
        navigate("/");
      } else {
        // Handle unsuccessful logout
        pushError("Failed to log out");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNavItemClick = () => {
    if (window.innerWidth < 992) {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  };

  const removeMargin = () => {
    if (window.innerWidth < 992) {
      const navItems = document.getElementById("navItems");
      if (navItems) {
        navItems.classList.add("no__margin");
      }
    }
  };
  const centerLogo = () => {
    const logo = document.querySelector(".navbar-brand");
    if (window.innerWidth < 992 && user === null) {
      if (logo) {
        logo.style.margin = "auto";
      }
    }
  };

  removeMargin();

  document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("resize", centerLogo);
  });

  const nav__links = [
    {
      path: "/home",
      display: "Home",
    },
    {
      path: "/forum",
      display: "Forum",
    },
    {
      path: "/tours",
      display: "Tours",
    },
  ];

  if (user !== null && user.role === "admin") {
    nav__links.push({
      path: "/admin",
      display: "Admin Portal",
    });
  }

  return (
    <nav
      className="header custom__navbar navbar navbar-expand-lg"
      style={{ backgroundColor: color.headerBgColor }}
    >
      <style>
        {`
          .nav__item a {
            color: ${color.headerTextColor};
          }
          .nav__item a:hover {
            color: ${color.primary};
          }
          .nav__item a.active__link {
            color: ${color.primary} !important;
        }
          `}
      </style>
      <Container className="header__container bd-gutter">
        {/* NAVIGATION SECTION STARTS */}
        {/* LOGO SECTION STARTS */}
        <Link to="/" className="navbar-brand l">
          <img alt="Website Logo" height="100" width="100" src={logo}></img>
        </Link>
        {/* LOGO SECTION ENDS */}

        {/* NAVIGATION SECTION STARTS */}
        <div className="d-lg-none hbg">
          <button
            className="navbar-toggler collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleNavItemClick}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div
          className="navbar-collapse collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul
            className="navbar-nav mb-2 mb-lg-0 gap-5 d-flex justify-content-end text-center margin"
            id="navItems"
          >
            {nav__links.map((item, index) => (
              <li className="nav__item" key={index}>
                <NavLink
                  to={item.path}
                  className={(navClass) =>
                    navClass.isActive ? "active__link" : ""
                  }
                  onClick={handleNavItemClick}
                >
                  {item.display}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        {user !== null ? (
          <li className="nav-item dropdown no-bullet mb-4 nm">
            <button
              className="btn"
              type="button"
              onClick={toggleDropdown}
              id="user"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user?.avatar ? (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              ) : (
                <i className="fa-solid fa-circle-user rounded-circle fa-3x"></i>
              )}
            </button>

            <ul
              className="dropdown-menu user__icon__dropdown"
              aria-labelledby="user"
            >
              <li>
                <Link className="dropdown-item" to="/my-account">
                  My Account
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to={`/profile/${user._id}`}>
                  My Post History
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/history">
                  Purchased History
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider"></hr>
              </li>
              <li>
                <Link className="dropdown-item" onClick={handleLogout}>
                  Sign out
                </Link>
              </li>
            </ul>
          </li>
        ) : (
          <div className="login-register-buttons">
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                <Link to="/login" onClick={handleNavItemClick}>
                  <Button className="secondary__btn big__pad btn-secondary login">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={handleNavItemClick}>
                  <Button className="primary__btn big__pad btn-primary register">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        {/* NAVIGATION SECTION ENDS */}
      </Container>
    </nav>
  );
};

export default Header;
