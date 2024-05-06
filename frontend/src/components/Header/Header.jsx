import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import { Container, Button} from 'react-bootstrap'
import './header.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useNavigate } from 'react-router-dom';
// import { useContactModal } from '../../Pages/Home/components/Contact/ContactModalContext';
import { useUser } from '../../utils/UserContext';
import { useUserInfo } from '../../utils/UserInforContext'

import logo from '../../assets/images/logo.png' 

const nav__links = [
    {
        path:'/home',
        display:'Home'
    },
    {
        path:'/forum',
        display:'Forum'
    },
    {
        path:'/tours',
        display:'Tours'
    },
    {
        path:'',
        display:'Contact'
    }
]

function toggleDropdown() {
    var dropdownMenus = document.getElementsByClassName('dropdown-menu');

    for (var i = 0; i < dropdownMenus.length; i++) {
        var menu = dropdownMenus[i];

        if (menu.style.display === 'none') {
            menu.setAttribute('aria-hidden', 'false');
        } else {
            menu.setAttribute('aria-hidden', 'true');
        }
    }
}


const Header = () => {
    
    // const { handleShowModal } = useContactModal();

    const {user, setUser } = useUser();
    const { info,setInfo, fetchInfo, updateInfo, deleteInfo, isLoading, error } = useUserInfo();
    const baseURL = import.meta.env.VITE_BASE_URL;
    const check = info._id ? true : false;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${baseURL}/api/v1/auth/logout`, {
                method: 'GET',
                credentials: 'include', // Send cookies with the request
            });

            console.log('Logout response:', response); // Log the response
            
            if (response.ok) {
                console.log('Logout successful.');
                 // Clear token in local storage on the browser
                localStorage.removeItem('accessToken');
                setUser(null);
                navigate('/');
            } else {
                // Handle unsuccessful logout
                const responseBody = await response.json();
                console.error('Failed to log out', responseBody.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
    <nav className='header navbar navbar-expand-lg'>
        <Container className='header__container bd-gutter'>
                { /* NAVIGATION SECTION STARTS */}

                    { /* LOGO SECTION STARTS */ }
                    <Link to="/" className='navbar-brand l'>
                        <img alt='Website Logo' height='150' width='150' src={logo}>
                        </img>
                     </Link>
                    { /* LOGO SECTION ENDS */ }

                    { /* NAVIGATION SECTION STARTS */ }

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>                
                    <div className='collapse navbar-collapse d-flex justify-content-end' id="navbarSupportedContent">
                        <ul className='navbar-nav mb-2 mb-lg-0 gap-5 d-flex justify-content-end'>
                            {nav__links.map((item, index) => (
                                <li className='nav__item' key={index}>
                                    {item.path ? (                                    
                                    <NavLink to={item.path} className={navClass => navClass.isActive ? "active__link" : ""} >{item.display}</NavLink>
                                    ) : (
                                    <span id="contact" className="nav__link">{item.display}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {user ? (
                    <div id = "user-icon-container" className="dropdown text-start">
                        <a
                            id="user-icon"
                            href="#"
                            className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                            data-bs-toggle="dropdown"
                        >
                            <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="rounded-circle"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                        </a>
                        <ul id = "dropdown-left" className="dropdown-menu text-small" style={{}}>
                            <li><a className="dropdown-item" href="/account">Account</a></li>
                            <li><a className="dropdown-item" href="/history">Purchased History</a></li>
                            <hr className="dropdown-divider"></hr>
                            <li><a className="dropdown-item sign__out" onClick={handleLogout}>Sign out</a></li>
                        </ul>
                    </div> 
                    ) : (
                    <div className='nav__right d-flex align-items-center gap-4' >
                        <div className='nav__btns d-flex align-items-center gap-4' >
                            <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                            <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button>    
                        </div> 

                        <span className='mobile__menu'>
                            <i className="ri-menu-line"></i>    
                        </span>                       
                    </div>                     
                    )}    
                { /* NAVIGATION SECTION ENDS */}
        </Container>
    </nav>
    );
};

export default Header;