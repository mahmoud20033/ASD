import React from 'react'
import Form from 'react-bootstrap/Form';
import './Login.css'
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Forgot from './Forgot';
import Create from './Create';

const Login = () => {
  function main(e) {
    e.preventDefault();
    const email = document.getElementById('formBasicEmail').value;
    const password = document.getElementById('formBasicPassword').value;
    if (email === 'admin@gmail.com' && password === 'admin') {
      alert('You are logged in');
    } else {
      alert('Invalid email or password');
    }

  }

  return (
    < >
      
      <div className='Image' >
        <div className='min-w-s w-3/6 Login_css'>
          <h1 className='P_login'>تسجيل دخول</h1>
          <Form className='Form_login1' onSubmit={main}>

            <Form.Group className="mb-6 Form_input" controlId="formBasicEmail">
              <Form.Control type="email" id='formBasicEmail' placeholder="اسم المستخدم" />
            </Form.Group>
            <Form.Group className="mb-6 Form_input" controlId="formBasicPassword">
              <Form.Control type="password" id='formBasicPassword' placeholder="كلمه المرور" />
            </Form.Group>
            <Row >
              <Col lg={9} md={12} sm={12} >
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check className='Check' type="checkbox" label="تذكرني" />
                </Form.Group>
              </Col>
              <Col lg={3} md={12} sm={12} >
                <Link to='/Forgot' className='Link_login'> هل نسيت كلمه السر؟</Link>
              </Col >
            </Row>
            <button className='max-w-96 w-11/12 py-3 Btn_login' type="submit">
              تسجيل
            </button>
            <div className='Register'>
              <span className='span_react'>ليس لديك حساب؟ <Link to="/Create">تسجيل</Link></span>
            </div>
          </Form>
        </div>
      </div >
    </>
  )
}

export default Login