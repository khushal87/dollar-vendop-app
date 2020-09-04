import React, { memo } from 'react';
import { Button } from 'antd';

function CustomButton(props) {
    const { title, onClick, disabled, width, print } = props;
    const style = {
        borderRadius: 20,
        marginTop: 10,
        // backgroundColor: "#212121",
        color: "white",
        fontWeight: "bold",
        width: width ? width : "",
        marginBottom: 20,
        display: print ? "none" : ""
    }
    return (
        <Button
            className="commen-btn"
            type="primary"
            style={style}
            disabled={disabled}
            onClick={onClick}>{title}</Button>
    )
}

export default memo(CustomButton);