import React, { useState, useEffect } from 'react';
import { PageHeader, Select, Typography, message } from 'antd';
import TextInput from '../Components/TextInput';
import CustomButton from '../Components/Button';
import Axios from 'axios';
import { useVendorContext } from '../Context/vendorContext';

const { Option } = Select;
const { Text } = Typography;



function OthersDetails(props) {
    const [accounts_head_name, setAccountHeadName] = useState("");
    const [accounts_head_email, setAccountHeadEmail] = useState("");
    const [accounts_head_mobile, setAccountHeadMobile] = useState("");
    const [bank_account_no, setBankAccountNo] = useState("");
    const [bank_name, setBankName] = useState("");
    const [bank_account_type, setBankAccountType] = useState("");
    const [bank_ifsc, setBankIFSC] = useState("");
    const { vendorData, setVendorData } = useVendorContext();

    useEffect(() => {
        if (vendorData) {
            const {
                accounts_head_name, accounts_head_email, accounts_head_mobile,
                bank_account_no, bank_account_type, bank_name, bank_ifsc, pan_no, gst_no
            } = vendorData;
            setAccountHeadEmail(accounts_head_email);
            setAccountHeadMobile(accounts_head_mobile);
            setAccountHeadName(accounts_head_name);
            setBankAccountNo(bank_account_no);
            setBankAccountType(bank_account_type);
            setBankIFSC(bank_ifsc);
            setBankName(bank_name);
        }
        else {
            Axios.get(`/vendors/get-vendor/${props.match.params.id}`)
                .then((result) => {
                    const vendorData = result.data.vendor;
                    const {
                        accounts_head_name, accounts_head_email, accounts_head_mobile,
                        bank_account_no, bank_account_type, bank_name, bank_ifsc
                    } = vendorData;
                    setAccountHeadEmail(accounts_head_email);
                    setAccountHeadMobile(accounts_head_mobile);
                    setAccountHeadName(accounts_head_name);
                    setBankAccountNo(bank_account_no);
                    setBankAccountType(bank_account_type);
                    setBankIFSC(bank_ifsc);
                    setBankName(bank_name);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, []);

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
            width: "80%"
        },
        heading: {
            fontSize: 18,
            fontWeight: "bold"
        }
    }

    function onChange(value) {
        setBankAccountType(value);
    }

    function onSearch(val) {
        console.log('search:', val);
    }


    const success = () => {
        message.success('Form Submitted Successfully');
    };

    const error = () => {
        message.error('This is an error message');
    };

    const disabledHandler = () => {
        return accounts_head_email && accounts_head_mobile && accounts_head_name && bank_account_no && bank_account_type && bank_ifsc && bank_name;
    }

    const onSubmitHandler = () => {
        const params = {
            accounts_head_name, accounts_head_mobile, accounts_head_email,
            bank_account_no, bank_account_type, bank_name, bank_ifsc
        }
        Axios.put(`/vendors/update-vendor-account-details/${props.match.params.id}`, params)
            .then(result => {
                setVendorData(result.data.vendor);
                success();
                props.history.push(`/attachement-details/${props.match.params.id}`);
            })
            .catch((err) => {
                console.log(err.response);
                error();
            })
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                onBack={() => { props.history.goBack() }}
                title="Account Details"
            />
            <div style={styles.view}>
                <Text style={styles.heading}>Account Head Details</Text>
                <TextInput
                    value={accounts_head_name}
                    required={true}
                    onChange={(text) => { setAccountHeadName(text.toUpperCase()) }}
                    title="Name"
                    placeholder="Enter Name"
                />
                <TextInput
                    value={accounts_head_mobile}
                    required={true}
                    onChange={(text) => { setAccountHeadMobile(text) }}
                    title="Phone Number"
                    placeholder="Enter Phone"
                />
                <TextInput
                    value={accounts_head_email}
                    required={true}
                    onChange={(text) => { setAccountHeadEmail(text.toUpperCase()) }}
                    title="Email"
                    placeholder="Enter Email"
                />
                <br />
                <Text style={styles.heading}>Bank Details</Text>
                <TextInput
                    value={bank_name}
                    required={true}
                    onChange={(text) => { setBankName(text.toUpperCase()) }}
                    title="Bank Name"
                    placeholder="Enter Bank Name"
                />
                <Text style={styles.title}>Account Type<Text type="danger">*</Text></Text>
                <Select
                    value={bank_account_type}
                    showSearch
                    style={styles.select}
                    placeholder="Select Account Type"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    <Option value="Current">Current</Option>
                    <Option value="Savings">Savings</Option>
                    <Option value="Cash Credit">Cash Credit</Option>
                    <Option value="Overdraft">Overdraft</Option>
                    <Option value="Others">Others</Option>
                </Select>
                <TextInput
                    value={bank_account_no}
                    required={true}
                    onChange={(text) => { setBankAccountNo(text) }}
                    title="Account Number"
                    placeholder="Enter Account Number"
                />
                <TextInput
                    value={bank_ifsc}
                    required={true}
                    onChange={(text) => { setBankIFSC(text.toUpperCase()) }}
                    title="IFSC"
                    placeholder="Enter 11 digit IFSC"
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

export default OthersDetails;