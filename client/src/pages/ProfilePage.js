import React, { useState, useEffect } from "react";
import './pagesCSS/ProfilePage.css';
import { countries } from './countries.js';
import axios from "axios";

function ProfilePage() {
    // states for the values of the form
    const initialValues = {
        f_name: "", m_name: "", s_name: "", preOccupation: "", bDay: "",
        gender: "", nationality: "", sDate: "", fDate: ""}
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({}); // contains flags for errors
    const [isSubmit, setIsSubmit] = useState(false) // state checks if form submitted
    const [user, setUser] = useState(''); // state to hold the user's name
    const [editing, setEditing] = useState(false); // checks if the user is editing their profile instead of creating it
    

    // runs only of initial render, retrieves the user's name and get the user's profile if they have one
    useEffect(() => {
        const getSession = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get_user')
                if (response.status < 200 && response.status >= 300) {
                    console.error('Failed to retrieve session data', response.statusText)
                }
                // sets state from empty to the username
                setUser(response.data['user'])
            } catch (error) {
                console.error('Error', error)
            }
        }
        const get_profile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get_profile')
                if (response.status < 200 && response.status >= 300) {
                    console.error('Failed to retrieve profile', response.statusText)
                }
                else {
                    // checks if they have already created a profile, if so then load it into the formvalues state
                    if (response.data[0] && Object.keys(response.data[0]).length !== 0) {
                        setIsSubmit(true)
                        console.log(response.data[0])
                        setFormValues({
                            f_name: response.data[0].firstName,
                            m_name: response.data[0].middleName,
                            s_name: response.data[0].surname,
                            preOccupation: response.data[0].preOccupation,
                            bDay: response.data[0].dOb,
                            gender: response.data[0].gender,
                            nationality: response.data[0].nationality,
                            sDate: response.data[0].startDate,
                            fDate: response.data[0].endDate,
                          })
                        console.log(formValues);
                    }
                }
            } catch (error) {
                console.error('Error', error)
            }
        }
        getSession()
        get_profile()
    }, [])

    // updates the form values when user inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value })
    };

    // when the user submits the form...
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues)); // check all fields inputted
        setIsSubmit(true);
        if (Object.keys(validate(formValues)).length === 0) {
            try {
                // check if the user is creating a profile or editing an existing one
                if (editing) {
                    const response = await axios.post('http://localhost:5000/edit_profile', {
                        firstName : formValues.f_name,
                        middleName : formValues.m_name,
                        surname : formValues.s_name,
                        preOccupation : formValues.preOccupation,
                        dOb : formValues.bDay,
                        gender : formValues.gender,
                        nationality : formValues.nationality,
                        startDate : formValues.sDate,
                        endDate : formValues.fDate
                        });
                    console.log(response.data['message'], response.statusText)
                    setEditing(false)
                }
                else {
                    const response = await axios.post('http://localhost:5000/create_profile', {
                        firstName : formValues.f_name,
                        middleName : formValues.m_name,
                        surname : formValues.s_name,
                        preOccupation : formValues.preOccupation,
                        dOb : formValues.bDay,
                        gender : formValues.gender,
                        nationality : formValues.nationality,
                        startDate : formValues.sDate,
                        endDate : formValues.fDate
                        });
                    console.log(response.data['message'], response.statusText)
                }
            } catch (error){
                console.error("Error")
            }
          }
    };

    // clears all inputs in the form, resets form errors
    const handleClear = (e) =>{
        e.preventDefault();
        setFormValues(initialValues);
        setFormErrors({});
        setIsSubmit(false);
    }

    // called when the edit button is pressed
    const handleEdit = () => {
        setIsSubmit(false);
        setEditing(true)
    };


    // error flags for each form entry
    const validate = (values) => {
        const errors = {}
        if (!values.f_name) {
            errors.f_name = "First name is required!";
        }
        if (!values.s_name) {
            errors.s_name = "Surname is required!";
        }
        if (!values.preOccupation) {
            errors.preOccupation = "Preoccupation is required!";
        }
        if (!values.bDay) {
            errors.bDay = "Birthday is required!";
        }
        if (!values.gender) {
            errors.gender = "Gender is required!";
        }
        if (!values.nationality) {
            errors.nationality = "Nationality is required!";
        }
        if (!values.sDate) {
            errors.sDate = "Start date is required!";
        }
        if (!values.fDate) {
            errors.fDate = "End date is required!";
        }
        return errors;
    };
    return (
        <div className = "profilePageContainer">
            {Object.keys(formErrors).length === 0 && isSubmit ? ( // conditional render depending on if the form has been submitted (or if the profile already created)
                <div className="ProfilePageSubmitSuccess">

                    <div className="ProfileSuccessTitle">
                        <div class="Profile-top">Your Profile</div><br></br>
                        <div class="Profile-top2">My Details</div>
                    </div>
                    
                    <div class="Profile-user-initials">
                        <div class="Profile-initials-circle">{formValues.f_name.charAt(0)}{formValues.s_name.charAt(0)}</div>
                        <div class="Profile-full-name">{formValues.f_name} {formValues.m_name} {formValues.s_name}</div>
                    </div>  

                    <div class = "Profile-title">
                        <div class="Profile-top2">General Details</div>
                    </div>
              
                    <div className="value">
                        <h3>Preoccupation:</h3> 
                        <p>{formValues.preOccupation}</p>
                    </div>
              
                    <div className="value">
                        <h3>Date of Birth:</h3> 
                        <p>{formValues.bDay}</p>
                    </div>
              
                    <div className="value">
                        <h3>Gender:</h3> 
                        <p>{formValues.gender}</p>
                    </div>
              
                    <div className="value">
                        <h3>Nationality:</h3> 
                        <p>{formValues.nationality}</p>
                    </div>

                    <div class = "Profile-title">
                        <div class="Profile-top2">Duration</div>
                    </div>
              
                    <div className="value">
                        <h3>Start date:</h3> 
                        <p>{formValues.sDate}</p>
                    </div>
              
                    <div className="value">
                        <h3>End date:</h3> 
                        <p>{formValues.fDate}</p>
                    </div>

                    <button className="Profile-editButton" onClick={handleEdit}>Edit</button>

                </div>
              
            ) : (
                <form onSubmit={handleSubmit} name="CreateFDMProfile">
                    <div className = "fields">
                    <fieldset>
                        <legend>Hi {user}, Create Your FDM Profile!</legend>
                            <div className="section">
                                <label>First Name*</label>
                                <input 
                                    type="text"
                                    className='profile-input'
                                    name ="f_name"
                                    placeholder={user}
                                    value={formValues.f_name}
                                    onChange={handleChange}/>
                            </div>

                            <div className="errorMessage">
                                <p>{formErrors.f_name}</p>
                            </div>

                            <div className = "section">
                                <label>Middle Name(s)</label>
                                <input 
                                    type="text"
                                    className='profile-input'
                                    name ="m_name"
                                    value={formValues.m_name}
                                    onChange={handleChange}/>
                            </div>

                            <div className="errorMessage">
                                <p>{formErrors.m_name}</p>
                            </div>

                            <div className = "section">
                                <label>Surname*</label>
                                <input 
                                    type="text"
                                    className='profile-input'
                                    name="s_name"
                                    value={formValues.s_name}
                                    onChange={handleChange}/>
                            </div>
                                
                            <div className="errorMessage">
                                <p>{formErrors.s_name}</p>
                            </div>

                            <div className = "section">
                                <label>Date of Birth*:</label>
                                <input 
                                    type="date"
                                    name="bDay"
                                    value={formValues.bDay}
                                    onChange={handleChange}/>
                            </div>

                            <div className="errorMessage">
                                <p>{formErrors.bDay}</p>
                            </div>

                            <div className = "section">
                                <label>Gender*</label>
                                <select 
                                    name="gender"
                                    value={formValues.gender}
                                    onChange={handleChange}>
                                        <option>Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                </select>
                            </div>
                        
                            <div className="errorMessage">
                                <p>{formErrors.gender}</p>
                            </div>

                            <div className = "section">
                            <label>Nationality*</label>
                            <select 
                                name="nationality"
                                value={formValues.nationality}
                                onChange={handleChange}>
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                <option value={country} key={country}>{country}</option>
                                ))}
                            </select>
                            </div> 

                            <div className="errorMessage">
                                <p>{formErrors.nationality}</p>
                            </div>

                            <div className = "section">
                                <label>Previous Occupation*</label>
                                <select
                                    name="preOccupation"
                                    value={formValues.preOccupation}
                                    onChange={handleChange}>
                                        <option>Select Previous Occupation</option>
                                        <option>Graduate Programme</option>
                                        <option>Returners to work</option>
                                        <option>Ex forces</option>
                                </select>
                            </div>

                            <div className="errorMessage">
                                <p>{formErrors.preOccupation}</p>
                            </div>

                            <div className = "sectionMult">
                                <label>Work period*</label>
                                <input 
                                    type="date"
                                    name="sDate"
                                    value={formValues.sDate}
                                    onChange={handleChange}/>
                                    <div className="errorMessage">
                                        <p>{formErrors.sDate}</p> -&nbsp;
                                    </div>
                                    <input class = "fDate"
                                    type="date"
                                    name="fDate"
                                    value={formValues.fDate}
                                    onChange={handleChange}/>
                            </div>

                            <div className="errorMessage">
                                <p>{formErrors.fDate}</p>
                            </div>

                    </fieldset>
                    </div>

                    <div className = "info">
                        <p>Fields marked with an asterisk (*) are required</p>
                    </div>

                    <div id="submit">
                        <button className = "clearButton" onClick={handleClear}>Clear</button>
                        <button className="submitButton" onClick={handleSubmit}>Submit</button>
                    </div>
                </form>
            )}
        </div>
    );

}

export default ProfilePage
