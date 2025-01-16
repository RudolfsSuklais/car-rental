import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <div className="nav-bar">
      <nav>
        <div className="nav-bar-logo">
          <NavLink to="/">
            <h1>GoCruise</h1>
          </NavLink>
        </div>
        <div className="nav-bar-menu">
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/add-car"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add car
              </NavLink>
            </li>
            <li>
              <NavLink
                to="#"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="#"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
