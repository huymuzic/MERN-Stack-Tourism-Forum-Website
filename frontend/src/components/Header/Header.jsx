import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Container, Navbar, Button } from "react-bootstrap";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import { getAvatarUrl } from "../../utils/getAvar.js";
import { pushError, pushSuccess } from "../Toast";
import { useTheme } from "../../theme/Theme.jsx";
import { baseUrl, environment } from "../../config/index.js";
import CircularProgress from "../CircularProgress.jsx";

const Header = () => {
  const [logoImage, setLogoImage] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch(`${baseUrl}/api/v1/images/`);
    const Image = await response.json();
    if (Image && Image.data) {
      if (environment == "PROD") {
        setLogoImage(Image.data.filter((item) => item.title == "Logo image"));
      } else {
        setLogoImage(
          Image.data
            .filter((item) => item.title == "Logo image")
            .map((item) => {
              return {
                ...item,
                photo: `./src${item.photo}`,
              };
            })
        );
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("resize", centerLogo);
    removeMargin();
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
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Navbar
            className="header custom__navbar"
            style={{ backgroundColor: color.headerBgColor }}
            expand="lg"
            collapseOnSelect
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
              <Link to="/" className="navbar-brand l">
                <img
                  alt="Website Logo"
                  height="100"
                  width="100"
                  src={logoImage[0].photo}
                ></img>
              </Link>
              <div className="d lg-none hbg">
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
              </div>
              <Navbar.Collapse
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
              </Navbar.Collapse>
              {user !== null ? (
                <li className="nav-item dropdown no-bullet mb-4 nm">
                  <button
                    className="btn"
                    type="button"
                    id="user"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user?.avatar ? (
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
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
                      <Link
                        className="dropdown-item"
                        to={`/profile/${user._id}`}
                      >
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
                      <Link to="/login">
                        <Button
                          className="login__btn big__pad btn-secondary login"
                          onClick={handleNavItemClick}
                        >
                          Login
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button
                          className="register__btn big__pad btn-primary register"
                          onClick={handleNavItemClick}
                        >
                          Register
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </Container>
          </Navbar>
        </>
      )}
    </>
  );
};

export default Header;
