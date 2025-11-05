// Import required dependencies
import axios from 'axios';
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const Create = () => {
  const navigate = useNavigate();
  const { addUser } = useUsers();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('جميع الحقول مطلوبة');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      const newUser = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      const response = await axios.post('http://localhost:8080/api/user/register', newUser);

      if (response.status === 201 || response.status === 200) {
        addUser(newUser);
        navigate('/');
      }
    } catch (apiErr) {
      if (apiErr.response?.data?.message) {
        setError(apiErr.response.data.message);
      } else if (apiErr.message === 'Network Error') {
        setError('فشل الاتصال بقاعدة البيانات');
      } else {
        setError('حدث خطأ في التسجيل');
      }
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
              <div className="position-relative">
                <Form.Control
                  className='group_form_create'
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة السر"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </Form.Group>
            <Form.Group className="mb-4 group_create" controlId="formBasicConfirmPassword1">
              <div className="position-relative">
                <Form.Control
                  className='group_form_create'
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="تاكيد كلمة السر"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </Form.Group>
            <button type="submit" className='max-w-96 w-5/12 py-2 btn_login'>انشاء حساب</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Create;