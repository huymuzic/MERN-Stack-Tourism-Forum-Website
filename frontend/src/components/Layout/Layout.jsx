import React from 'react'
import { useLocation } from 'react-router-dom';

import Header from '../Header/Header';
import Routers from '../../Router/Routers';
import Footer from '../Footer/Footer';


const Layout = () => {
    const location = useLocation();

    if (location.pathname.startsWith('/forum')) {
        return (
            <ContactModalProvider>
                <Routers />
            </ContactModalProvider>
        );
    }

    return (
    <>
        <Header />
        <Routers />
        <Footer />
    </>
    );
};

export default Layout;