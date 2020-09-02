import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

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

function App({ watch, settings }) {
  const { latitude, longitude, error } = usePosition(watch, settings);
  const [vendorData, setVendorData] = useState(null);

  if (error) {
    alert("Please allow your location to access.");
  }

  useEffect(() => {
    if (latitude && longitude) {
      console.log(latitude, longitude);
    }
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <VendorContext.Provider value={{ vendorData, setVendorData }}>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/phone-verify/:id" component={PhoneVerification} />
            <Route exact path="/request-pan-info" component={RequestPanInfo} />
            <Route exact path="/gst-listing/:id" component={GstListScreen} />
            <Route exact path="/organization-detail-form/:id" component={OrganisationDetails} />
            <Route exact path="/account-detail-form/:id" component={AccountDetailsPage} />
            <Route exact path="/attachement-details/:id" component={AttachmentPage} />
            <Route exact path="/summary-form/:id" component={SummaryForm} />
          </VendorContext.Provider>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
