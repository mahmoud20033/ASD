import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router';
import { Col } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import { useUsers } from '../context/UserContext';
import SearchFilter from '../components/SearchFilter';

const Sidebar = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { permissions: {} };

    const LinkWithPermission = ({ to, permission, children }) => {
        const hasPermission = currentUser.permissions[permission];

        if (!hasPermission) {
            return (
                <span className='Dropdown_linkk text-danger  flex items-center gap-2 cursor-not-allowed'>
                    {children}
                    <FaLock size={14} />
                </span>
            );
        }

        return (
            <Link to={to} className='Dropdown_linkk'>
                {children}
            </Link>
        );
    };

    return (
        <div className="fixed top-0 right-0 Sidebar w-2/12 h-screen text-black pr-4 z-300">
            {["lg"].map((expand) => (
                <Navbar key={expand} expand={expand}>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} className=' absolute top-0 right-0 ' />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-${expand}`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                        placement="end"
                        className="Sidebar "
                    >
                        <Offcanvas.Header closeButton />
                        <Offcanvas.Body className='absolute top-6 right-0'>
                            <ul className="space-y-4 w-60">
                                <li className='space-y-4 w-54 p-0'>
                                    <SearchFilter />
                                </li>
                                <li className="text-white p-2 rounded">
                                    <Link to="/Main" className='Dropdown_link'>
                                        الصفحة الرئيسية
                                    </Link>
                                </li>

                                <li>
                                    <LinkWithPermission to="/Manager" permission="Manager">
                                        المدير
                                    </LinkWithPermission>
                                </li>
                                <li className="p-2 text-black">
                                    <NavDropdown title="شئون العاملين" className='Dropdown_Navv w-70'>
                                        <Col lg={12} md={12} sm={12}>
                                            <LinkWithPermission to="/Store_Supervisor" permission="Store_Supervisor">
                                                مشرف المخازن
                                            </LinkWithPermission>
                                        </Col>
                                        <NavDropdown.Divider />
                                        <Col lg={12} md={12} sm={12}>
                                            <LinkWithPermission to="/Foreman_Supervisor" permission="Store_Supervisor">
                                                مشرف العمال
                                            </LinkWithPermission>
                                        </Col>
                                        <NavDropdown.Divider />
                                        <Col lg={12} md={12} sm={12}>
                                            <LinkWithPermission to="/Workers" permission="Workers">
                                                العمال
                                            </LinkWithPermission>
                                        </Col>
                                        <NavDropdown.Divider />
                                        <Col lg={12} md={12} sm={12}>
                                            <LinkWithPermission to="/Pouvoirs" permission="Dashboard">
                                                صلاحيات الموظفين
                                            </LinkWithPermission>
                                        </Col>
                                    </NavDropdown>
                                </li>

                                <li className="p-2 rounded text-black">
                                    <NavDropdown title="المخازن" className='Dropdown_Navv w-70'>
                                        <LinkWithPermission to="/Scrapstore" permission="Scrapstore">
                                            مخزن الخردة
                                        </LinkWithPermission>
                                        <NavDropdown.Divider />
                                        <LinkWithPermission to="/Rawmaterial" permission="Rawmaterial">
                                            مخزن المادة الخام
                                        </LinkWithPermission>
                                    </NavDropdown>
                                </li>

                                <li className="p-2 rounded">
                                    <LinkWithPermission to="/Suppliers" permission="Suppliers">
                                        المورد
                                    </LinkWithPermission>
                                </li>

                                <li className="p-2 rounded">
                                    <LinkWithPermission to="/Clients" permission="Clients">
                                        العملاء
                                    </LinkWithPermission>
                                </li>
                                <li className="p-2 rounded">
                                    <Link to="/Logout" className='Dropdown_linkk'>
                                        تسجيل الخروج
                                    </Link>
                                </li>
                            </ul>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Navbar>
            ))
            }
        </div >
    );
};

export default Sidebar;
