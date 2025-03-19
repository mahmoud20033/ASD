// Import necessary dependencies from React and React-Bootstrap
import React from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Forgot component for password recovery functionality
const Forgot = () => {
    return (
        // Main container
        <div>
            {/* Background wrapper with custom styling */}
            <div className='Forget_bg'>
                {/* Content container with minimum width and responsive width */}
                <div className="min-w-96 w-3/6 forget_2">
                    {/* Arabic title for forgot password page */}
                    <h1 className='P_forget'>هل نسيت كلمه السر؟</h1>
                    {/* Form component with custom styling */}
                    <Form className='Forget'>
                        {/* Email input label in Arabic */}
                        <label htmlFor="input" className='label_forget'> الايميل</label>
                        {/* Form group for email input */}
                        <Form.Group controlId="formBasicEmail">
                            {/* Email input field with placeholder */}
                            <Form.Control className="mb-6" type="email" id='formBasicEmail' placeholder="ادخل الايميل" />
                        </Form.Group>
                        {/* Responsive row for buttons */}
                        <Row>
                            {/* Column for submit button */}
                            <Col lg={8} md={12} sm={12}>
                                {/* Submit button with Arabic text */}
                                <button className='Forget_btn'>تسجيل</button>
                            </Col>
                            {/* Column for back link */}
                            <Col lg={4} md={6} sm={12}>
                                {/* Back link to home page */}
                                <Link to='/' className='a_forget'>الرجوع</Link>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    )
}

// Export the Forgot component for use in other parts of the application
export default Forgot