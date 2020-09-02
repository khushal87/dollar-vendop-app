import React, { Component } from 'react';
import firebase from 'firebase';
import Axios from 'axios';
import { Input, Typography, PageHeader, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import CustomButton from '../Components/Button';

const { Text } = Typography;

const styles = {
    view: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        minHeight: '70vh'
    },
    image: {
        height: 80,
        width: 150,
        marginBottom: 30
    },
    title: {
        fontWeight: "bold",
        marginBottom: 2
    },
    input: {
        width: "70%",
        borderRadius: 3,
        height: 40,
        marginBottom: 20
    },
}


class PhoneVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneEntered: false,
            phone: "",
            otp: "",
            email: "",
            name: "",
            confirmResult: null,
            user: null,
            uid: null,
            loading: false,
            error: false,
            message: "",
            isLoggedIn: false
        }
        this.recaptcha = React.createRef();
    }

    componentDidMount() {
        console.log(this.props.location.state)
        const { email, phone, contact_person_name } = this.props.location.state;
        this.setState({ email: email, phone: phone.substr(3), name: contact_person_name })
        firebase.auth().useDeviceLanguage();
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.recaptcha, {
            'size': 'invisible',
            'callback': function (response) {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // ...
            },
            'expired-callback': function () {
                // Response expired. Ask user to solve reCAPTCHA again.
                // ...
            }
        });
        window.recaptchaVerifier.render().then(function (widgetId) {
            window.recaptchaWidgetId = widgetId;
        });
    }

    sendOtpHandler = (e) => {
        e.preventDefault();
        const { phone } = this.state;
        let appVerifier = window.recaptchaVerifier;
        this.setState({ loading: true });
        const phoneNumber = phone.includes("+91") ? phone : "+91" + phone;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((result) => {
                console.log(result);
                this.setState({
                    confirmResult: result,
                    phoneEntered: true,
                    message: "OTP is sent on your mobile number."
                });
                this.setState({ loading: false });
            })
            .catch(error => {
                console.log(error);
                this.setState({ loading: false, message: "Something went wrong" });
            });
    }

    verifyResult = () => {
        const { otp, confirmResult, phone, email, name } = this.state;
        confirmResult.confirm(otp).then((result) => {
            this.setState({ user: result.user, uid: result.user.uid, loading: true, error: false });
            Axios.put(`/vendors/confirm-phone/${this.props.match.params.id}`, {
                phone: phone.includes("+91") ? phone : "+91" + phone,
                email: email,
                contact_person_name: name
            })
                .then(async (res) => {
                    this.setState({ loading: false, isLoggedIn: true });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ loading: false });
                })
        }).catch(err => {
            this.setState({ loading: false, error: true, message: "Invalid OTP!" });
        })
    }

    disabledPhoneHandler = () => {
        return this.state.phone.length === 10 && this.state.email && this.state.name;
    }

    disabledOtpHandler = () => {
        return this.state.otp;
    }

    render() {
        const { phone, email, name, phoneEntered, loading, error, message, isLoggedIn } = this.state;

        if (isLoggedIn) {
            this.props.history.push(`/account-detail-form/${this.props.match.params.id}`);
        }

        return (
            <>
                <PageHeader
                    className="site-page-header"
                    onBack={() => { this.props.history.goBack() }}
                    title="Contact Verification"
                />
                <div style={styles.view}>
                    <img src={require('../Assets/logo.jpg')} style={styles.image} alt="Dollar Industries Ltd." />
                    <div style={{ display: "flex", justifyContent: "center" }} ref={(ref) => this.recaptcha = ref}></div>
                    <Text style={styles.title}>Name</Text>
                    <Input
                        style={styles.input}
                        suffix={name === "" ? "" : "Edit"}
                        value={name}
                        onChange={event => this.setState({ name: event.target.value.toUpperCase() })}
                        placeholder="Enter Name"
                    />
                    <Text style={styles.title}>Phone Number</Text>
                    <Input
                        style={styles.input}
                        prefix={phone.includes("+91") ? null : "+91"}
                        suffix={phone === "" ? "" : "Edit"}
                        value={phone}
                        placeholder="Enter 10 digit phone number"
                        onChange={event => this.setState({ phone: event.target.value })} />

                    <Text style={styles.title}>Email Id</Text>
                    <Input
                        style={styles.input}
                        suffix={email === "" ? "" : "Edit"}
                        value={email}
                        onChange={event => this.setState({ email: event.target.value })}
                        placeholder="Enter valid Email Id"
                    />

                    {phoneEntered &&
                        <>
                            <Text style={styles.title}>OTP</Text>
                            <Input.Password
                                style={styles.input}
                                onChange={event => this.setState({ otp: event.target.value })}
                                placeholder="Enter 6 digit OTP"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </>
                    }

                    {loading ?
                        <div style={{ textAlign: "center" }}>
                            <Spin size="large" />
                        </div> : phoneEntered ?
                            <CustomButton disabled={!this.disabledOtpHandler()} title="Verify OTP" onClick={this.verifyResult} /> :
                            <CustomButton disabled={!this.disabledPhoneHandler()} title="Request OTP" onClick={this.sendOtpHandler} />
                    }
                    {error && <h5 style={{ color: "#d9534f", textAlign: "center" }}>{message}</h5>}
                </div>
            </>
        )
    }
}


export default PhoneVerification;