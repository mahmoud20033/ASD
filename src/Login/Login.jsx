// Import necessary dependencies and hooks
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import './Login.css'
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUsers } from '../context/UserContext';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import Login_image from './Images/Login_image.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { users } = useUsers();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const remembered = localStorage.getItem('rememberMe') === 'true';

    if (remembered && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Handle "Remember Me" checkbox changes
  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMe');
    }
  };

  // Handle login form submission
  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    // Validate form inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Send login request to API
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        }
        // Save user data with token
        const userData = {
          email: data.email,
          username: data.username,
          role: data.role,
          token: data.token,
          permissions: data.permissions
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        navigate('/Main');
      } else {
        setError(data.message || 'فشل تسجيل الدخول.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  }

  // Render login form
  return (
    <>
      <div className='Image'
        style={{
          backgroundImage: `url(${Login_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        <div className='min-w-96 w-3/6 Login_css'>
          <h1 className='P_login'>تسجيل دخول</h1>

          <Form className='Form_login1' onSubmit={handleLogin}>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <Form.Group className="mb-6 Form_input" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="اسم المستخدم"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-6 Form_input" controlId="formBasicPassword">
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمه المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '10px', // Changed from right to left
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </Form.Group>
            <Row >
              <Col lg={8} md={12} sm={12} >
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    className='Check'
                    type="checkbox"
                    label="تذكرني"
                    checked={rememberMe}
                    // onChange={handleRememberMe}
                  />
                </Form.Group>
              </Col>
            </Row>
            <button
              className='max-w-96 w-11/12 py-3 Btn_login'
              type="submit"
            >
              تسجيل
            </button>
            <div className='Register'>
              <span className='span_react'>ليس لديك حساب؟
                <Link to="/Create">تسجيل</Link>
              </span>
            </div>
          </Form>
        </div>
      </div >
    </>
  )
}

export default Login