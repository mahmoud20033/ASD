// Employees Component: Manages employee records and operations
import React, { useEffect, useState } from 'react'
import "../Sidebar.css"
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import { useSearch } from '../../context/SearchContext';

const Manager = () => {
    const { searchQuery } = useSearch()
    const [isEditingManager, setIsEditingManager] = useState(false)
    const [managerDetails, setManagerDetails] = useState({
        name: localStorage.getItem('managerName') || 'محمود محمد',
    })

    const handleManagerEdit = (field, value) => {
        setManagerDetails(prev => {
            const newDetails = {
                ...prev,
                [field]: value
            };
            if (field === 'name') {
                localStorage.setItem('managerName', value);
            }
            return newDetails;
        })
    }

    // State Management
    // Stores all employee records
    const [Posts, Setpost] = useState([])
    // Controls editing states
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editedRow, setEditedRow] = useState({})
    // Manages new employee entry form
    const [newSupplier, setNewSupplier] = useState({
        Receiving_reports: '',
        Store_Supervisor: '',
        Foreman_Supervisor: '',
        Suppliers: ''
    })
    // CRUD Operations
    // Handles form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewSupplier({ ...newSupplier, [name]: value })
    }

    // Add new employee to the list
    const handleAddSupplier = () => {
        const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
        const newPost = { id: newId, ...newSupplier }
        Setpost([...Posts, newPost])
        setNewSupplier({ Store_Supervisor: '', Foreman_Supervisor: '', Suppliers: '' })
    }

    // Start editing an existing employee
    const handleEdit = (supplier) => {
        setEditingId(supplier.id)
        setEditedRow(supplier)
        setIsEditing(true)
    }

    // Handle changes during editing
    const handleCellChange = (event, field) => {
        setEditedRow({
            ...editedRow,
            [field]: event.target.value
        })
    }

    // Save edited employee data
    const handleSave = () => {
        Setpost(Posts.map(post =>
            post.id === editingId ? editedRow : post
        ))
        setEditingId(null)
        setIsEditing(false)
        setEditedRow({})
    }

    // Cancel current operation
    const handleCancel = () => {
        setEditingId(null)
        setIsEditing(false)
        setEditedRow({})
    }

    // Delete employee record
    const handleDelete = (id) => {
        Setpost(Posts.filter(post => post.id !== id))
    }

    // Filter employees based on search term
    const filteredPosts = Posts.filter(post =>
        post.id?.toString().includes(searchQuery)
    )
    // Handle report printing
    const handlePrint = () => {
        const printContent = document.getElementById('Employees-table');
        const windowPrint = window.open('', '', 'width=900,height=600');
        windowPrint.document.write(`
                ${printContent.outerHTML}
    `);
        windowPrint.document.close();
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
    };
    return (
        <div className=' Navvv_com Suppliers pt-3  absolute top-0 left-0 w-10/12 '>
            <Button className='mr-3 mb-2 bg-black' onClick={handlePrint}>
                طباعة التقرير
            </Button>

            <Card className="mb-4 mx-2">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                    <span>تفاصيل المدير</span>
                    <Button
                        variant={isEditingManager ? "success" : "light"}
                        size="sm"
                        onClick={() => setIsEditingManager(!isEditingManager)}
                    >
                        {isEditingManager ? 'حفظ' : 'تعديل'}
                    </Button>
                </Card.Header>
                <Card.Body>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className='text-2xl	'>
                                <strong className='font-bold'>الاسم :  </strong>
                                {isEditingManager ? (
                                    <Form.Control
                                        value={managerDetails.name}
                                        onChange={(e) => handleManagerEdit('name', e.target.value)}
                                        size="sm"
                                        className="d-inline-block w-auto ml-2"
                                    />
                                ) : managerDetails.name}
                            </p>
                            {/* <p>
                                <strong>المنصب:</strong>{' '}
                                {isEditingManager ? (
                                    <Form.Control
                                        value={managerDetails.position}
                                        onChange={(e) => handleManagerEdit('position', e.target.value)}
                                        size="sm"
                                        className="d-inline-block w-auto ml-2"
                                    />
                                ) : managerDetails.position}
                            </p> */}
                        </div>
                        {/* <div>
                            <p>
                                <strong>القسم:</strong>{' '}
                                {isEditingManager ? (
                                    <Form.Control
                                        value={managerDetails.department}
                                        onChange={(e) => handleManagerEdit('department', e.target.value)}
                                        size="sm"
                                        className="d-inline-block w-auto ml-2"
                                    />
                                ) : managerDetails.department}
                            </p>
                            <p>
                                <strong>الهاتف:</strong>{' '}
                                {isEditingManager ? (
                                    <Form.Control
                                        value={managerDetails.phone}
                                        onChange={(e) => handleManagerEdit('phone', e.target.value)}
                                        size="sm"
                                        className="d-inline-block w-auto ml-2"
                                    />
                                ) : managerDetails.phone}
                            </p>
                            <p>
                                <strong>البريد الإلكتروني:</strong>{' '}
                                {isEditingManager ? (
                                    <Form.Control
                                        value={managerDetails.email}
                                        onChange={(e) => handleManagerEdit('email', e.target.value)}
                                        size="sm"
                                        className="d-inline-block w-auto ml-2"
                                    />
                                ) : managerDetails.email}
                            </p>
                        </div> */}
                    </div>
                </Card.Body>
            </Card>

            <div className='Employees px-2 '>
                <div className='w-full h-full px-1' >
                    <div className='w-full'>
                        <span className='w-full '>
                            <InputGroup className="my-3 w-full">
                                <Form.Control
                                    placeholder="استلام تقارير"
                                    aria-label="استلام تقارير"
                                    name="Receiving_reports"
                                    value={newSupplier.Receiving_reports}
                                    onChange={handleInputChange}
                                    className='input'
                                />
                                <Form.Control
                                    placeholder="اسم مشرف المخازن"
                                    aria-label="اسم مشرف المخازن"
                                    name="Store_Supervisor"
                                    value={newSupplier.Store_Supervisor}
                                    onChange={handleInputChange}
                                    className='input'
                                />
                                <Form.Control
                                    placeholder="اسم مشرف العمال"
                                    aria-label="اسم مشرف العمال"
                                    name="Foreman_Supervisor"
                                    value={newSupplier.Foreman_Supervisor}
                                    onChange={handleInputChange}
                                    className='input'
                                />
                                <Form.Control
                                    placeholder="اسم المورد"
                                    aria-label="اسم المورد"
                                    name="Suppliers"
                                    value={newSupplier.Suppliers}
                                    onChange={handleInputChange}
                                    className='input'
                                />

                            </InputGroup>
                            <Button className="mb-3 bg-black" onClick={handleAddSupplier}>
                                اضافة موظف
                            </Button>
                        </span>
                    </div>
                    <Table id="Employees-table" striped bordered hover>
                        <thead>
                            <tr>
                                <th >الكود</th>
                                <th >استلام تقارير</th>
                                <th >اسم مشرف المخازن</th>
                                <th >اسم مشرف العمال</th>
                                <th >اسم المورد</th>
                                <th >تحديث البيانات</th>
                            </tr>
                        </thead>
                        {filteredPosts.map((post) => (
                            <tbody key={post.id}>
                                <tr>
                                    <td>{post.id}</td>
                                    <td>
                                        {editingId === post.id ? (
                                            <Form.Control
                                                value={editedRow.Receiving_reports}
                                                onChange={(e) => handleCellChange(e, 'Receiving_reports')}
                                            />
                                        ) : post.Receiving_reports}
                                    </td>
                                    <td>
                                        {editingId === post.id ? (
                                            <Form.Control
                                                value={editedRow.Store_Supervisor}
                                                onChange={(e) => handleCellChange(e, 'Store_Supervisor')}
                                            />
                                        ) : post.Store_Supervisor}
                                    </td>
                                    <td>
                                        {editingId === post.id ? (
                                            <Form.Control
                                                value={editedRow.Foreman_Supervisor}
                                                onChange={(e) => handleCellChange(e, 'Foreman_Supervisor')}
                                            />
                                        ) : post.Foreman_Supervisor}
                                    </td>
                                    <td>
                                        {editingId === post.id ? (
                                            <Form.Control
                                                value={editedRow.Suppliers}
                                                onChange={(e) => handleCellChange(e, 'Suppliers')}
                                            />
                                        ) : post.Suppliers}
                                    </td>

                                    <td>
                                        {editingId === post.id ? (
                                            <>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={handleSave}
                                                    className="me-2"
                                                >
                                                    حفظ
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={handleCancel}
                                                >
                                                    الغاء
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleEdit(post)}
                                                    className="me-2"
                                                >
                                                    تحديث
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    حذف
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </Table>
                </div>
            </div>
        </div>

    )
}

export default Manager