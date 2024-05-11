import React from 'react'
import { useLocation } from 'react-router-dom';

import Header from '../Header/Header';
import Routers from '../../Router/Routers';
import Footer from '../Footer/Footer';

import ForumHeader from '../ForumHeader/ForumHeader';


const Layout = () => {
    const location = useLocation();

    if (location.pathname.startsWith('/forum') || location.pathname === '/search' || location.pathname.startsWith('/users')) {
        return (
            <ForumHeader>
                <Routers />
            </ForumHeader>
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