import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import Login from './Login/Login';
import { Col, Row } from 'react-bootstrap';

const Navv = () => {
    return (
        <div></div>
        // <div className=' Navvv_com w-1/6 h-screen'>

        //     <div className=' navs w-screen h-screen'>
        //         <Container fluid className='Navbar_navv pt-1 w-screen'>
        //             <div className='pp_pp'>
                           
        //             </div>
        //                 <Link to='/Create' className='Link_Nav'>انشاء </Link>



        //             <Nav className="justify-content-end flex-grow-1 pe-3">

                        
                       
                       
        //             </Nav>

        //         </Container>
        //     </div>
        //     {/* {isLoggedIn || (
        //         <div>
        //             {[false].map((expand) => (
        //                 <Navbar key={expand} expand={expand} className="bg-body-tertiary Nav ">
        //                     <Container fluid className='Navbar_navv pt-1 w-screen'>
        //                         <div className='pp_pp'>
        //                             <span >
        //                                 <Link to='/' className='Link_Nav'>تسجيل الدخول</Link>
        //                             </span>
        //                             <span className='span_nav'>
        //                                 <Link to='/Create' className='Link_Nav'>انشاء حساب</Link>
        //                             </span>
        //                         </div>
        //                         <span >
        //                             <Link to="/Main" className='Dropdown_lin'>
        //                                 Home
        //                             </Link>
        //                         </span>
        //                         <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        //                         <Navbar.Offcanvas
        //                             id={`offcanvasNavbar-expand-${expand}`}
        //                             aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
        //                             placement="end"
        //                         >

        //                             <Offcanvas.Header closeButton>

        //                             </Offcanvas.Header>
        //                             <Offcanvas.Body>

        //                                 <Nav className="justify-content-end flex-grow-1 pe-3">

        //                                     <NavDropdown
        //                                         title="شئون العاملين"
        //                                         id={`offcanvasNavbarDropdown-expand-${expand}`}
        //                                         className='Dropdown_Navv'
        //                                     >
                                            
        //                                             <Col lg={12} md={12} sm={12}>
        //                                                 <Link to="#" className='Dropdown_link'>
        //                                                     الوظائف
        //                                                 </Link>
        //                                             </Col >
        //                                             <NavDropdown.Divider />
        //                                             <Col lg={12} md={12} sm={12}>
        //                                                 <Link to="/Employees" className='Dropdown_link'>
        //                                                     الموظفين
        //                                                 </Link>
        //                                             </Col>
        //                                             <NavDropdown.Divider />
        //                                             <Col lg={12} md={12} sm={12}>
        //                                                 <Link to="/Pouvoirs" className='Dropdown_link'>
        //                                                     صلاحيات الموظفين
        //                                                 </Link>
        //                                             </Col>
        //                                         </Row>

        //                                     </NavDropdown>
        //                                     <NavDropdown
        //                                         title="المخازن"
        //                                         id={`offcanvasNavbarDropdown-expand-${expand}`}
        //                                         className='Dropdown_Navv'>
        //                                         <Link to="/Scrapstore" className='Dropdown_link'>
        //                                             مخزن الخردة
        //                                         </Link>
        //                                         <NavDropdown.Divider />

        //                                         <Link to="/Rawmaterial" className='Dropdown_link'>
        //                                             مخزن المادة الخام
        //                                         </Link>
        //                                     </NavDropdown>
        //                                     <Link to="/Suppliers" className='Dropdown_link'>
        //                                         المورد
        //                                     </Link>
        //                                 </Nav>
        //                             </Offcanvas.Body>
        //                         </Navbar.Offcanvas>
        //                     </Container>
        //                 </Navbar >
        //             ))}
        //         </div>
        //     )} */}
        // </div>
    )
}

export default Navv