import React, { useEffect, useState, Suspense, lazy } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { message, Spin } from 'antd';
import './App.css';
import { VendorContext } from './Context/vendorContext';
import { Dimensions } from './Utils/sitedimension';
import { AuthContext } from './Context/AuthContext';
import { usePosition } from 'use-position';

//Pages
const Homepage = lazy(() => import('./Pages/Homepage'));
const RequestPanInfo = lazy(() => import('./Pages/RequestPanInfo'));
const GstListScreen = lazy(() => import('./Pages/GstListScreen'));
const PhoneVerification = lazy(() => import('./Pages/PhoneVerification'));
const OrganisationDetails = lazy(() => import('./Pages/OrganisationDetails'));
const AccountDetailsPage = lazy(() => import('./Pages/AccountDetailsPage'));
const AttachmentPage = lazy(() => import('./Pages/AttachmentPage'));
const SummaryForm = lazy(() => import('./Pages/SummaryForm'));
const VendorReport = lazy(() => import('./Pages/VendorReports'));

function App() {
  const [vendorData, setVendorData] = useState(null);
  const [latitudeData, setLatitude] = useState(null);
  const [longitudeData, setLongitude] = useState(null);
  let tokens = localStorage.getItem("userToken");
  tokens = tokens === "null" ? JSON.parse(tokens) : tokens;
  const [token, setToken] = useState(tokens);
  const { width } = Dimensions.useWindowDimensions();
  const watch = true;
  const { latitude, longitude, timestamp, accuracy, error } = usePosition(watch);


  const onError = (error) => {
    alert("Please allow your location to continue");
    message.error("Please allow your location to continue");
  }

  useEffect(() => {
    setLatitude(latitude);
    setLongitude(longitude);
  }, [latitude, longitude]);

  const setTokens = (data) => {
    localStorage.setItem("userToken", JSON.stringify(data));
    setToken(data)
  }

  if (error) {
    onError();
  }

  return (
    <AuthContext.Provider value={{ token: token, setToken: setTokens }}>
      {width > 800 ?
        <div className="App-desktop">
          <BrowserRouter>
            <Suspense fallback={
              <div className="App-header">
                <Spin size="large" />
              </div>
            }>
              <Switch>
                <VendorContext.Provider value={{
                  vendorData, setVendorData,
                  latitude: latitude,
                  longitude: longitude,
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
                  <Route exact path="/vendor-report" component={VendorReport} />

                </VendorContext.Provider>
              </Switch>
            </Suspense>
          </BrowserRouter>
        </div> :
        <div className="App">
          <BrowserRouter>
            <Suspense fallback={
              <div className="App-header">
                <Spin size="large" />
              </div>
            }>
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
                  <Route exact path="/vendor-report" component={VendorReport} />
                </VendorContext.Provider>
              </Switch>
            </Suspense>
          </BrowserRouter>
        </div>}
    </AuthContext.Provider>
  );
}

export default App;
