// Import required dependencies
import axios from 'axios';
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';

// Create component for user registration
const Create = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Get addUser function from UserContext
  const { addUser } = useUsers();

  // State to manage form input values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  // State to manage error messages
  const [error, setError] = useState('');

  // Handle input changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate that all fields are filled
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      // Check for existing email in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = existingUsers.some(user => user.email === formData.email);

      // Prevent duplicate email registration
      if (emailExists) {
        setError('هذا البريد الإلكتروني مسجل بالفعل');
        return;
      }

      // Create new user object with default role and permissions
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'newUser',
        permissions: {
          Dashboard: false,
          Store_Supervisor: false,
          Foreman_Supervisor: false,
          Workers: false,
          Scrapstore: false,
          Rawmaterial: false,
          Suppliers: false,
          Clients: false
        }
      };

      // Save user to context and localStorage
      addUser(newUser);
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Redirect to login page after successful registration
      navigate('/');
    } catch (err) {
      setError('حدث خطأ في التسجيل');
    }
  };

  // Render registration form
  return (
    <div>
      {/* Main container with background */}
      <div className='bg_login'>
        {/* Form container with styling */}
        <div className='min-w-96 w-3/6 login_container'>
          {/* Form title */}
          <h1 className='min-w-96 w-6/6 h1_create'>انشاء حساب</h1>
          {/* Error message display */}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {/* Registration form */}
          <Form onSubmit={handleSubmit}>
            {/* Username input field */}
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
            {/* Email input field */}
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
            {/* Password input field */}
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
            {/* Confirm password input field */}
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
            {/* Submit button */}
            <button type="submit" className='max-w-96 w-5/12 py-2 btn_login'>انشاء حساب</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Create;