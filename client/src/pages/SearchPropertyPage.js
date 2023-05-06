import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import Flat2 from './assets/flat2.jpeg';
import Flat3 from './assets/flat3.jpeg';
import Flat4 from './assets/flat4.jpeg';
import './pagesCSS/searchProp.css';
import RentFormPage from "./RentFormPage";
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const SearchProperty = () => {

  const [showNotification, setShowNotification] = useState(false);
  const [showRentForm, setShowRentForm] = useState(false);
  const initialValues = { maxPrice: "", maxBedrooms: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 3;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };


  const handleApply = () => {
    setShowRentForm(true);
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    const FormErrors = validate(formValues);
    setFormErrors(FormErrors);

    if (Object.keys(FormErrors).length === 0) {
      try {
        const response = await axios.get('http://localhost:5000/FilterListings', {
          params: {
            max_price: parseInt(formValues.maxPrice),
            max_bedrooms: parseInt(formValues.maxBedrooms),
          },
        });
        setListings(response.data);
        console.log(response.data);
        setCurrentPage(1); // Reset the current page to 1 when new search is performed
      } catch (error) {
        console.error(error);
      }
    }
  };


  const validate = (values) => {
    const errors = {};
    if (!values.maxBedrooms) {
      errors.maxBedrooms = "maxRooms required";
    } else if (formValues.maxBedrooms <= "0") {
      errors.maxBedrooms = "Number of maxRooms must be greater than zero";
    }
    if (!values.maxPrice) {
      errors.maxPrice = "maxPrice is required";
    } else if (formValues.maxPrice < "0") {
      errors.maxprice = "maxPrice must be greater than zero";
    }

    return errors;
  };


  const saveListing = async (listing) => {
    try {
      const response = await axios.post('http://localhost:5000/saveToWatchList', {
        noRooms: parseInt(listing.noRooms),
        typeOfProperty: listing.typeOfProperty,
        flatShare: listing.flatShare,
        durationOfTime: listing.durationOfTime,
        price: parseInt(listing.price),
        image: listing.image});
        
        showAndHideNotification(); // Show notification
        console.log(response.data);

      } catch (error){
        console.error("Error")
      }
  };


  const showAndHideNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };


  const fetchAllListings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/listings');
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching all listings:', error);
    }
  };


  useEffect(() => {
    fetchAllListings();
  }, []);


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);

  const totalPages = Math.ceil(listings.length / listingsPerPage);


  if (showRentForm) {
    return (
        <RentFormPage/>
    )
  }

  return (
    <div className='search-property'>
      <div className='hero'>
        <div className='Title'>
          <p>"Bringing Consultants Together... one Home at a time" </p>
        </div>
      </div>
      <div className='findFlat'>
        <h1>Find Your Home...</h1>
        <div>
          <p>
            <span className='bold'>All</span>
          </p>
          <p>UK</p>
          <p>US</p>
          <p>Germany</p>
          <p>Singapore</p>
          <p>China</p>
        </div>
      </div>

      <div className="Searchfeature">
        <form onSubmit={handleSubmit}>

        <label>Max Price:</label>
        <input
          type="number"
          name="maxPrice"
          value={formValues.maxPrice}
          onChange={handleChange}
        />

        <label>Max Bedrooms:</label>
        <input
          type="number"
          name="maxBedrooms"
          value={formValues.maxBedrooms}
          onChange={handleChange}
        />

        <div className="error-message">
          <p>{formErrors.maxBedrooms} {formErrors.maxPrice}</p>
        </div>

        <button type="submit">Search</button>
        </form>
        
        <button onClick={fetchAllListings} name="showAllButton">Show All Properties</button>

        <div className="ListingsDisplay">
          <h2>Listings:</h2>
          {currentListings.length === 0 ?(
            <div className="noListings">
              <p> No listings Found</p>
            </div>
          ) : (
            <ul>
              {currentListings.map((listing) => (
                <li key={listing._id}>
                  <div className="listingImage">
                    <img src={require(`./ListingImages/${listing.image}`)} alt=''/>
                  </div>
                  <div className="propertyInfo">
                    <p>No. of Rooms: {listing.noRooms}</p>
                    <p>Type of Property: {listing.typeOfProperty}</p>
                    <p>Flat Share: {listing.flatShare ? 'Yes' : 'No'}</p>
                    <p>Duration of Time: {listing.durationOfTime}</p>
                    <p>Price: £{listing.price}</p>
                    <div className="notification" style={{ display: showNotification ? 'block' : 'none' }}>
                      Added to watchlist
                    </div>
                  </div>
                  <div className="listingButtons">
                    <button onClick={() => saveListing(listing)}>Add To Watchlist</button>
                    <button onClick={handleApply}>Apply To Rent</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className='findFlat'>
        <div className='Imagecontainer'>
          <img src={Flat2} alt='' />
          <img src={Flat3} alt='' />
          <img src={Flat4} alt='' />
        </div>
      </div>

      <div className='footer'>
        <div className='social'>
          <FaFacebook className='icon' />
          <FaInstagram className='icon' />
          <FaTwitter className='icon' />
          <FaPinterest className='icon' />
        </div>
        <div className='footerContainer'>
          <div className='col'>
            <h3>About</h3>
            <p>Company</p>
            <p>Details</p>
            <p>Planning</p>
            <p>About Us</p>
          </div>
          <div className='col'>
            <h3>Company</h3>
            <p>Listings</p>
            <p>Pricing</p>
            <p>Future</p>
            <p>Our People</p>
          </div>
          <div className='col'>
            <h3>Legal</h3>
            <p>Status</p>
            <p>Documentation</p>
            <p>Training</p>
            <p>Tools</p>
          </div>
          <div className='col'>
            <h3>Information</h3>
            <p>Security</p>
            <p>Privacy</p>
            <p>Contact</p>
            <p>Terms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProperty;
