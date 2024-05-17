import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { Container, Button } from "react-bootstrap";
import "./header.css";

import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import { getAvatarUrl } from "../../utils/getAvar.js";
import logo from "../../assets/images/logo.png";
import { pushError, pushSuccess } from "../Toast";
import { useTheme } from "../../theme/Theme";

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
  {
    path: "/admin",
    display: "Admin Portal",
  },
];

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
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { user, setUser } = useUser();
  const avatarUrl = getAvatarUrl(user?.avatar, baseURL);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/api/v1/auth/logout",
        {
          method: "GET",
          credentials: "include", // Send cookies with the request
        }
      );

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
    if (window.innerWidth >= 992) {
      const navItems = document.getElementById("navItems");
      if (navItems) {
        navItems.classList.add("margin");
      }
    } else {
      const navItems = document.getElementById("navItems");
      if (navItems) {
        navItems.classList.remove("margin");
      }
    }
  };
  const centerLogo = () => {
    const logo = document.querySelector(".navbar-brand");
    if (window.innerWidth < 992 && user === null) {
      if (logo) {
        logo.style.marginLeft = "10.5rem";
      }
    } else {
      if (logo) {
        logo.style.marginLeft = "initial";
      }
    }
  };

  removeMargin();

  document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("resize", centerLogo);
  });

  return (
    <nav className="header custom__navbar navbar navbar-expand-lg">
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
          <div className="nav__right d-flex align-items-center gap-4">
            <div className="nav__btns d-flex align-items-center gap-4">
              <Button className="secondary__btn normal__pad">
                <Link to="/login" onClick={handleNavItemClick}>
                  Login
                </Link>
              </Button>
              <Button className="primary__btn big__pad">
                <Link to="/register" onClick={handleNavItemClick}>
                  Register
                </Link>
              </Button>
            </div>
          </div>
        )}
        {/* NAVIGATION SECTION ENDS */}
      </Container>
    </nav>
  );
};

export default Header;
