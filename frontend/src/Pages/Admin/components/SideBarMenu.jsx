import { NavLink } from 'react-router-dom'
import { PiUserList } from "react-icons/pi";
import { MdForum } from "react-icons/md";


const sideBarItems = [
    {
        path: 'users',
        title: 'Users',
        icon: <PiUserList size={"24px"} />
    },
    {
        path: 'forum-posts',
        title: 'Forum Posts',
        icon: <MdForum size={"24px"} />
    }
]
export default function SideBarMenu() {
    return (
        <div className='side-bar-container' style={{ minHeight: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
            {sideBarItems.map((item, index) => (
                <NavLink to={item.path} className={navClass => navClass.isActive ? "side-bar-item active-sidebar-item" : "side-bar-item"} key={index} >
                    <div style={{ display: "flex", flexDirection: "row", gap: "24px", color: "inherit", alignItems: "center" }}>
                        <div className="me-1">{item.icon}</div>
                        <h6 style={{ textWrap: "nowrap", margin: "0", height: "20px" }}>
                            {item.title}
                        </h6>
                    </div>
                </NavLink>

            ))}
        </div>
    )
}
