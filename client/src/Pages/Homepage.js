import React, { useState, memo } from 'react';
import TextInput from '../Components/TextInput';
import CustomButton from '../Components/Button';
import Prompt from '../Components/Prompt';
import Axios from 'axios';
import { message } from 'antd';
import ViewVerifyScreen from './ViewVerifyScreen';


function Homepage(props) {
    const [visible, setVisible] = useState(false);
    const [pan_no, setPanNo] = useState("");
    const [no_pan_listed, setNoPanListed] = useState(false);
    const [data, setData] = useState([]);
    const [statusChecked, setStatusChecked] = useState(false);
    const [phone_numbers, setPhoneNumbers] = useState([]);

    const styles = {
        view: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            minHeight: '100vh'
        },
        text: {
            textAlign: "left"
        },
        image: {
            height: 80,
            width: 150,
            marginBottom: 30
        }
    }

    const onError = () => {
        return message.error("Please check your internet connection");
    }

    const onSubmitHandler = () => {
        Axios.get(`/vendors/get-vendors-by-pan/${pan_no}`)
            .then(res => {
                if (res.data.length === 0) {
                    setVisible(true);
                    setNoPanListed(true);
                }
                else {
                    setVisible(true);
                    setData(res.data.vendors);
                }
            }).catch((err) => {
                onError();
            })
    }

    const handleClose = () => {
        setVisible(false);
    }

    const handleYes = () => {
        if (no_pan_listed)
            return props.history.push(`/request-pan-info/${pan_no}`);
        else {
            let check = true;
            let numbers = [];
            data.map(item => {
                if (!item.status) {
                    check = false;
                }
                numbers.push({ value: item.phone_number, data: item.phone_number.substring(0, 4) + "XXXXXX" + item.phone_number.substring(10, 13) });
            })
            if (check === true) {
                setPhoneNumbers(numbers);
                setStatusChecked(true);
            }
            else {
                return props.history.push(`/gst-listing/${pan_no}`);
            }
        }
    }

    const disabledHandler = () => {
        return pan_no.length === 10;
    }

    const handleNo = () => {
        setVisible(false);
    }

    return (
        <div style={styles.view}>
            <img src={require('../Assets/logo.jpg')} style={styles.image} alt="Dollar Industries Ltd." />
            <TextInput
                value={pan_no}
                onChange={(text) => { setPanNo(text.toUpperCase()) }}
                title="PAN Number"
                autoFocus={true}
                placeholder="Enter your 10 digit PAN number" />
            {statusChecked && <ViewVerifyScreen numbers={phone_numbers} {...props} pan_no={pan_no} />}
            <CustomButton
                title={"Submit"}
                disabled={!disabledHandler() || statusChecked}
                onClick={onSubmitHandler} />
            <Prompt
                title="Continue"
                modalTextMain="Are you sure you want to continue?"
                visible={visible}
                yesTitle="Please wait while we check.."
                handleClose={handleClose}
                handleYes={handleYes}
                handleNo={handleNo}
            />
        </div>
    )
}

export default memo(Homepage);