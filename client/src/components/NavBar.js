import "./NavBarStyles.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import fdm_logo from "../components/nav_assets/fdm_logo.png"

const NavBar = () => {

    const [loginOrLogout, setLoginOrLogout] = useState('Login');
    
    useEffect(() => {
        const getSession = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get_user')
                if (response.status < 200 && response.status >= 300) {
                    console.error('Failed to retrieve session data', response.statusText)
                }
                if (response.data['user'] !== '') {
                    setLoginOrLogout('Logout')
                }
            } catch (error) {
                console.error('Error', error)
            }
        }
        getSession()
    }, [])
    
    return <nav className='nav'>
        <a href="../pages/SearchPropertyPage" className="site-title">
            <img src = {fdm_logo} alt='' class = "logo"/>
        </a>
        <ul>
            <li>
                <a href="../pages/ProfilePage">Profile</a>
            </li>
            <li>
                <a href="../pages/WatchListPage">Watch List</a>
            </li>
            <li>
                <a href="../pages/CreateListingPage">Submit Listing</a>
            </li>
            <li>
                <a href="../pages/LoginPage">{loginOrLogout}</a>
            </li>
        </ul>
    </nav>
}

export default NavBar