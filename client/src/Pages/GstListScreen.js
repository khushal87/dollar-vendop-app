import React, { useEffect, useState, memo, Suspense, lazy } from 'react';
import { PageHeader, Typography, Select, Table, Spin, message } from 'antd';
import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons'
import Axios from 'axios';
import { useVendorContext } from '../Context/vendorContext';

const CustomButton = lazy(() => import('../Components/Button'));
const { Text } = Typography;
const { Option } = Select;

function GstListScreen(props) {
    const [data, setData] = useState([]);
    const [unique, setUnique] = useState([]);
    const [filter_data, setFilterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setVendorData, latitude, longitude } = useVendorContext();

    const onError = () => {
        return message.error("Please check your internet connection");
    }

    useEffect(() => {
        setLoading(true);
        if (latitude && longitude) {
            Axios.get(`/vendors/get-vendors-by-pan/${props.match.params.id}`)
                .then((result) => {
                    setData(result.data.vendors);
                    setUnique(result.data.unique);
                    setLoading(false);
                })
                .catch((err) => {
                    onError();
                    console.log(err);
                })
        }
        else {
            props.history.push('/');
        }
    }, [props.match.params.id]);

    function onChange(value) {
        const filteredData = data.filter(item => {
            return item.gst_no === value;
        });
        setFilterData(filteredData);
    }

    function onBlur() {
        console.log('blur');
    }

    function onFocus() {
        console.log('focus');
    }

    function onSearch(val) {
        console.log('search:', val);
    }

    const styles = {
        view: {
            textAlign: "center",
        },
        heading: {
            color: "#1890ff"
        }
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
                filter_data.length >= 1 ? (
                    !record.status ?
                        <Suspense>
                            <CustomButton {...props}
                                title="Edit" onClick={() => {
                                    setVendorData(record);
                                    return props.history.push(`/organization-detail-form/${record._id}`)
                                }} />
                        </Suspense> :
                        <Suspense>
                            <CustomButton {...props}
                                title="View" onClick={() => {
                                    setVendorData(record);
                                    return props.history.push(`/summary-form/${record._id}`)
                                }} />
                        </Suspense>
                ) : null,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: status => (
                <div style={{ marginLeft: "10px" }}>
                    {status === true ?
                        <CheckCircleTwoTone twoToneColor="#52c41a" /> :
                        <ExclamationCircleTwoTone twoToneColor="#eb2f96" />
                    }
                </div>
            ),
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
    ]

    let content;
    if (loading) {
        content = <div style={{ textAlign: "center", marginTop: 20 }}>
            <Spin size="large" />
        </div>
    }
    else {
        content = <>{filter_data.length !== 0 ?
            <><Text type="warning">{filter_data.length} {filter_data.length > 1 ? "entries" : "entry"} found.</Text><br /></>
            : null}
            <Table columns={columns} dataSource={filter_data} scroll={{ x: 500 }} size="small" />
        </>
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                onBack={() => { props.history.goBack() }}
                title="Re-confirm KYC "
            />
            <div style={styles.view}>
                <Text style={styles.heading}>From the PAN {props.match.params.id} you are listed here.</Text><br />
                <Select
                    showSearch
                    style={{ width: "80%", marginTop: 15, marginBottom: 15 }}
                    placeholder="Select your GSTN"
                    optionFilterProp="children"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {unique.map(item => {
                        return <Option value={item.gst_no}>{item.gst_no}</Option>;
                    })}
                </Select>
                <br />
                {content}
                {/* <List
                    itemLayout="horizontal"
                    dataSource={filter_data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={`GST number- ${item.gst_no}`}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                /> */}
            </div>
        </>
    )
}

export default memo(GstListScreen);