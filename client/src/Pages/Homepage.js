import React, { useState } from 'react';
import TextInput from '../Components/TextInput';
import CustomButton from '../Components/Button';
import Prompt from '../Components/Prompt';
import Axios from 'axios';


function Homepage(props) {
    const [visible, setVisible] = useState(false);
    const [pan_no, setPanNo] = useState("");
    const [no_pan_listed, setNoPanListed] = useState(false);
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

    const onSubmitHandler = () => {
        Axios.get(`/vendors/get-vendors-by-pan/${pan_no}`)
            .then(res => {
                if (res.data.length === 0) {
                    setVisible(true);
                    setNoPanListed(true);
                }
                else {
                    setVisible(true);
                }
            })
    }

    const handleClose = () => {
        setVisible(false);
    }

    const handleYes = () => {
        if (no_pan_listed)
            return props.history.push('/request-pan-info');
        else
            return props.history.push(`/gst-listing/${pan_no}`);
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
            <CustomButton
                title={"Submit"}
                disabled={!disabledHandler()}
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

export default Homepage;