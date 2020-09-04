import React, { useState, useEffect, memo } from 'react';
import { PageHeader, Typography, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CustomButton from '../Components/Button';
import Axios from 'axios';
import { useVendorContext } from '../Context/vendorContext';

const { Text } = Typography;

function AttachmentPage(props) {
    const [pan_attachment, setPanAttachment] = useState(null);
    const [gst_attachment, setGSTAttachment] = useState(null);
    const [msme_attachment, setMSMEAttachement] = useState(null);
    const [bank_cancelled_cheque, setBankCancelledCheque] = useState(null);
    const [vendor_code, setVendorCode] = useState("");
    const [company_code, setCompanyCode] = useState("");
    const [pan_no, setPanNo] = useState("");
    const [gst_no, setGSTNo] = useState("");
    const [msme_reg_no, setMSMERegNo] = useState("");
    const [is_msme, setIsMSME] = useState("N");
    const [loading, setLoading] = useState(false);

    const { vendorData, setVendorData } = useVendorContext();

    useEffect(() => {
        const data = localStorage.getItem("is_msme");
        setIsMSME(data ? data : "N");
        if (vendorData) {
            const {
                vendor_code,
                company_code,
                pan_no,
                gst_no,
                msme_reg_no
            } = vendorData;
            setVendorCode(vendor_code);
            setCompanyCode(company_code);
            setPanNo(pan_no);
            setGSTNo(gst_no);
            setMSMERegNo(msme_reg_no);
        }
        else {
            Axios.get(`/vendors/get-vendor/${props.match.params.id}`)
                .then((result) => {
                    const vendorData = result.data.vendor;
                    const {
                        vendor_code,
                        company_code,
                        pan_no,
                        gst_no,
                        msme_reg_no
                    } = vendorData;
                    setVendorCode(vendor_code);
                    setCompanyCode(company_code);
                    setPanNo(pan_no);
                    setGSTNo(gst_no);
                    setMSMERegNo(msme_reg_no);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [vendorData]);


    const fileChangedHandlerPAN = (event) => {
        const file = event.target.files[0];
        setPanAttachment(file);
    }
    const fileChangedHandlerGST = (event) => {
        const file = event.target.files[0];
        setGSTAttachment(file);
    }
    const fileChangedHandlerMSME = (event) => {
        const file = event.target.files[0];
        setMSMEAttachement(file);
    }
    const fileChangedHandlerBank = (event) => {
        const file = event.target.files[0];
        setBankCancelledCheque(file);
    }

    const onSuccess = () => {
        message.success("Attachments uploaded successfully");
    }

    const onError = () => {
        message.error("Something went wrong");
    }

    const onSubmitHandler = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('pan_attachment', pan_attachment);
        formData.append('gst_attachment', gst_attachment);
        formData.append('msme_attachment', msme_attachment);
        formData.append('bank_cancelled_cheque', bank_cancelled_cheque);
        formData.append("company_code", company_code);
        formData.append('vendor_code', vendor_code);
        formData.append('pan_no', pan_no);
        formData.append('gst_no', gst_no);
        formData.append('msme_reg_no', msme_reg_no);

        Axios.put(`/vendors/update-vendor-attachments/${props.match.params.id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((result) => {
                setVendorData(result.data.vendor);
                Axios.post(`/vendors/copy-vendors-by-gst-pan-id/${props.match.params.id}`, {
                    gst_no: gst_no,
                    pan_no: pan_no
                }).then((res) => {
                    onSuccess();
                    setLoading(false);
                    props.history.push(`/summary-form/${props.match.params.id}`)
                })
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                onError();
            })
    }

    const disabledHandler = () => {
        if (is_msme === "Y")
            return pan_attachment && gst_attachment && msme_attachment && bank_cancelled_cheque;
        else
            return pan_attachment && gst_attachment && bank_cancelled_cheque;
    }

    const styles = {
        view: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // color: 'white',
            minHeight: '70vh'
        },
        title: {
            fontWeight: "bold",
            marginBottom: 4
        },
        select: {
            width: "80%"
        },
        label: {
            borderRadius: 20,
            marginTop: 10,
            border: "1px solid #40A9FF",
            color: "#40A9FF",
            fontWeight: "bold",
            marginBottom: 5,
            padding: "5px 15px 5px 15px"
        }
    }
    return (
        <>
            <PageHeader
                className="site-page-header"
                onBack={() => { props.history.goBack() }}
                title="Documents Required"
            />
            <div style={styles.view}>
                <Text type="warning">Supported File formats(JPG, PNG, PDF)</Text>
                <br />

                <Text style={styles.title}>PAN Attachment<Text type="danger">*</Text></Text>
                <label for="pan" style={styles.label}>
                    <UploadOutlined /> Click to Upload
                </label>
                <Text>{pan_attachment && pan_attachment.name}</Text>
                <input hidden={true} id="pan" title="Attach" type="file" onChange={fileChangedHandlerPAN} />

                <Text style={styles.title}>GST Attachment<Text type="danger">*</Text></Text>
                <label for="gst" style={styles.label}>
                    <UploadOutlined /> Click to Upload
                </label>
                <Text>{gst_attachment && gst_attachment.name}</Text>
                <input hidden={true} id="gst" title="Attach" type="file" onChange={fileChangedHandlerGST} />

                {is_msme === "Y" ?
                    <>
                        <Text style={styles.title}>MSME Attachment<Text type="danger">*</Text></Text>
                        <label for="msme" style={styles.label}>
                            <UploadOutlined /> Click to Upload
                        </label>
                    </> : null}
                <input hidden={true} id="msme" title="Attach" type="file" onChange={fileChangedHandlerMSME} />
                <Text>{msme_attachment && msme_attachment.name}</Text>


                <Text style={styles.title}>Bank Cancelled cheque<Text type="danger">*</Text></Text>
                <label for="bank" style={styles.label}>
                    <UploadOutlined /> Click to Upload
                </label>
                <input hidden={true} id="bank" title="Attach" type="file" onChange={fileChangedHandlerBank} />
                <Text>{bank_cancelled_cheque && bank_cancelled_cheque.name}</Text>

                <CustomButton
                    title={"Submit"}
                    disabled={!disabledHandler()}
                    onClick={onSubmitHandler}
                />
                {loading && <div style={{ textAlign: "center", marginTop: 15 }}>
                    <Spin size="large" />
                </div>}
            </div>
        </>
    )
}

export default memo(AttachmentPage);