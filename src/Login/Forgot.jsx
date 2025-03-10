import React from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Forgot = () => {
    return (
        <div>
            <div className='Forget_bg'>
                <div className="min-w-96 w-3/6 forget_2">
                    <h1 className='P_forget'>هل نسيت كلمه السر؟</h1>
                    <Form className='Forget'>
                        <label htmlFor="input" className='label_forget'> الايميل</label>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control className="mb-6" type="email" id='formBasicEmail' placeholder="ادخل الايميل" />
                        </Form.Group>
                        <Row>
                            <Col lg={8} md={12} sm={12}>
                                <button className='Forget_btn'>تسجيل</button>
                            </Col>
                            <Col lg={4} md={6} sm={12}>
                                <Link to='/' className='a_forget'>الرجوع</Link>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default Forgot