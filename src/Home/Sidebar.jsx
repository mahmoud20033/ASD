import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap';
import { FaLock, FaCaretDown } from 'react-icons/fa';
import SearchFilter from '../components/SearchFilter';
import { Dropdown } from 'react-bootstrap';
import { FaHouse } from 'react-icons/fa6';
import team from '../Home/Images/team.png';
import supplier from '../Home/Images/supplier.png';
import clients from '../Home/Images/clients.png';
import logout from '../Home/Images/logout.png';
import storage from '../Home/Images/storage.png';
import شئون_عاملين from '../Home/Images/شئون عاملين.png';

const Sidebar = () => {

    const getUserRole = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user ? user.role : null;
    };

    // Check if user has permission (manager or admin)
    const hasPermission = () => {
        const role = getUserRole();
        return role === 'manager' || role === 'admin';
    };
    return (
        <div className='Sidebar'>
            <div className='Sidebar_content w-fit  h-screen px-3 py-4'>
                <div className='my-3 div1'>
                    <Link to="/Main" className='unlock'>
                        <div className='flex items-center'>
                            <FaHouse className='text-black' size={30} />
                            <span className='Dropdown_link mr-2 p_link'>
                                الصفحة الرئيسية
                            </span>
                        </div>
                    </Link>
                </div>

                <div className='my-3 div2'>
                    <Link to="/Manager">
                        <div className='flex items-center '>
                            <img src={team} alt="manager" />
                            <span className='p_link mr-2'>
                                المدير
                            </span>
                        </div>
                    </Link>
                </div>
                <div className='my-3 div2'
                    style={{ display: hasPermission() ? 'block' : 'none' }}
                >
                    <Link to="/permissions">
                        <div className='flex items-center '>
                            <img src={team} alt="permissions" />
                            <span className='p_link mr-2'

                            >
                                الصلاحيات
                            </span>
                        </div>
                    </Link>
                </div>
                <div className="my-3 text-black flex items-center div3">
                    <img src={شئون_عاملين} alt="شئون عاملين" />
                    <span className='p_link'>
                        <NavDropdown
                            title="شئون العاملين"
                            className='Dropdown_Navv w-fit mr-2'
                        >
                            <Col lg={12} md={12} sm={12}>
                                <Link to="/Store_Supervisor">
                                    <span className='Dropdown_linkk'>
                                        مشرف المخازن
                                    </span>
                                </Link>
                            </Col>
                            <NavDropdown.Divider />
                            <Col lg={12} md={12} sm={12}>
                                <Link to="/Foreman_Supervisor">
                                    <span className='Dropdown_linkk'>
                                        مشرف العمال
                                    </span>
                                </Link>
                            </Col>
                            <NavDropdown.Divider />
                            <Col lg={12} md={12} sm={12}>
                                <Link to="/Workers">
                                    <span className='Dropdown_linkk'>
                                        العمال
                                    </span>
                                </Link>
                            </Col>
                        </NavDropdown>
                    </span>
                </div>

                <div className="my-3 rounded text-black flex items-center div4">
                    <img src={storage} alt="storage" />
                    <span className='p_link'>
                        <NavDropdown
                            title="المخازن"
                            className='Dropdown_Navv w-fit mr-2'
                        >
                            <Link to="/Scrapstore">
                                <span className='Dropdown_linkk'>
                                    مخزن الخردة
                                </span>
                            </Link>
                            <NavDropdown.Divider />
                            <Link to="/Rawmaterial">
                                <span className='Dropdown_linkk'>
                                    مخزن المادة الخام
                                </span>
                            </Link>
                        </NavDropdown>
                    </span>
                </div>

                <div className="my-3 div5">
                    <Link to="/Suppliers">
                        <div className='flex items-center'>
                            <img src={supplier} alt="supplier" />
                            <span className='p_link mr-2'>
                                المورد
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="my-3 div6">
                    <Link to="/Clients">
                        <div className='flex items-center'>
                            <img src={clients} alt="Clients" />
                            <span className='p_link mr-2'>
                                العملاء
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="py-3 div7">
                    <Link to="/Logout" className='flex unlock items-center'>
                        <img src={logout} alt="logout" />
                        <span className='p_link mr-2'>
                            تسجيل الخروج
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </span>
));

export default Sidebar;
