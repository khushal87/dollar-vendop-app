import React, { useState, useEffect } from 'react';
import { PageHeader, Select, Typography, Radio, DatePicker, message } from 'antd';
import TextInput from '../Components/TextInput';
import states from '../Defaults/state';
import CustomButton from '../Components/Button';
import Axios from 'axios';
import moment from 'moment';
import { useVendorContext } from '../Context/vendorContext';

const { Option } = Select;
const { Text } = Typography;

function OrganizationDetails(props) {
    const [toa, setTOA] = useState(null);
    const [is_MSME, setIsMSME] = useState("N");
    const [turnover, setTurnOver] = useState(false);
    const [msme_reg_no, setMSMERegNo] = useState("");
    const [msme_valid_from, setMSMEValidFrom] = useState("");
    const [address_line1, setAddressLine1] = useState("");
    const [address_line2, setAddressLine2] = useState("");
    const [address_line3, setAddressLine3] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState(null);
    const [pincode, setPinCode] = useState("");
    const [email, setEmail] = useState("");
    const [gst_no, setGSTNo] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [contact_person_name, setContactPersonName] = useState("");
    const { vendorData, setVendorData } = useVendorContext();

    useEffect(() => {
        if (vendorData) {
            const {
                type_of_organization,
                address_line1,
                address_line2,
                address_line3,
                city, state,
                pin_code,
                turnover,
                is_msme,
                msme_reg_no,
                msme_valid_from,
                phone_number,
                email,
                contact_person_name,
                gst_no
            } = vendorData;
            const test = states.filter(item => item.TIN == gst_no.substring(0, 2))[0];
            setTOA(type_of_organization);
            setTurnOver(turnover);
            setIsMSME(is_msme);
            setMSMERegNo(msme_reg_no);
            setMSMEValidFrom(msme_valid_from);
            setAddressLine1(address_line1);
            setAddressLine2(address_line2);
            setAddressLine3(address_line3);
            setCity(city);
            setState(state ? state : test && (test.TIN + "-" + test.State));
            setPinCode(pin_code);
            setPhoneNumber(phone_number);
            setEmail(email);
            setContactPersonName(contact_person_name);
            setGSTNo(gst_no);
        }
        else {
            Axios.get(`/vendors/get-vendor/${props.match.params.id}`)
                .then((result) => {
                    const vendorData = result.data.vendor;
                    const {
                        type_of_organization,
                        address_line1,
                        address_line2,
                        address_line3,
                        city, state,
                        pin_code,
                        turnover,
                        is_msme,
                        msme_reg_no,
                        msme_valid_from,
                        email,
                        phone_number,
                        contact_person_name,
                        gst_no
                    } = vendorData;
                    const test = states.filter(item => item.TIN == gst_no.substring(0, 2))[0];

                    setTOA(type_of_organization);
                    setTurnOver(turnover);
                    setIsMSME(is_msme);
                    setMSMERegNo(msme_reg_no);
                    setMSMEValidFrom(msme_valid_from);
                    setAddressLine1(address_line1);
                    setAddressLine2(address_line2);
                    setAddressLine3(address_line3);
                    setCity(city);
                    setState(state ? state : test && (test.TIN + "-" + test.State));
                    setPinCode(pin_code);
                    setPhoneNumber(phone_number);
                    setEmail(email);
                    setContactPersonName(contact_person_name);
                    setGSTNo(gst_no);
                })
                .catch((err) => {
                    console.log(err);
                })
        }

    }, [vendorData]);

    const styles = {
        view: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            minHeight: '70vh'
        },
        title: {
            fontWeight: "bold",
            marginBottom: 4
        },
        select: {
            width: "80%",
            color: "black"
        },
        stateView: {
            padding: 6,
            border: "1px solid #d9d9d9",
            width: "70%"
        }
    }

    function onChange(value) {
        setTOA(value);
    }

    const onStateChange = (value) => {
        setState(value);
    }

    const onMSMEchange = e => {
        localStorage.setItem("is_msme", e.target.value);
        setIsMSME(e.target.value);
    };

    const onTurnOverChange = e => {
        setTurnOver(e.target.value);
    }

    function onSearch(val) {
        console.log('search:', val);
    }

    function onDateChange(date, dateString) {
        console.log(date)
        setMSMEValidFrom(date);
    }

    const success = () => {
        message.success('Form Submitted Successfully');
    };

    const error = () => {
        message.error('This is an error message');
    };

    const disabledHandler = () => {
        if (is_MSME === "Yes") {
            return toa && msme_reg_no && msme_valid_from && address_line1 && state && city && pincode;
        }
        else {
            return toa && address_line1 && state && city && pincode;
        }
    }



    const onSubmitHandler = () => {
        const params = {
            type_of_organization: toa,
            is_msme: is_MSME,
            msme_reg_no: msme_reg_no,
            msme_valid_from: msme_reg_no ? moment(msme_valid_from).format("YYYY-MM-DD") : null,
            address_line1,
            address_line2,
            address_line3,
            state, city,
            pin_code: pincode,
            turnover: turnover
        }
        Axios.put(`/vendors/update-vendor-organization-details/${props.match.params.id}`, params)
            .then(result => {
                success();
                setVendorData(result.data.vendor);
                props.history.push(`/phone-verify/${props.match.params.id}`, {
                    email: email,
                    phone: phone_number,
                    contact_person_name: contact_person_name
                })
            })
            .catch((err) => {
                console.log(err);
                error();
            })
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                onBack={() => { props.history.goBack() }}
                title="Organization Details"
            />
            <div style={styles.view}>
                <Text style={styles.title}>Type of Organization<Text type="danger">*</Text></Text>
                <Select
                    value={toa}
                    showSearch
                    style={styles.select}
                    placeholder="Select a type of orgarnization"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    <Option value="Private Ltd Company">Private Ltd Company</Option>
                    <Option value="Public Ltd Company">Public Ltd Company</Option>
                    <Option value="Proprietorship">Proprietorship</Option>
                    <Option value="Partnership">Partnership</Option>
                    <Option value="LLP">LLP</Option>
                    <Option value="Others">Others</Option>
                </Select>
                <br />

                <Text style={styles.title}>Turnover {'>'} 500 crore<Text type="danger">*</Text></Text>
                <Radio.Group style={{ marginBottom: 10 }} onChange={onTurnOverChange} value={turnover}>
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                </Radio.Group><Text style={styles.title}>Is MSME<Text type="danger">*</Text></Text>
                <Radio.Group style={{ marginBottom: 10 }} onChange={onMSMEchange} value={is_MSME}>
                    <Radio value={"Y"}>Yes</Radio>
                    <Radio value={"N"}>No</Radio>
                </Radio.Group>
                {is_MSME === "Y" ? <>
                    <TextInput
                        value={msme_reg_no}
                        required={true}
                        suffix={msme_reg_no ? "Edit" : null}
                        onChange={(text) => { setMSMERegNo(text.toUpperCase()) }}
                        title="MSME Registration number"
                        autoFocus={true}
                        placeholder="Enter Registration Number"
                    />
                    <Text style={styles.title}>Valid From<Text type="danger">*</Text></Text>
                    <DatePicker
                        allowClear={false}
                        suffixIcon={() => { }}
                        // value={moment(msme_valid_from)}
                        // format={"DD-MM-YYYY"}
                        onChange={onDateChange} />
                </> : null}
                <TextInput
                    value={address_line1}
                    required={true}
                    onChange={(text) => { setAddressLine1(text.toUpperCase()) }}
                    title="Address line 1"
                    placeholder="Enter Address line 1"
                />
                <TextInput
                    value={address_line2}
                    onChange={(text) => { setAddressLine2(text.toUpperCase()) }}
                    title="Address line 2"
                    placeholder="Enter Address line 2"
                />
                <TextInput
                    value={address_line3}
                    onChange={(text) => { setAddressLine3(text.toUpperCase()) }}
                    title="Address line 3"
                    placeholder="Enter Address line 3"
                />
                <TextInput
                    value={city}
                    required={true}
                    onChange={(text) => { setCity(text.toUpperCase()) }}
                    title="City"
                    placeholder="Enter City"
                />
                <Text style={styles.title}>State<Text type="danger">*</Text></Text>
                <div style={styles.stateView}>
                    <Text style={{ color: "color: rgba(0, 0, 0, 0.65)" }}>{state}</Text>
                </div>
                <TextInput
                    value={pincode}
                    required={true}
                    onChange={(text) => { setPinCode(text.toUpperCase()) }}
                    title="Pin Code"
                    placeholder="Enter Pin Code"
                />
                <CustomButton
                    title={"Submit"}
                    disabled={!disabledHandler()}
                    onClick={onSubmitHandler}
                />
                <br />
            </div>
        </>
    )
}

export default OrganizationDetails;