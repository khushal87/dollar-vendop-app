import { createContext, useContext } from 'react';

//Auth Context
export const VendorContext = createContext({
    vendorData: null,
    setVendorData: (data) => { }
});

//Use Auth Context
export function useVendorContext() {
    return useContext(VendorContext);
}
