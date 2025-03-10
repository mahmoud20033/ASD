import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import './Login.css'
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

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

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    // setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      // setIsLoading(false);
      return;
    }

    try {
      if (email === 'admin@gmail.com' && password === 'admin') {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        }
        navigate('/Main'); // Replace with your target route
      } else {
        setError('البريد الالكتروني او كلمة السر خاطئة');
      }
    } catch (err) {
      setError('حدث خطأ اثناء تسجيل الدخول');
    }
  }

  return (
    <>
      <div className='Image'>
        <div className='min-w-s w-3/6 Login_css'>
          <h1 className='P_login'>تسجيل دخول</h1>
          <Form className='Form_login1' onSubmit={handleLogin}>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <Form.Group className="mb-6 Form_input" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="اسم المستخدم"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-6 Form_input" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="كلمه المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Row >
              <Col lg={9} md={12} sm={12} >
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    className='Check'
                    type="checkbox"
                    label="تذكرني"
                    checked={rememberMe}
                    onChange={handleRememberMe}
                  />
                </Form.Group>
              </Col>
              <Col lg={3} md={12} sm={12} >
                <Link to='/Forgot' className='Link_login'> هل نسيت كلمه السر؟</Link>
              </Col >
            </Row>
            <button
              className='max-w-96 w-11/12 py-3 Btn_login'
              type="submit"

            >
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