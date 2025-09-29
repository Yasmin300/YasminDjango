import { Link, useLocation } from "react-router-dom";
import { MyContext } from "../../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import './dark_nav.css'
import './light_nav.css'
import './nav.css'

export default function Navbar() {
    const path = useLocation().pathname;
    const { user, setUser, darkMode, setDarkMode, search, setSearch, filters, setFilters, token, detoken, setToken, setDetoken, getArticles } = useContext(MyContext);
    const navigate = useNavigate();
    const [draftFilters, setDraftFilters] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const navbarRef = useRef();
    const [showAdvanced, setShowAdvanced] = useState(false);
    const toggleDarkMode = () => setDarkMode(!darkMode);

    const logout = () => {
        setUser(null);
        setToken(null);
        setDetoken(null);
        setSearch(null);        // 🔁 reset search if needed
        localStorage.removeItem('token');
        navigate('/');
    };

    const closeNavbar = () => {
        if (navbarRef.current && navbarRef.current.classList.contains('show')) {
            const collapseElement = new window.bootstrap.Collapse(navbarRef.current, {
                toggle: false,
            });
            collapseElement.hide();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg px-4">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar" ref={navbarRef}>
                <div className="d-flex ham flex-column flex-lg-row justify-content-between w-100">

                    {/* LEFT SIDE nav items */}
                    <ul className="navbar-nav flex-column flex-lg-row">
                        <li className="nav-item">
                            <h3>
                                <Link to="/" className={`nav-link part1 ${path === '/' ? 'active' : ''}`} onClick={closeNavbar}>Articles</Link>
                            </h3>
                        </li>
                        {detoken?.isAdmin && (
                            <li className="nav-item">
                                <h3>
                                    <Link to="/MyArticles" className={`nav-link part1 ${path === '/MyArticles' ? 'active' : ''}`} onClick={closeNavbar}>My articles</Link>
                                </h3>
                            </li>
                        )}
                    </ul>

                    {/* RIGHT SIDE nav items */}
                    <ul className="navbar-nav flex-column flex-lg-row align-items-lg-center mt-2 mt-lg-0">
                        <li className="nav-item d-flex align-items-center mb-2 mb-lg-0">
                            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={() => { closeNavbar(); setSearch(searchInput); }} className="searchIcon" />
                            <input type="search" className="form-control me-2 searchInput" placeholder="Search Articles" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    closeNavbar();
                                    setSearch(searchInput);
                                }
                            }} />
                        </li>
                        <li className="nav-item d-flex align-items-center mb-2 mb-lg-0">
                            <button onClick={() => { setShowAdvanced(!showAdvanced); }} className="btn buttonadvanced">
                                Advanced search
                            </button>
                        </li>
                        <li className="nav-item  mb-2 mb-lg-0">
                            {showAdvanced && (
                                <div className="card advance p-3 mt-2" style={{
                                    maxWidth: "400px", position: "relative", top: "120px"
                                }}>
                                    <h5>Advanced Filters</h5>
                                    {["title", "author__username", "body", "tags__name"].map((field) => (
                                        <input
                                            key={field}
                                            type="text"
                                            className="form-control my-1"
                                            placeholder={`Filter by ${field}`}
                                            value={draftFilters[field]}
                                            onChange={(e) => setDraftFilters({ ...draftFilters, [field]: e.target.value })}
                                        />
                                    ))}
                                    <button className="btn btn-primary mt-2" onClick={() => {
                                        setFilters(draftFilters);
                                        setSearch(null);
                                        closeNavbar();
                                    }}>
                                        Apply Filters
                                    </button>
                                    <button className="btn btn-secondary mt-2" onClick={() => {
                                        setDraftFilters({});
                                        setFilters({});
                                        setSearch(null);
                                    }}>
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </li>
                        <li className="nav-item ">
                            <button onClick={toggleDarkMode} className=" nav-link">
                                {darkMode && (<FontAwesomeIcon icon={faSun} className="secPart toggle" onClick={closeNavbar} />
                                )}
                                {!darkMode && (<FontAwesomeIcon icon={faMoon} className="secPart toggle" onClick={closeNavbar} />
                                )}
                            </button>
                        </li>

                        {!detoken && (
                            <>
                                <li className="nav-item">
                                    <Link to="/register" className={`nav-link ${path === '/register' ? 'active' : ''} secPart`} onClick={closeNavbar}>Register</Link>
                                </li>
                                <li className="nav-item ">
                                    <Link to="/Login" className={`nav-link ${path === '/Login' ? 'active' : ''} secPart`} onClick={closeNavbar}>Login</Link>
                                </li>
                            </>
                        )}
                        {detoken && (
                            <li className="nav-item">
                                <div className="user-menu nav-link">
                                    <FontAwesomeIcon icon={faUser} />
                                    <div className="dropdown">
                                        <button onClick={() => { logout(); closeNavbar(); }} className="btn btn-link">
                                            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                                        </button>
                                    </div>

                                </div>
                            </li>
                        )}
                    </ul>

                </div>
            </div>
        </nav >

    )
}
