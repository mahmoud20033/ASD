import React from 'react';
import { Col, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router';
import './Home.css';
const Sidebar = () => {
    return (
        <div className="fixed top-0 right-0 h-screen w-2/12 bg-gray-800 text-white p-4 z-50">
            <nav>
                <ul className="space-y-4 ">
                    <li className="hover:bg-gray-700 p-2 rounded">
                        <Link to="/Main" className='Dropdown_link text-white'>
                            الصفحة الرئيسية
                        </Link>
                    </li>
                    {/* <li className="hover:bg-gray-700 p-2 rounded">
                        <Link to='/' className='Link_Nav'>تسجيل الدخول</Link>
                    </li>
                    <li className="hover:bg-gray-700 p-2 rounded">
                        <Link to='/Create' className='Link_Nav'>انشاء حساب</Link>
                    </li> */}
                    <li className="hover:bg-gray-700 p-2 rounded">
                        <NavDropdown
                            title="شئون العاملين"
                            className='Dropdown_Navv'
                        >

                            <Col lg={12} md={12} sm={12}>
                                <Link to="#" className='Dropdown_link text-black px-2'>
                                    الوظائف
                                </Link>
                            </Col >
                            <NavDropdown.Divider />
                            <Col lg={12} md={12} sm={12}>
                                <Link to="/Employees" className='Dropdown_link text-black px-2	'>
                                    الموظفين
                                </Link>
                            </Col>
                            <NavDropdown.Divider />
                            <Col lg={12} md={12} sm={12}>
                                <Link to="/Pouvoirs" className='Dropdown_link text-black px-2'>
                                    صلاحيات الموظفين
                                </Link>
                            </Col>

                        </NavDropdown>
                    </li>
                    <li className="hover:bg-gray-700 p-2 rounded">
                        <NavDropdown
                            title="المخازن"
                            className='Dropdown_Navv '>
                            <Link to="/Scrapstore" className='Dropdown_link text-black px-2	'>
                                مخزن الخردة
                            </Link>
                            <NavDropdown.Divider />

                            <Link to="/Rawmaterial" className='Dropdown_link text-black	px-2'>
                                مخزن المادة الخام
                            </Link>
                        </NavDropdown>
                    </li>
                    <li className="hover:bg-gray-700 p-2 rounded ">
                        <Link to="/Suppliers" className='Dropdown_link text-white'>
                            المورد
                        </Link>
                    </li>

                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
