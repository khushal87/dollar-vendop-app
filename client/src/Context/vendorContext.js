import { createContext, useContext } from 'react';

//Auth Context
export const VendorContext = createContext({
    vendorData: null,
    setVendorData: (data) => { },
    latitude: null,
    setLatitude: (data) => { },
    longitude: null,
    setLongitude: (data) => { }
});

//Use Auth Context
export function useVendorContext() {
    return useContext(VendorContext);
}
