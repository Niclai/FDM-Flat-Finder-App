import NavBar from "./components/NavBar";
import ProfilePage from "./pages/ProfilePage"
import SearchPropertyPage from "./pages/SearchPropertyPage";
import WatchListPage from "./pages/WatchListPage";
import LoginPage from "./pages/LoginPage";
import CreateListingPage from "./pages/CreateListingPage";

function App() {
  console.log(window.location);  //use this to see where the file paths are and change for each case statement
  let component; //set as default page
  switch (window.location.pathname) {       //switch case to chose where to take the user
    case "/pages/SearchPropertyPage":
      component = <SearchPropertyPage/>
      break;
    case "/pages/ProfilePage":
      component = <ProfilePage/>
      break;
    case "/pages/WatchListPage":
      component = <WatchListPage/>
      break;
    case "/pages/LoginPage":
      component = <LoginPage/>
      break;
    case "/pages/CreateListingPage":
      component = <CreateListingPage/>
      break;
    default:
      component = <LoginPage/>
  }

  if (window.location.pathname === "/pages/LoginPage" || window.location.pathname === '/') {
  return (       //navBar will always stay at the top.
    <>     
      {component}
    </>
  );
  }
  return <><NavBar/>{component}</>
}

export default App;
