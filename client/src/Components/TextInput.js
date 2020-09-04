import React, { memo } from 'react';
import { Input, Typography } from 'antd';

const { Text } = Typography;

function TextInput(props) {
    const { placeholder, autoFocus, title, value, onChange, required, suffix } = props;
    const style = {
        input: {
            width: "70%",
            borderRadius: 3
        },
        title: {
            fontWeight: "bold",
            marginBottom: 2
        }
    }
    return (
        <>
            <Text style={style.title}>{title}{required ? <Text type="danger">*</Text> : null}</Text>
            <Input
                value={value}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                size="large"
                suffix={suffix}
                placeholder={placeholder}
                autoFocus={autoFocus}
                style={style.input}
                bordered={true}
                splaceholder={placeholder} />
        </>
    )
}

export default memo(TextInput);