import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import "./Layout.css"; // Import the CSS file for additional styling

const Layout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
