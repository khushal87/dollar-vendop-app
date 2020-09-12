import React, { useState, memo, useEffect, lazy, Suspense } from 'react';

import {
    Typography,
    message,
    Spin,
    PageHeader
} from 'antd';
import Axios from 'axios';
import Prompt from '../Components/Prompt';

const TextInput = lazy(() => import('../Components/TextInput'));
const CustomButton = lazy(() => import('../Components/Button'));

const { Text } = Typography;


const RequestPanInfo = (props) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [pan_no, setPanNo] = useState("");
    const [visible, setVisible] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [noPanId, setNoPanId] = useState("");
    const [exists, setExists] = useState(false);
    const [loader, setLoader] = useState(false);
    const [mainLoading, setMainLoading] = useState(false);

    const onError = () => {
        message.error({
            content: 'Your PAN is already registed with us. Please reconfirm KYC.',
            className: 'custom-class',
            style: {
                marginTop: '40vh',
            }
        });
    };

    useEffect(() => {
        setMainLoading(true);
        Axios.get(`/nopandata/check-new-pan-or-not/${props.match.params.id}`)
            .then((result) => {
                setExists(result.data.data);
                setMainLoading(false);
            }).catch(err => {
                setMainLoading(false);
            })
    }, [])

    const onSubmitHandler = () => {
        setLoader(true);
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
                                setLoader(false);
                            }
                        }).catch((err) => {
                            setLoader(false);
                        });
                }
                else {
                    onError();
                    setLoader(false);
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
            minHeight: '90vh'
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
        <>
            <PageHeader
                className="site-page-header"
                onBack={() => { props.history.goBack() }}
                title="Unregistered Vendor"
            />
            {mainLoading ? <div style={{ marginTop: 20, textAlign: "center" }}>
                <Spin size={20} />
            </div> :
                <div style={styles.view}>
                    {!exists ?
                        <>
                            <Text style={styles.disclaimer}>
                                Your PAN is not found registered with Dollar Industries Ltd., please send an email at<br />
                                <a href="mailto:dollarphoneverify@gmail.com">
                                    dollarphoneverify@gmail.com
                </a><br />
                with your id after submitting the details required below.
            </Text>

                            <Text style={styles.head}>
                                Fill the details below.
                    </Text>
                            <Suspense>
                                <TextInput
                                    title="Organization Name*"
                                    value={name}
                                    onChange={(text) => { setName(text) }}
                                    autoFocus={true}
                                    placeholder="Enter your Name" />
                            </Suspense>
                            <Suspense>
                                <TextInput
                                    title="PAN Number*"
                                    value={pan_no}
                                    onChange={(text) => { setPanNo(text.toUpperCase()) }}
                                    placeholder="Enter 10 digit PAN Number" />
                            </Suspense>
                            <Suspense>
                                <TextInput
                                    title="Mobile*"
                                    value={phone}
                                    onChange={(text) => { setPhone(text) }}
                                    placeholder="Enter 10 digit Mobile Number" />
                            </Suspense>
                            <Suspense>
                                <TextInput
                                    title="Email*"
                                    value={email}
                                    onChange={(text) => { setEmail(text) }}
                                    placeholder="Enter your Email" />
                            </Suspense>
                            <Suspense>
                                <CustomButton
                                    disabled={!disabledHandler()}
                                    title={"Submit"}
                                    onClick={onSubmitHandler} />
                            </Suspense>
                            {loader &&
                                <div style={{ textAlign: "center" }}>
                                    <Spin size="large" />
                                </div>}
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
                        </> : <Text style={{ textAlign: "center", marginLeft: 20, marginRight: 20 }}>
                            Thank You! Your form is already submitted. If you have provided correct email address and phone number you will be contacted soon.
                            </Text>}
                </div>}
        </>
    );
};

export default memo(RequestPanInfo);