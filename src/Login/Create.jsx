import axios from 'axios';
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';

const Create = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await axios('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        // Handle successful signup
        window.location.href = '/login';
      } else {
        const data = await response.json();
        setError(data.message || 'حدث خطأ في التسجيل');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    }
  };

  return (
    <div>
      <div className='bg_login'>
        <div className='min-w-96 w-3/6 login_container'>
          <h1 className='min-w-96 w-6/6 h1_create'>انشاء حساب</h1>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4 group_create" controlId="formBasictext1">
              <Form.Control
                className='user_create'
                type="text"
                placeholder="اسم المستخدم"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-4 group_create" controlId="formBasicEmailcraete1">
              <Form.Control
                className='email_create'
                type="email"
                placeholder="البريد الالكتروني"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-4 group_create" controlId="formBasicPassword1">
              <Form.Control
                className='group_form_create'
                type="password"
                placeholder="كلمة السر"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-4 group_create" controlId="formBasicConfirmPassword1">
              <Form.Control
                className='group_form_create'
                type="password"
                placeholder="تاكيد كلمة السر"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Form.Group>
            <button type="submit" className='max-w-96 w-5/12 py-2 btn_login'>انشاء حساب</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Create;