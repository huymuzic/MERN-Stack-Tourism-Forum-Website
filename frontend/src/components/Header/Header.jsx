import React, {useState} from 'react';
import { NavLink, Link } from 'react-router-dom';

import { Container, Button} from 'react-bootstrap'
import './header.css'

import { useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/UserContext';

import logo from '../../assets/images/logo.png' 
import { pushError, pushSuccess } from '../Toast';

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

    const {user, setUser } = useUser();
    const navigate = useNavigate();
    const [successMsg, setSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_BASE_URL + '/api/v1/auth/logout', {
                method: 'GET',
                credentials: 'include', // Send cookies with the request
            });

            console.log('Logout response:', response); // Log the response
            
            if (response.ok) {
                pushSuccess('Logged out successfully');
                setSuccessMsg(true);
                 // Clear token in local storage on the browser
                localStorage.removeItem('accessToken');
                setUser(null);
                navigate('/');
            } else {
                // Handle unsuccessful logout
                pushError('Failed to log out');
                setErrorMsg(true);
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
                        <img alt='Website Logo' height='100' width='100' src={logo}>
                        </img>
                     </Link>
                    { /* LOGO SECTION ENDS */ }

                    { /* NAVIGATION SECTION STARTS */ }
                <div className="d-lg-none hbg">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>   
                </div>
                    <div className='collapse navbar-collapse justify-content-end' id="navbarSupportedContent">
                        <ul className='navbar-nav mb-2 mb-lg-0 gap-5 d-flex justify-content-end text-center margin'>
                            {nav__links.map((item, index) => (
                                <li className='nav__item' key={index}>                                 
                                    <NavLink to={item.path} className={navClass => navClass.isActive ? "active__link" : ""} >{item.display}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {user !== null ? (
                        <li className="nav-item dropdown no-bullet mb-4 nm">
                          <button className="btn dropdown-toggle" type="button" onClick={toggleDropdown} id="user" data-bs-toggle="dropdown" aria-expanded="false">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="User Avatar"
                                        className="rounded-circle"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <i className="fa-solid fa-circle-user rounded-circle fa-3x"></i>
                                )}
                            </button>

                            <ul className="dropdown-menu user__icon__dropdown" aria-labelledby="user">
                            {user !== null && user.role === 'admin' ? (
                            <li><Link className="dropdown-item" to="/admin">Admin Portal</Link></li>
                            ) : null}                   
                                <li><Link className="dropdown-item" to="/account">Dashboard</Link></li>
                                <li><Link className="dropdown-item" to="/history">Purchased History</Link></li>
                                <li>
                                    <hr className="dropdown-divider"></hr>
                                </li>
                                <li><Link className="dropdown-item" onClick={handleLogout}>Sign out</Link></li>
                            </ul>

                        </li>                    
                    ) : (
                    <div className='nav__right d-flex align-items-center gap-4' >
                        <div className='nav__btns d-flex align-items-center gap-4' >
                            <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                            <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button>    
                        </div>                     
                    </div>                     
                    )}    
                { /* NAVIGATION SECTION ENDS */}
        </Container>
    </nav>
    );
};

export default Header;