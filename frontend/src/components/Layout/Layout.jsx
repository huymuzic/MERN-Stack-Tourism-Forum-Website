import React from 'react'

import Header from '../Header/Header';
import Routers from '../../Router/Routers';
import Footer from '../Footer/Footer';


const Layout = ({isLoading}) => {
    
    return (
    <>
        <Header isLoading={isLoading}/>
        <Routers />
        <Footer />
    </>
    );
};

export default Layout;