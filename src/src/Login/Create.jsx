import React from 'react'
import Form from 'react-bootstrap/Form';

const Create = () => {
  return (
    <div>
      <div className='bg_login'>
        <div className='min-w-96 w-3/6 login_container'>
          <h1 className='min-w-96 w-6/6 h1_create'> انشاء حساب</h1>
          <Form >
            <Form.Group className="mb-4 group_create" controlId="formBasictext1">
              <Form.Control className='user_create' type="text" placeholder="اسم المستخدم" />
            </Form.Group>
            <Form.Group className="mb-4 group_create  " controlId="formBasicEmailcraete1">
              <Form.Control className='email_create' type="email" placeholder="البريد الالكتروني " />
            </Form.Group>
            <Form.Group className="mb-4 group_create" controlId="formBasicPassword1">
              <Form.Control className='group_form_create' type="password" placeholder="كلمة السر" />
            </Form.Group>
            <Form.Group className="mb-4 group_create " controlId="formBasicConfirmPassword1">

              <Form.Control className='group_form_create' type="password" placeholder="تاكيد كلمة السر" />
            </Form.Group>
            <button className='max-w-96 w-5/12 py-2  btn_login' >انشاء حساب</button>

          </Form>
        </div>
      </div >
    </div>
  )
}

export default Create