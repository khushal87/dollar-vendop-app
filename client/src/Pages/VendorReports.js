import React, { useEffect, useState, Suspense, lazy } from 'react';
import { PageHeader, DatePicker, Typography, Spin, Table } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { apiUrl } from '../config';

const CustomButton = lazy(() => import('../Components/Button'));


const { RangePicker } = DatePicker;
const { Text } = Typography;

function VendorReport(props) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmmited] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setLoading(true);
        Axios.get(`/vendors/get-vendors-status-true`).then((result) => {
            setSubmmited(result.data);
            setFilterData(result.data);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    if (loading) {
        return <div style={styles.view}>
            <Spin />
        </div>
    }

    const onDateChange = (date) => {
        const start_date = moment(date[0]).format("YYYY-MM-DD");
        const end_date = moment(date[1]).format("YYYY-MM-DD");
        const data = submitted.filter(item => moment(item.updatedAt).format("YYYY-MM-DD") >= start_date && moment(item.updatedAt).format("YYYY-MM-DD") <= end_date);
        setFilterData(data);
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => {
                return <Text style={{ whiteSpace: "nowrap" }}>{text}</Text>
            }
        },
        {
            title: "Re-KYC",
            dataIndex: "re-kyc",
            render: (text, record) =>
                filterData.length >= 1 ? (
                    <Suspense>
                        <CustomButton {...props}
                            title="View" onClick={() => {
                                return props.history.push(`/summary-form/${record._id}`)
                            }} />
                    </Suspense>
                ) : null,
        },
        {
            title: "Comp Code",
            dataIndex: "company_code",
            key: "company code",
        },
        {
            title: "Vendor code",
            dataIndex: "vendor_code",
            key: "vendor code"
        },
        {
            title: "PAN Attachment",
            dataIndex: "pan_attachment",
            render: (text, record) =>
                filterData.length >= 1 ? (
                    <Suspense>
                        <a href={`${apiUrl}/${record.pan_attachment}`} download={record.pan_no}>
                            <CustomButton {...props}
                                title="Download" />
                        </a>
                    </Suspense>
                ) : null,
        },
        {
            title: "GST Attachment",
            dataIndex: "gst_attachment",
            render: (text, record) =>
                filterData.length >= 1 ? (
                    <Suspense>
                        <a href={`${apiUrl}/${record.gst_attachment}`} download={record.gst_no}>
                            <CustomButton {...props}
                                title="Download" />
                        </a>
                    </Suspense>
                ) : null,
        },
        {
            title: "MSME Attachment",
            dataIndex: "msme_attachment",
            render: (text, record) =>
                filterData.length >= 1 ? (
                    record.is_msme === "Y" ?
                        <Suspense>
                            <a href={`${apiUrl}/${record.msme_attachment}`} download={record.msme_reg_no}>
                                <CustomButton {...props}
                                    title="Download" />
                            </a>
                        </Suspense> : null
                ) : null,
        },
        {
            title: "Bank Attachment",
            dataIndex: "bank_cancelled_cheque",
            render: (text, record) =>
                filterData.length >= 1 ? (
                    <Suspense>
                        <a href={`${apiUrl}/${record.bank_cancelled_cheque}`} download={record.bank_cancelled_cheque}>
                            <CustomButton {...props}
                                title="Download" />
                        </a>
                    </Suspense>
                ) : null,
        }
    ];

    let content;
    content = <>
        <Table columns={columns} dataSource={filterData} scroll={{ x: 500 }} size="small" />
    </>


    return (
        <>
            <PageHeader
                className="site-page-header"
                // onBack={() => { props.history.goBack() }}
                title="Vendor Report"
            />
            <div style={styles.view}>
                <RangePicker onChange={onDateChange} suffixIcon={() => { }} />
                <br />
                <div style={styles.headData}>
                    <div style={styles.headDataComp}>
                        <Text>Total Vendors</Text><br />
                        <Text type="warning" style={{ fontSize: 30, fontWeight: "bold" }}>{3754}</Text>
                    </div>
                    <div style={styles.headDataComp}>
                        <Text>Vendors KYC Completed</Text><br />
                        <Text style={{ color: "greenyellow", fontSize: 30, fontWeight: "bold" }}>{filterData.length}</Text>
                    </div>
                    <div style={styles.headDataComp}>
                        <Text>Vendors KYC Pending </Text><br />
                        <Text type="danger" style={{ fontSize: 30, fontWeight: "bold" }}> {3754 - filterData.length}</Text>
                    </div>
                </div>
                <a href="https://api.dollarvendorapp.com/vendors/get-vendors-status-true">
                    <CustomButton title="Get Vendors data" />
                </a>
                <CustomButton title={!visible ? "Show Vendors Data" : "Hide Vendors Data"} onClick={() => {
                    setVisible(!visible);
                }} />
                {visible ? content : null}
            </div>
        </>
    )
}

const styles = {
    view: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        minHeight: '70vh'
    },
    headDataComp: {
        textAlign: "center",
    }
}


export default VendorReport;