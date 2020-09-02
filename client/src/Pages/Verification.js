import React, { useState } from 'react';
import { Input, Typography } from 'antd';
import CustomButton from '../Components/Button';
import Axios from 'axios';

const { Text } = Typography;

function EmailVerification(props) {
    const [email, setEmail] = useState("");
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

    const verifyEmail = () => {
        Axios.post(`/vendors/send-email/${props.match.params.id}`, {
            email: email
        })
    }

    const disabledEmailHandler = () => {
        return email;
    }

    return (
        <div style={styles.view}>
            <img src={require('../Assets/logo.jpg')} style={styles.image} alt="Dollar Industries Ltd." />
            <Text style={styles.title}>Email Id</Text>
            <Input
                style={styles.input}
                placeholder="Enter Valid Email Id"
                onChange={event => setEmail(event.target.value)} />
            <CustomButton disabled={!disabledEmailHandler()} title="Verify Email" onClick={verifyEmail} />
        </div>
    )
}

export default EmailVerification;