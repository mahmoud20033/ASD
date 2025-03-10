// Component for managing raw materials inventory and transactions
import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const Rawmaterial = () => {
    // State for storing raw material records
    const [Posts, Setpost] = useState([])
    // State for search functionality
    const [searchTerm, setSearchTerm] = useState('')
    // States for editing functionality
    const [editingId, setEditingId] = useState(null)
    // State for new raw material entry
    const [newScrap, setNewScrap] = useState({
        Name: '',
        Quantity: '',
        Cost: '',
        date: new Date().toISOString().split('T')[0],
        status: 'تصدير'
    })

    // Row editing states
    const [editingRow, setEditingRow] = useState(null);
    const [editedValues, setEditedValues] = useState({});

    // Function to start editing a row
    const startEditing = (post) => {
        setEditingRow(post.id);
        setEditedValues({ ...post });
    };

    // Save edited changes
    const saveChanges = (postId) => {
        const updatedPosts = Posts.map(post =>
            post.id === postId ? { ...editedValues } : post
        );
        Setpost(updatedPosts);
        setEditingRow(null);
        setEditedValues({});
    };

    const cancelEditing = () => {
        setEditingRow(null);
        setEditedValues({});
    };

    const handleCellEdit = (event, field) => {
        setEditedValues({
            ...editedValues,
            [field]: event.target.value
        });
    };

    // Handle search input changes
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    // Handle material entry input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewScrap({ ...newScrap, [name]: value })
    }

    // Add or update raw material entry
    const handleAddScrap = () => {
        if (editingId !== null) {
            // Update existing scrap
            const updatedPosts = Posts.map(post =>
                post.id === editingId ? { ...newScrap, id: editingId } : post
            )
            Setpost(updatedPosts)
            setEditingId(null)
        } else {
            // Add new scrap
            const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
            const newPost = { id: newId, ...newScrap }
            Setpost([...Posts, newPost])
        }
        setNewScrap({
            Name: '',
            Quantity: '',
            Cost: '',
            date: new Date().toISOString().split('T')[0],
            status: 'تصدير'
        })
    }

    // Delete raw material entry
    const handleDelete = (id) => {
        const updatedPosts = Posts.filter(post => post.id !== id)
        Setpost(updatedPosts)
        if (editingId === id) {
            setEditingId(null)
            setNewScrap({
                Quantity: '',
                Type: 'علب الكنز',
                Cost: '',
                date: new Date().toISOString().split('T')[0],
            })
        }
    }

    // Filter materials based on search
    const filteredPosts = Posts.filter(post =>
        post.Quantity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.Name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Handle report printing
    const handlePrint = () => {
        const printContent = document.getElementById('Rawmaterial-table');
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
        <div className='Suppliers absolute  top-0 left-0 w-10/12 '>
            <div className='w-full h-full px-1' >
                <Button variant="outline-success" className='my-2' onClick={handlePrint}>
                    طباعة التقرير
                </Button>
                <Form.Control
                    aria-label="Example text with button addon"
                    aria-describedby="basic-addon1"
                    className='w-full text-center py-2'
                    value={searchTerm}
                    placeholder='البحث عن طريق الكود او الاسم'
                    onChange={handleSearch}
                />
                <InputGroup className="my-3">

                    <Form.Control
                        placeholder="الاسم"
                        name="Name"
                        value={newScrap.Name}
                        onChange={handleInputChange}
                    />
                    <Form.Control
                        placeholder="الكمية"
                        name="Quantity"
                        value={newScrap.Quantity}
                        onChange={handleInputChange}
                    />


                    <Form.Control
                        placeholder="تكلفة الكيلو"
                        name="Cost"
                        value={newScrap.Cost}
                        onChange={handleInputChange}
                    />
                    <Form.Control
                        type="date"
                        name="date"
                        value={newScrap.date}
                        onChange={handleInputChange}
                    />
                    <Form.Select
                        name="status"
                        value={newScrap.status}
                        onChange={handleInputChange}
                    >
                        <option value="تصدير للبيع">تصدير</option>
                    </Form.Select>
                </InputGroup>
                <Button className='mb-3 bg-black' onClick={handleAddScrap}>
                    {editingId !== null ? 'تحديث الخردة' : 'إضافة خردة'}
                </Button>
                <Table id="Rawmaterial-table" striped bordered hover>
                    <thead>
                        <tr>
                            <th className='w-1/12'>الكود</th>
                            <th className='w-2/12'>الاسم</th>
                            <th className='w-2/12'>الكمية</th>
                            <th className='w-2/12'>تكلفة الكيلو</th>
                            <th className='w-2/12'>التاريخ</th>
                            <th className='w-1/8'>الحالة</th>
                            <th className='w-1/12'>تعديل</th>
                        </tr>
                    </thead>
                    {

                        filteredPosts.map((post) => (
                            <tbody key={post.id}>
                                <tr>
                                    <td>{post.id}</td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                value={editedValues.Name}
                                                onChange={(e) => handleCellEdit(e, 'Name')}
                                            />
                                        ) : post.Name}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                value={editedValues.Quantity}
                                                onChange={(e) => handleCellEdit(e, 'Quantity')}
                                            />
                                        ) : post.Quantity}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                value={editedValues.Cost}
                                                onChange={(e) => handleCellEdit(e, 'Cost')}
                                            />
                                        ) : post.Cost}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                type="date"
                                                value={editedValues.date}
                                                onChange={(e) => handleCellEdit(e, 'date')}
                                            />
                                        ) : post.date}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Select
                                                value={editedValues.status}
                                                onChange={(e) => handleCellEdit(e, 'status')}
                                            >
                                                <option value="تصدير">تصدير</option>
                                            </Form.Select>
                                        ) : post.status}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {editingRow === post.id ? (
                                                <>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => saveChanges(post.id)}
                                                    >
                                                        حفظ
                                                    </Button>
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={cancelEditing}
                                                    >
                                                        إلغاء
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => startEditing(post)}
                                                    >
                                                        تعديل
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
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ))
                    }
                </Table>
            </div>
        </div>)
}

export default Rawmaterial