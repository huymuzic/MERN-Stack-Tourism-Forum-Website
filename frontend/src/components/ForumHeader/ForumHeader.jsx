import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";
import { pushError, pushSuccess } from "../../components/Toast";
import { getAvatarUrl } from "../../utils/getAvar.js";
import { Dropdown } from "bootstrap";
import Editor from "../../Pages/CommunityForum/components/Editor";
import { useTheme } from "../../theme/Theme.jsx";
import { baseUrl } from "../../config/index.js";
import logo from "../../assets/images/logo.png";

const nav_bar = [
  {
    name: "Home",
    to: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Search",
    to: "/search",
    icon: "fa-solid fa-magnifying-glass",
  },
  {
    name: "Forum",
    to: "/forum",
    icon: "fa-solid fa-comments",
  },
  {
    name: "Tours",
    to: "/tours",
    icon: "fa-solid fa-cart-shopping",
  },
  {
    name: "Admin",
    to: "/admin",
    icon: "fa-solid fa-shield-halved",
    check: true,
  },
];

const ForumHeader = ({ children }) => {
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const userPfp = getAvatarUrl(user?.avatar, baseUrl);
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [dropdown, setDropdown] = useState(null);
  const { color } = useTheme();

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");

    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    const dropdownElement = document.getElementById("searchHistory");
    if (dropdownElement) {
      setDropdown(new Dropdown(dropdownElement));
    }
  }, []);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      const search = e.target.value;

      if (search.length === 0) {
        return;
      }

      let newSearchHistory = [...searchHistory];
      const existingIndex = newSearchHistory.indexOf(search);

      if (existingIndex > -1) {
        newSearchHistory.splice(existingIndex, 1);
      }

      newSearchHistory.push(search);

      if (newSearchHistory.length > 3) {
        newSearchHistory.shift();
      }

      setSearchHistory(newSearchHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newSearchHistory));

      navigate(`/search?keyword=${search}&sort=-1`);

      //e.target.click()
      //e.target.blur()
      e.preventDefault();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      console.log("Logout response:", response);

      if (response.ok) {
        pushSuccess("Logged out successfully");
        localStorage.removeItem("accessToken");
        setUser(null);
        navigate("/");
      } else {
        pushError("Failed to log out");
        const responseBody = await response.json();
        console.error("Failed to log out", responseBody.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="d-flex">
        <header className="d-flex justify-content-end sticky-top vh-100 col-lg-3 col-sm-2 border-2 border-end">
          <nav className="d-flex flex-column col-lg-8 col-sm-12 gap-2">
            <style>
              {`
                                .nav a {
                                    color: ${color.headerTextColor};
                                }
                                .nav a:hover {
                                    color: ${color.primary};
                                }
                                .nav a.active {
                                    color: ${color.primary} !important;
                                }
                            `}
            </style>
            <Link to="/">
              <img
                alt="Website Logo"
                className="img-fluid"
                height="150"
                width="150"
                src={logo}
              />
            </Link>
            <ul className="nav d-flex flex-column mb-auto gap-2 align-items-center">
              {nav_bar.map((item, index) => {
                if ((item.check && user?.role === "admin") || !item.check) {
                  return (
                    <li
                      key={index}
                      className="nav-item rounded-5 comment col-lg-10 col-sm-4"
                    >
                      <NavLink
                        to={item.to}
                        className="d-sm-flex align-items-center justify-content-sm-center justify-content-lg-start nav-link text-reset fs-5 fs-sm-2"
                        aria-current="page"
                      >
                        <i className={item.icon} title={item.name}></i>
                        <span className="ps-2 d-none d-lg-inline">
                          {item.name}
                        </span>
                      </NavLink>
                    </li>
                  );
                }
              })}
              <li className="mt-3 col-lg-10 col-sm-4">
                <button
                  id="createPost"
                  type="button"
                  className="col-lg-10 btn-primary rounded-5 p-1 d-sm-flex align-items-center justify-content-center"
                  data-bs-toggle="modal"
                  data-bs-target="#postModal"
                >
                  <span className="d-none d-lg-inline">Post</span>
                  <i className="fa-solid fa-feather-pointed d-lg-none d-md-block p-2"></i>
                </button>
              </li>
            </ul>
            <div className="mb-5 dropup d-flex justify-content-sm-center justify-content-lg-start col-12">
              <a
                href="#"
                className="d-flex align-items-center dropdown-toggle text-reset"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    user
                      ? userPfp
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="user profile picture"
                  width="45"
                  height="45"
                  className="rounded-circle me-2"
                />
                <strong className="d-none d-lg-inline">
                  {user ? user.username : "Guest"}
                </strong>
              </a>
              <ul
                className="dropdown-menu text-small shadow"
                aria-labelledby="user"
              >
                <li>
                  <Link className="dropdown-item" to="/my-account">
                    My Account
                  </Link>
                </li>
                <Link className="dropdown-item" to={`/profile/${user?._id}`}>
                  My Post History
                </Link>
                {/* <li>
                  <Link className="dropdown-item" to="/history">
                    Purchased History
                  </Link>
                </li> */}
                <li>
                  <hr className="dropdown-divider"></hr>
                </li>
                {user ? (
                  <li>
                    <Link className="dropdown-item" onClick={handleLogout}>
                      Sign out
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/login">
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/register">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </nav>
        </header>

        <main className="container-fluid">
          <form className="mx-auto sticky-top d-flex bg-light-subtle align-items-center justify-content-center gap-5 shadow-sm">
            <div className="col-5 d-flex align-items-center justify-content-center">
              <h5 className="text-center">Community Forum</h5>
            </div>
            <div
              className={`${
                isFocused ? "sel-bd" : ""
              } dropdown d-none d-lg-inline my-2 col-4 bg-body-secondary rounded-5 d-flex align-items-center ps-3`}
            >
              <i className="fa-solid fa-magnifying-glass p-2"></i>
              <input
                autoComplete="off"
                type="text"
                className="dropdown-toggle me-3 flex-grow-1 border-0 shadow-none bg-body-secondary ctm-ipn"
                placeholder="Search bar"
                aria-expanded="false"
                id="searchHistory"
                data-bs-toggle="dropdown"
                onKeyDown={handleSearch}
                onFocus={() => {
                  setIsFocused(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                }}
              />
              <ul
                className="dropdown-menu col-10 justify-content-center"
                aria-labelledby="searchHistory"
              >
                <li className="d-flex justify-content-between col-11 mx-auto border-bottom pb-1">
                  <h6 className="dropdown-header">Recently</h6>
                  <button
                    type="button"
                    className="rounded-5 ctm-btn"
                    onClick={() => {
                      setSearchHistory([]);
                      localStorage.removeItem("searchHistory");
                    }}
                  >
                    <span className="p-2">Delete all</span>
                  </button>
                </li>
                {searchHistory.length > 0 &&
                  searchHistory.map((query, index) => (
                    <li key={index}>
                      <Link
                        className="dropdown-item d-flex col-11 mx-auto align-items-center"
                        to={`/search?keyword=${query}`}
                      >
                        <i className="fa-solid fa-magnifying-glass p-2"></i>
                        <span>{query}</span>
                        <button
                          type="button"
                          className="rounded-5 ctm-btn ms-auto d-flex"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newSearchHistory = [...searchHistory];
                            newSearchHistory.splice(index, 1);
                            setSearchHistory(newSearchHistory);
                            localStorage.setItem(
                              "searchHistory",
                              JSON.stringify(newSearchHistory)
                            );
                          }}
                        >
                          <i className="fa-solid fa-x p-2"></i>
                        </button>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <button type="submit" className="d-none" />
          </form>

          {children}
        </main>
      </div>

      <Editor status="post" />

      <Editor status="reply" />

      <Editor status="edit" />
    </>
  );
};

export default ForumHeader;
