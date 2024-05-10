import { NavLink } from 'react-router-dom'
import { PiUserList } from "react-icons/pi";
import { MdForum } from "react-icons/md";
import { useTheme } from '../../../theme/Theme';


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
    const { color } = useTheme()
    
    return (
        <>
    < style >
        {`
        .side-bar-item {
            display: flex;
            padding: 16px 20px;
            text-decoration: none;
            color: black;
            border-radius: 8px;
            transition: background-color 0.3s ease;
        }
        
        .side-bar-item:hover {
            background-color: #f5f5f5;
        }
        
        .active-sidebar-item {
            color: ${color.primary};
            background-color: ${color.lightPrimary};
        }
        
        .active-sidebar-item:hover {
            background-color: ${color.lightPrimary}; 
        }`}
    </style >
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
        </>
    )
}
