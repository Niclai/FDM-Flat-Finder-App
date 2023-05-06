import React from "react";
import { useState, useEffect } from 'react';
import './pagesCSS/LoginPage.css';
import axios from "axios";
import SearchPropertyPage from "./SearchPropertyPage";
import NavBar from "../components/NavBar";
import fdm_logo from "../components/nav_assets/fdm_logo.png"

function LoginPage() {

    // states for input, if user is logged in, if there is an error, and the type of error
    const [credentials, setCredentials] = useState({userName: '', passWord: ''});
    const [loggedIn, login] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        const getSession = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get_user')
                if (response.status < 200 && response.status >= 300) {
                    console.error('Failed to retrieve session data', response.statusText)
                }
                if (response.data['user'] !== '') {
                    try {
                        const response = await axios.post('http://localhost:5000/logout')
                        console.log(response.data['message'], response.statusText)
                    } catch (error) {
                        console.error('Error', error)
                    }
                }
            } catch (error) {
                console.error('Error', error)
            }
        }
        getSession()
    }, [])
    
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setCredentials({...credentials, [name]: value}); // updates login credentials when inputted
    }
    
    // if username or password is not entered, or the credentials are not in the DB...
    // ...then return an error message, else return null
    const Error = ({errorPresent, reason}) => {
        if (errorPresent) {
            return <p className="message">{reason}</p>
        }
        return null
    }

    // handles the submission of the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if not all fields have been entered set error to true and specify why
        if (credentials.userName === '') {
            setIsError(true)
            setErrorMessage('Please Enter All Fields')
        } if (credentials.passWord === '') {
            setIsError(true)
            setErrorMessage('Please Enter All Fields')
        // if they have then make a get request to the server
        } if (credentials.userName !== '' && credentials.passWord !== '') {
            try {
                const response = await axios.get('http://localhost:5000/login')
                // searches all the users in the database
                for (let i=0;i<response.data.length;i++) {
                    let entry = response.data[i]
                    // if there is a match then user is logged in
                    if (credentials.userName === entry["username"] && credentials.passWord === entry["password"]) {
                        try {
                            const response = await axios.post('http://localhost:5000/start_session', {username : credentials.userName})
                            if (response.status >= 200 && response.status < 300) {
                                console.log(response.data['message'], response.statusText)
                                login(true)
                            } else {
                                console.error(response.data['message'], response.statusText)
                            }
                        } catch (error) {
                            console.error('Error', error)
                        }
                    }
                }
                // if no match then set error to true and specify why
                if (!loggedIn) {
                    setIsError(true)
                    setErrorMessage('Invalid Credentials')
                }
            } catch (error) {
                console.error('Login failed', error);
            }
        }
    };

    // conditional render : if not logged in render login form else render hello message
    return (
        <>
            {loggedIn ? (
                <>
                    <NavBar/>
                    <SearchPropertyPage/>
                </>
            ) : (
                <div className="login-background">
                    <div className="login-header"><img src={fdm_logo} alt="" className="login-logo"></img></div>
                    <div className="form-wrapper">
                    <Error errorPresent={isError} reason={errorMessage}/>
                    <form onSubmit={handleSubmit} className="form-box">
                        <h1 className="login-title">Login</h1>
                        <div className="username">
                            <label>Username</label> <br/>
                            <input className="input-uN" type="text" name="userName" value={credentials.userName} onChange={handleChange}/>
                        </div>
                        <div className="password">
                            <label>Password</label> <br/>
                            <input className="input-pW" type="password" name="passWord" value={credentials.passWord} onChange={handleChange}/>
                        </div>
                        <div>
                            <input className="submit-button" type="submit"/>
                        </div>
                    </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default LoginPage 