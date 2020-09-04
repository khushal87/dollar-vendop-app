import React, { useState, memo } from 'react';

import {
    Typography,
    message
} from 'antd';
import TextInput from '../Components/TextInput';
import CustomButton from '../Components/Button';
import Axios from 'axios';
import Prompt from '../Components/Prompt';


const { Text } = Typography;


const RequestPanInfo = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [pan_no, setPanNo] = useState("");
    const [visible, setVisible] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [noPanId, setNoPanId] = useState("");


    const onError = () => {
        message.error({
            content: 'Your PAN is already registed with us. Please reconfirm KYC.',
            className: 'custom-class',
            style: {
                marginTop: '40vh',
            }
        });
    };

    const onSubmitHandler = () => {
        const params = {
            name, email, phone, pan_no
        }
        Axios.get(`/vendors/get-vendors-by-pan/${pan_no}`)
            .then((res) => {
                if (res.data.length === 0) {
                    Axios.post(`/nopandata/create-vendors-with-no-pan`, params)
                        .then((result) => {
                            if (result.status === 200) {
                                setVisible(true);
                                setNoPanId(result.data.data._id);
                                setMessageText("Our representative will contact you soon. Please note the Id mentioned above");
                            }
                        });
                }
                else {
                    onError();
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const handleClose = () => {
        setVisible(false);
    }

    const handleYes = () => {
        return props.history.push('/');
    }

    const disabledHandler = () => {
        return pan_no && name.length && email && phone.length;
    }

    const handleNo = () => {
        setVisible(false);
    }

    const styles = {
        view: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            minHeight: '100vh'
        },
        disclaimer: {
            textAlign: "center",
            marginBottom: 20,
            width: "80%"
        },
        head: {
            fontSize: 15,
            // fontWeight: "bold",
            marginBottom: 10,
            color: "#1890ff"
        }
    }

    return (
        <div style={styles.view}>
            <Text style={styles.disclaimer}>
                Your PAN is not found registered with Dollar Industries Ltd., please send an email at<br />
                <a href="mailto:test@exmaple.com">test@example.com</a><br />
                with your id after submitting the details required below.
            </Text>
            <Text style={styles.head}>
                Fill the details below.
            </Text>
            <TextInput
                title="Organization Name*"
                value={name}
                onChange={(text) => { setName(text) }}
                autoFocus={true}
                placeholder="Enter your Name" />
            <TextInput
                title="PAN Number*"
                value={pan_no}
                onChange={(text) => { setPanNo(text.toUpperCase()) }}
                placeholder="Enter 10 digit PAN Number" />
            <TextInput
                title="Mobile*"
                value={phone}
                onChange={(text) => { setPhone(text) }}
                placeholder="Enter 10 digit Mobile Number" />
            <TextInput
                title="Email*"
                value={email}
                onChange={(text) => { setEmail(text) }}
                placeholder="Enter your Email" />
            <CustomButton
                disabled={!disabledHandler()}
                title={"Submit"}
                onClick={onSubmitHandler} />
            {/* <Text type="danger">*We will contact you in 2 weeks</Text> */}
            <Prompt
                title={`Id - ${noPanId}`}
                modalTextMain={messageText}
                visible={visible}
                yesTitle="Please wait while we check.."
                handleClose={handleClose}
                handleYes={handleYes}
                handleNo={handleNo}
            />
        </div>
    );
};

export default memo(RequestPanInfo);