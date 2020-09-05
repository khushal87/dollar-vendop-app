import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { message } from 'antd';
import './App.css';
import Homepage from './Pages/Homepage';
import RequestPanInfo from './Pages/RequestPanInfo';
import GstListScreen from './Pages/GstListScreen';
import { usePosition } from './Hooks/usePosition';
import PhoneVerification from './Pages/PhoneVerification';
import OrganisationDetails from './Pages/OrganisationDetails';
import AccountDetailsPage from './Pages/AccountDetailsPage';
import { VendorContext } from './Context/vendorContext';
import AttachmentPage from './Pages/AttachmentPage';
import SummaryForm from './Pages/SummaryForm';
import { Dimensions } from './Utils/sitedimension';
import { AuthContext } from './Context/AuthContext';


function App({ watch, settings }) {
  const [vendorData, setVendorData] = useState(null);
  const [latitudeData, setLatitude] = useState(null);
  const [longitudeData, setLongitude] = useState(null);
  let tokens = localStorage.getItem("userToken");
  tokens = tokens === "null" ? JSON.parse(tokens) : tokens;
  const [token, setToken] = useState(tokens);
  const { width } = Dimensions.useWindowDimensions();
  // const { latitude, longitude, error } = usePosition(watch, settings);


  // if (error) {
  //   alert("Please allow your location to access.");
  // }

  const onChange = ({ coords }) => {
    setLatitude(coords.latitude);
    setLongitude(coords.longitude);
  }

  const onError = (error) => {
    message.error("Please allow your location to continue");
  }

  useEffect(() => {
    const latLng = navigator.geolocation.watchPosition(onChange, onError);
  }, []);

  const setTokens = (data) => {
    localStorage.setItem("userToken", JSON.stringify(data));
    setToken(data)
  }

  return (
    <AuthContext.Provider value={{ token: token, setToken: setTokens }}>
      {width > 800 ?
        <div className="App-desktop">
          <BrowserRouter>
            <Switch>
              <VendorContext.Provider value={{
                vendorData, setVendorData,
                latitude: latitudeData,
                longitude: longitudeData,
                setLatitude, setLongitude
              }}>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/phone-verify/:id" component={PhoneVerification} />
                <Route exact path="/request-pan-info/:id" component={RequestPanInfo} />
                <Route exact path="/gst-listing/:id" component={GstListScreen} />
                <Route exact path="/organization-detail-form/:id" component={OrganisationDetails} />
                <Route exact path="/account-detail-form/:id" component={AccountDetailsPage} />
                <Route exact path="/attachement-details/:id" component={AttachmentPage} />
                <Route exact path="/summary-form/:id" component={SummaryForm} />
              </VendorContext.Provider>
            </Switch>
          </BrowserRouter>
        </div> :
        <div className="App">
          <BrowserRouter>
            <Switch>
              <VendorContext.Provider value={{
                vendorData, setVendorData,
                latitude: latitudeData, longitude: longitudeData,
                setLatitude, setLongitude
              }}>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/phone-verify/:id" component={PhoneVerification} />
                <Route exact path="/request-pan-info/:id" component={RequestPanInfo} />
                <Route exact path="/gst-listing/:id" component={GstListScreen} />
                <Route exact path="/organization-detail-form/:id" component={OrganisationDetails} />
                <Route exact path="/account-detail-form/:id" component={AccountDetailsPage} />
                <Route exact path="/attachement-details/:id" component={AttachmentPage} />
                <Route exact path="/summary-form/:id" component={SummaryForm} />
              </VendorContext.Provider>
            </Switch>
          </BrowserRouter>
        </div>}
    </AuthContext.Provider>
  );
}

export default App;
