import { useState } from "react";
import './pagesCSS/CreateListingPage.css';
import axios from 'axios';


const CreateListingPage = () => {

    const initialValues = { noRooms: "", typeOfProperty: "House", flatShare: false, durationOfTime: "", price: ""};
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => { // update to async function
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);

        // Send POST request to Flask API
        try {
            const response = await axios.post('http://localhost:5000/submitListings',{
              noRooms: parseInt(formValues.noRooms),
              typeOfProperty: formValues.typeOfProperty,
              flatShare: formValues.flatShare,
              durationOfTime: formValues.durationOfTime + " months",
              price: parseInt(formValues.price),
              image: "no_image.jpeg"
        });
            if (response.ok) {
                // Listing added successfully, reset form values
                setFormValues(initialValues);
            } else {
                // Handle error
                console.error('Failed to add listing:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to add listing:', error);
        }
    };

    const validate = (values) => {              //form validation function
        const errors = {};
        if (!values.noRooms) {
          errors.noRooms = "Number of Rooms is required";
        }
        else if (formValues.noRooms <= "0"){
          errors.noRooms = "Number of rooms has to be greater then zero"
        }
        if (!values.durationOfTime) {
          errors.durationOfTime = "Duration of Time is required";
        }
        else if (formValues.durationOfTime <= "0"){
          errors.durationOfTime = "Duration of time must be greater then zero"
        }
        if (!values.price) {
          errors.price = "Price is required";
        }
        else if (formValues.price <= "0"){
          errors.price = "Price must be greater then zero"
        }
        return errors;
      };

    return (                                   
        <div className="createListingContainer">
          {Object.keys(formErrors).length === 0 && isSubmit ? (
            <div className="submitSuccess">Listing submitted</div> //conditionaly returns if form is submitted
          ) : (     
              <form onSubmit={handleSubmit} name="CreateListingForm">
              <div className="SubmitListingFormTitle">
                <h1>Submit Listing Form</h1>
              </div>
              <div className="ui-form">
                <div className="field">
                  <label>Number of Rooms</label>
                  <input
                    type="number"
                    name="noRooms"
                    placeholder="Number of Rooms"
                    value={formValues.noRooms}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="error-message">
                  <p>{formErrors.noRooms}</p>
                </div>

                <div className="field">
                  <label>Type of Property</label>
                  <select name="typeOfProperty" size="1" value={formValues.typeOfProperty} onChange={handleChange}>
                    <option value="House">House</option>
                    <option value="Flat">Flat</option>
                  </select>
                </div>

                <div className="field">
                  <label>Flat Share</label>
                  <input
                    type="checkbox"
                    name="flatShare"
                    checked={formValues.flatShare}
                    onChange={(e) => setFormValues({ ...formValues, flatShare: e.target.checked })}
                  />
                </div>
                <div className="error-message">
                  <p>{formErrors.flatShare}</p>
                </div>

                <div className="field">
                  <label>Duration of Time (Months)</label>
                  <input
                    type="number"
                    name="durationOfTime"
                    placeholder="Duration"
                    value={formValues.durationOfTime}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="error-message">
                  <p>{formErrors.durationOfTime}</p>
                </div>

                <div className="field">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formValues.price}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="error-message">
                  <p>{formErrors.price}</p>
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

export default CreateListingPage;