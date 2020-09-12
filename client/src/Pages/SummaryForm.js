import React, { useEffect, useState, memo, lazy, Suspense } from 'react';
import { Typography, PageHeader, message } from 'antd';
import { useVendorContext } from '../Context/vendorContext';
import Axios from 'axios';
import moment from 'moment';
import { QRCode } from 'react-qr-svg';
import { apiUrl } from '../config';
import { Dimensions } from '../Utils/sitedimension';

const CustomButton = lazy(() => import('../Components/Button'));
const { Text } = Typography;

function SummaryForm(props) {
    const [vendor, setVendor] = useState({});
    const [print, setPrint] = useState(false);
    const { vendorData } = useVendorContext();
    const { width } = Dimensions.useWindowDimensions();

    const onError = () => {
        return message.error("Please check your internet connection");
    }

    const onNoVendor = () => {
        return message.error("Invalid Vendor Id");
    }

    useEffect(() => {
        if (vendorData) {
            setVendor(vendorData);
        }
        else {
            Axios.get(`/vendors/get-vendor/${props.match.params.id}`)
                .then((result) => {
                    setVendor(result.data.vendor);
                })
                .catch((err) => {
                    if (err.response) {
                        if (err.response.data.message === "Could not find vendor.")
                            onNoVendor();
                    }
                    else
                        onError()
                })
        }
    }, [vendorData]);

    const styles = {
        view: {
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            minHeight: '70vh',
            paddingLeft: 20,
            paddinRight: 20,
            fontSize: 12
        },
        title: {
            fontWeight: "bold",
            marginBottom: 4
        },
        select: {
            width: "80%"
        },
        image: {
            height: 60,
            width: 109.8,
            marginTop: 10
        },
        mainHeading: {
            color: "#5cb85c",
        },
        heading: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10
        }
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                onBack={print ? () => { props.history.goBack() } : null}
                title="Vendor Summary"
                extra={[
                    <img style={styles.image} src={require('../Assets/logo.webp')} alt="dollar" />
                ]}
            />
            <div style={styles.view}>
                <Text style={styles.mainHeading}>Vendor KYC submitted successfully!</Text>
                <Text>{moment(vendor.updatedAt).format("DD-MM-YYYY hh:mm A")}</Text>
                <QRCode
                    level="Q"
                    width={120}
                    className="qr-code"
                    value={`${apiUrl}/summary-form/${props.match.params.id}`}
                />
                <br />
                <Text><Text style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>Name</Text> - {vendor.name}</Text>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Text><Text style={{ fontWeight: "bold" }}>Company Code</Text> - {vendor.company_code}</Text>
                    <Text><Text style={{ fontWeight: "bold", marginLeft: 20 }}>Vendor Code</Text> - {vendor.vendor_code}</Text>
                </div>

                <Text><Text style={{ fontWeight: "bold" }}>PAN Number</Text> - {vendor.pan_no}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>GST Number</Text> - {vendor.gst_no}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Phone Number</Text> - {vendor.phone_number}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Email</Text> - {vendor.email}</Text>
                <br />
                <Text style={styles.heading}>Organization Details</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Type Of Organization</Text> - {vendor.type_of_organization}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>MSME</Text> - {vendor.is_msme === "Y" ? "Yes" : "No"}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Turnover {'>'} 500 cr.</Text> - {vendor.turnover ? "Yes" : "No"}</Text>
                {vendor.is_msme === "Y" ?
                    <>
                        <Text><Text style={{ fontWeight: "bold" }}>MSME Reg. No.</Text> - {vendor.msme_reg_no}</Text>
                        <Text><Text style={{ fontWeight: "bold" }}>MSME Valid From</Text> - {moment(vendor.msme_valid_from).format("DD-MM-YYYY")}</Text>
                    </> : null}
                <Text><Text style={{ fontWeight: "bold" }}>Address Line 1</Text> - {vendor.address_line1}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Address Line 2</Text> - {vendor.address_line2}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Address Line 3</Text> - {vendor.address_line3}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>City</Text> - {vendor.city}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>State</Text> - {vendor.state}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Pin Code</Text> - {vendor.pin_code}</Text>
                <br />
                <Text style={styles.heading}>Account and Bank Details</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Account Head Name</Text> - {vendor.accounts_head_name}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Account Head Phone</Text> - {vendor.accounts_head_mobile}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Account Head Email</Text> - {vendor.accounts_head_email}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Bank Name</Text> - {vendor.bank_name}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Bank Account Number</Text> - {vendor.bank_account_no}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Account Type</Text> - {vendor.bank_account_type}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>Bank IFSC</Text> - {vendor.bank_ifsc}</Text>
                <br />
                <Text style={styles.heading}>Documents Provided</Text>
                <Text><Text style={{ fontWeight: "bold" }}>PAN</Text> - {vendor.pan_attachment && vendor.pan_attachment.substr(7)}</Text>
                <Text><Text style={{ fontWeight: "bold" }}>GST</Text> - {vendor.gst_attachment && vendor.gst_attachment.substr(7)}</Text>
                {vendor.is_msme === "Y" ? <Text><Text style={{ fontWeight: "bold" }}>MSME</Text> - {vendor.msme_attachment && vendor.msme_attachment.substr(7)}</Text> : null}
                <Text><Text style={{ fontWeight: "bold" }}>Bank</Text> - {vendor.bank_cancelled_cheque && vendor.bank_cancelled_cheque.substr(7)}</Text>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    <Suspense>
                        <CustomButton
                            type="primary"
                            title="Print"
                            width={"30%"}
                            print={print}
                            onClick={() => {
                                const timer = setTimeout(() => {
                                    setPrint(true);
                                    window.print();
                                    setPrint(false);
                                    props.history.push(`/gst-listing/${vendor.pan_no}`);
                                }, 1000);
                            }}
                        />
                    </Suspense>
                    <Suspense>
                        <CustomButton
                            type="primary"
                            title="Share"
                            width={"30%"}
                            print={print}
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `Dollar Vendor ${vendor._id}`,
                                        text: "Get the information of your account with us",
                                        url: `https://www.dollarvendorapp.com/summary-form/${props.match.params.id}`
                                    })
                                        .then(() => console.log("Successful Share"))
                                        .catch(error => console.log("Error sharing application", error));
                                }
                            }}
                        />
                    </Suspense>
                </div>
            </div>
        </>
    )
}

export default memo(SummaryForm);