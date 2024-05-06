import { Outlet } from 'react-router-dom';
import SideBarMenu from './components/SideBarMenu';
import './index.css'

const Admin = () => {
    return (
        <div>
            <div className='d-flex flex-row' >
                <div className='pe-4' style={{ borderRight: "1px solid #ddd" }}>
                    <SideBarMenu />
                </div>

                <div className='w-100 ps-4'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Admin;