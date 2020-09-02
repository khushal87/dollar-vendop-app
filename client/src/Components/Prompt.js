import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

function Prompt(props) {
    const { title, yesTitle, handleClose, visible, handleYes, handleNo, modalTextMain } = props;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState("");

    useEffect(() => {
        setModalText(modalTextMain)
    }, [modalTextMain])

    const handlerYes = () => {
        setConfirmLoading(true);
        setModalText(yesTitle);
        handleYes();
        setTimeout(() => {
            setConfirmLoading(false);
            handleClose();
        }, 2000);
    };

    const handlerNo = () => {
        handleNo();
        handleClose();
    };

    return (
        <>
            <Modal
                title={title}
                visible={visible}
                onOk={handlerYes}
                confirmLoading={confirmLoading}
                onCancel={handlerNo}
            >
                <p>{modalTextMain}</p>
            </Modal>
        </>
    );
}

export default Prompt;