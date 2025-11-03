import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Link } from 'react-router';
const Footer = () => {
  return (

    <footer className="bg-gray-900 text-white py-10 px-6 md:px-20 text-right Footer">
      <Row >
        <Col lg={4} md={12} sm={12}>
          <div className="space-y-4 Footer_div1">
            <h4 className="text-xl font-semibold">روابط</h4>
            <ul className="space-y-2 text-gray-300 w-fit">
              <li><Link to="#" className="hover:text-white">الرئيسية</Link></li>
              <li><Link to="Main" className="hover:text-white">عن المصنع</Link></li>
              <li><Link to="Rawmaterial" className="hover:text-white">الخدمات</Link></li>
              <li><Link to="#" className="hover:text-white">الدعم الفني</Link></li>
            </ul>
          </div>
        </Col>
        <Col lg={4} md={12} sm={12}>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">مصنع المنيلاوي لصهر الخردة</h2>
            <p className="text-gray-400">© 2025 جميع الحقوق محفوظة - جمع طموق بخُفر</p>
            <a href="mailto:info@almenilawy.com" className="text-blue-400 hover:text-white">
              info@almenilawy.com
            </a>
          </div>
        </Col>
        <Col lg={4} md={12} sm={12}>
          <div className="flex flex-col items-end space-y-4">
            <h4 className="text-xl font-semibold">تواصل معنا</h4>
            <div className="flex justify-center rtl:space-x-reverse">
              <a href="#" className="text-blue-500 hover:text-white">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-blue-400 px-4 hover:text-white">
                <FaLinkedinIn size={20} />
              </a>
              <a href="#" className="text-red-500 hover:text-white">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </footer >
  )
}

export default Footer