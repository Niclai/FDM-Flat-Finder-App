import './pagesCSS/RentFormPage.css';
import { useState } from "react";


const RentFormPage = () => {


  const initialValues = { firstName: "", surname: "", email: "", phoneNumber: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);


  const handleChange = (e) => {              //function that updates values constantly
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };


  const handleSubmit = (e) => {        //handles when form is submitted
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  
  const validate = (values) => {              //form validation function
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.firstName) {
      errors.firstName = "First name is required!";
    }
    if (!values.surname) {
        errors.surname = "surname is required!";
      }
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (values.phoneNumber.length !== 11) {
      errors.phoneNumber = "Phone number must be 11 digits long";
    }
    return errors;
  };


  return (                                   
    <div className="rentFormContainer">
      {Object.keys(formErrors).length === 0 && isSubmit ? (
        <div className="submitSuccess">Application Submitted</div>
      ) : (                                           //conditionaly returns if form is submitted
        <form onSubmit={handleSubmit} name="CreateRentForm">
        <div className="RentApplicationFormTitle">
          <h1>Rent Application Form:</h1>
        </div>
        <div className="ui-form">
          <div className="field">
            <label>First Name</label>
            <input
              className='rent-input'
              type="text"
              name="firstName"
              placeholder="firstName"
              value={formValues.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="error-message">
            <p>{formErrors.firstName}</p>
          </div>

          <div className="field">
            <label>Surname</label>
            <input
              type="text"
              className='rent-input'
              name="surname"
              placeholder="surname"
              value={formValues.surname}
              onChange={handleChange}
            />
          </div>

          <div className="error-message">
            <p>{formErrors.surname}</p>
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="text"
              className='rent-input'
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>

          <div className="error-message">
            <p>{formErrors.email}</p>
          </div>

          <div className="field">
            <label>Phone number</label>
            <input
              type="phoneNumber"
              name="phoneNumber"
              placeholder="phoneNumber"
              value={formValues.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="error-message">
            <p>{formErrors.phoneNumber}</p>
          </div>

          <div id="submit">
            <button className="submitButton">Submit</button>
          </div>
        </div>
      </form>
      )}
    </div>
  );
}

export default RentFormPage;
