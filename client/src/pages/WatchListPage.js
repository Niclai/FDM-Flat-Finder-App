import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import { useState, useEffect } from "react";
import './pagesCSS/watchList.css';
import RentFormPage from './RentFormPage';
import axios from 'axios';


const WatchListPage = () => {

    const [WatchList, setWatchList] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [showRentForm, setShowRentForm] = useState(false);

    useEffect(() => {
    
        const getWatchList = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getWatchList');
                setWatchList(response.data);
            } catch (error) {
                console.log('Error fetching watchList: ', error);
            }
        };
        getWatchList();
    }, []);

    const handleApply = () => {
        setShowRentForm(true);
    }


    const RemoveFromWatchList = async (listing) => {
        try {
            await axios.post('http://localhost:5000/removeFromWatchList', { _id: listing._id });
            // Remove the listing from the local state
            setWatchList(WatchList.filter(item => item._id !== listing._id));
            showAndHideNotification(); // Show notification
        } catch (error) {
            console.log('Error removing from watchList: ', error);
        }
    };


    const showAndHideNotification = () => {
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      };

    

    if (showRentForm) {
        return (
            <RentFormPage/>
        )
    }

    return (
        <div className="watchList_div">
            <h1 className = "watchList_title">Watchlist page</h1>
            {WatchList.length === 0 ?(
                <>
                <div className="EmptyWatchList">
                    <img src={require('./assets/empty_logo.png')} alt =''/>
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
                </>
            ) : (
                <><ul>
                        {WatchList.map((listing) => (
                            <li key={listing._id} className="watchListItems">
                                <div className="listingContainer">
                                    <div className="listingImage">
                                        <img src={require(`./ListingImages/${listing.image}`)} alt='' />
                                    </div>
                                    <div className="propertyInfo">
                                        <p>No. of Rooms: {listing.noRooms}</p>
                                        <p>Type of Property: {listing.typeOfProperty}</p>
                                        <p>Flat Share: {listing.flatShare ? 'Yes' : 'No'}</p>
                                        <p>Duration of Time: {listing.durationOfTime}</p>
                                        <p>Price: £{listing.price}</p>
                                        <div className="notification" style={{ display: showNotification ? 'block' : 'none' }}>
                                            Removed
                                        </div>
                                    </div>
                                    <div className="WatchListButtons">
                                        <button onClick={() => RemoveFromWatchList(listing)}>Remove</button>
                                        <button onClick={handleApply}>Apply To Rent</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
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
                </div></>
            )}
        </div>
        
       
    );
}

export default WatchListPage;