import React from "react";
import { NavLink } from "react-router-dom";
import { PiUserList } from "react-icons/pi";
import { MdForum } from "react-icons/md";
import { useTheme } from "../../../theme/Theme";

const sideBarItems = [
  {
    path: "users",
    title: "Users",
    icon: <PiUserList size={"24px"} />,
  },
  {
    path: "forum-posts",
    title: "Forum Posts",
    icon: <MdForum size={"24px"} />,
  },
  {
    path: "tours",
    title: "Tours",
    icon: <MdForum size={"24px"} />,
  },
];

export default function SideBarMenu() {
  const { color, themeMode } = useTheme();

  return (
    <>
      <style>
        {`
        .side-bar-container {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 200px);
        }

        @media (max-width: 768px) {
          .side-bar-container {
            min-height: unset;
          }
        }

        .side-bar-item {
          display: flex;
          padding: 12px 16px;
          text-decoration: none;
          color: black;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }

        .side-bar-item:hover {
          background-color: ${themeMode === "light" ? "#f5f5f5" : "#353535"};
        }

        .active-sidebar-item {
          color: ${color.primary};
          background-color: ${color.lightPrimary};
        }

        .active-sidebar-item:hover {
          background-color: ${color.lightPrimary}; 
        }

        @media (max-width: 768px) {
          .side-bar-item {
            padding: 10px 14px;
          }
        }
        `}
      </style>
      <div className="side-bar-container">
        {sideBarItems.map((item, index) => (
          <NavLink
            to={item.path}
            className={(navClass) =>
              navClass.isActive
                ? "side-bar-item active-sidebar-item"
                : "side-bar-item"
            }
            key={index}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                color: "inherit",
                alignItems: "center",
              }}
            >
              <div className="me-1" style={{ color: color.textPrimary }}>
                {item.icon}
              </div>
              <h6 style={{ whiteSpace: "nowrap", margin: "0", height: "20px" }}>
                {item.title}
              </h6>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
}
