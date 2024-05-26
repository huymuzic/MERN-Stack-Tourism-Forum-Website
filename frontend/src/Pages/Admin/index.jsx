import { Outlet } from "react-router-dom";
import SideBarMenu from "./components/SideBarMenu";
import "./index.css";

const Admin = () => {
  return (
    <div className="container-fluid">
      <div className="row flex-column flex-md-row">
        <div className="col-12 col-md-3 col-xl-2 p-0 border-end">
          <SideBarMenu />
        </div>
        <div className="col-12 col-md-9 col-xl-10 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
