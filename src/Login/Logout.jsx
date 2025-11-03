import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
        navigate('/');
    };
    const handleCancel = () => { navigate(-1); };
    return (
        <div className="logout-modal">
            <Modal show={true} centered onHide={handleCancel}>
                <Modal.Header >
                    <Modal.Title className='text-center w-full'>تأكيد تسجيل الخروج</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-base font-bold'>
                    هل أنت متأكد أنك تريد تسجيل الخروج؟
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        إلغاء
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        تسجيل الخروج
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
export default Logout;