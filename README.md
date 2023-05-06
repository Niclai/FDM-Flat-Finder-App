# FDM-Flat-Finder-App

## Project Description: 
This is a university project tasked by 'FDM' given to me. The task was developed to allow FDM consultants to advertise there properties to rent, and also allow them to look for properties. Similiar to existing websites such as 'rightmove' but this platform is exclusive to FDM consultants.

How this platform works is by consultants having there own profiles. By using a login system each user will have there own 'unique' website. 

As consultants can list their own property, other users can see who has submited that listing and can reach out to them for further information using the rent application form. Furthermore all rent applications sent to a listing can be linked back to a consultant. This gives the whole experience a personal touch as all actions can be traced back to a consultant. All the listings are externally saved and fetched from a ***mongo Database***. This ensures real time updates to the data being displayed on the website.

### Features: 
- WatchList page specific to consultants
- Real time data fetching
- Rent application Forms/Submit a property for listing form
- Login system for consultants
- Mongo Database that stores all listings and consultant information 

## Technologies used:
React, Javascript, CSS, BootStrap, Python, MongoDB

## How to run: 
To run this application you would have to change directory into the ***server*** file and run the file "server.py" 'python3 server.py' Whilst this file is running you will have to change directory to the ***client*** folder in a seperate **Terminal** and then run the project by using 'npm start'.

As a consultants credentials must be entered to log into the websites home page, if you do not have the login credentials you are greeted with a log in page and this is the furthest you can go. If you have access to credentials then you are able to log in and access the full website.

## Example of running: 

![LoginPage](/ReadMeImages/Login.png "LoginPage")
![homePage](/ReadMeImages/homePage.png "HomePage")
![search](/ReadMeImages/search.png "search")
![footer](/ReadMeImages/footer.png "footer")
![submitListing](/ReadMeImages/submitListing.png "submitListing")
![profile](/ReadMeImages/profile.png "profilePage")

![watchlist](/ReadMeImages/watchlist.png "watchlistPage")


