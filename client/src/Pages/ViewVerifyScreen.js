import React, { Component, memo } from 'react';
import firebase from 'firebase';
import Axios from 'axios';
import { Input, Typography, PageHeader, Spin, Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import CustomButton from '../Components/Button';

const { Text } = Typography;
const { Option } = Select;

const styles = {
    view: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        marginTop: 20
    },
    title: {
        fontWeight: "bold",
        marginBottom: 2
    },
    input: {
        borderRadius: 3,
        height: 40,
        marginBottom: 20
    },
}


class ViewVerifyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneEntered: false,
            phone: "",
            otp: "",
            confirmResult: null,
            user: null,
            uid: null,
            loading: false,
            error: false,
            message: "",
            isLoggedIn: false,
            numbers: []
        }
        this.recaptcha = React.createRef();
    }

    componentDidMount() {
        // const {  phone } = this.props.location.state;
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

    componentDidUpdate(prevProps) {
        if (prevProps.numbers !== this.props.numbers) {
            this.setState({ numbers: this.props.numbers });
        }
    }

    onChange = (value) => {
        this.setState({ phone: value });
    }

    onSearch = (val) => {
        console.log('search:', val);
    }

    sendOtpHandler = (e) => {
        e.preventDefault();
        const { phone } = this.state;
        let appVerifier = window.recaptchaVerifier;
        this.setState({ loading: true });
        const phoneNumber = phone;
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
        const { otp, confirmResult, phone } = this.state;
        confirmResult.confirm(otp).then((result) => {
            this.setState({ user: result.user, uid: result.user.uid, loading: true, error: false });
            this.props.history.push(`/gst-listing/${this.props.pan_no}`);
        }).catch(err => {
            console.log(err)
            // this.setState({ loading: false, error: true, message: "Invalid OTP!" });
        })
    }

    disabledPhoneHandler = () => {
        return this.state.phone;
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
                <div style={styles.view}>
                    <div ref={(ref) => this.recaptcha = ref}></div>

                    <Text style={styles.title}>Phone Number</Text>
                    <Select
                        showSearch
                        style={{ width: "100%", marginTop: 15, marginBottom: 15 }}
                        placeholder="Select your GSTN"
                        optionFilterProp="children"
                        onChange={this.onChange}
                        onSearch={this.onSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {this.props.numbers.length > 0 && this.props.numbers.map(item => {
                            return <Option value={item.value}>{item.data}</Option>;
                        })}
                    </Select>
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


export default memo(ViewVerifyScreen);