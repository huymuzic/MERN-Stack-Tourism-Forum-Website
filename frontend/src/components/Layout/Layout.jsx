import React from 'react'

import Header from '../Header/Header';
import Routers from '../../Router/Routers';
import Footer from '../Footer/Footer';
import { ContactModalProvider } from '../../Pages/Home/components/Contact/ContactModalContext';


const Layout = () => {
    
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