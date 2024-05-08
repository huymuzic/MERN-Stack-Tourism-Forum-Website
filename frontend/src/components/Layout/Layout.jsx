import React from 'react'
import { useLocation } from 'react-router-dom';

import Header from '../Header/Header';
import Routers from '../../Router/Routers';
import Footer from '../Footer/Footer';
import { ContactModalProvider } from '../../Pages/Home/components/Contact/ContactModalContext';


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
            <ContactModalProvider>
                <Header />
                <Routers />
                <Footer />
            </ContactModalProvider>
        </>
    );
};

export default Layout;