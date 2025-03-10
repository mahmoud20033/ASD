import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

const Scrapstore = () => {
    // Stores all scrap items
    const [Posts, Setpost] = useState([])
    // Stores the current search term for filtering
    const [searchTerm, setSearchTerm] = useState('')
    // ID of the item being edited (legacy - can be removed)
    const [editingId, setEditingId] = useState(null)
    // State for new scrap item form
    const [newScrap, setNewScrap] = useState({
        Quantity: '',
        Type: 'علب الكنز',
        Cost: '',
    })
    // ID of the row currently being edited in the table
    const [editingRow, setEditingRow] = useState(null);
    // Temporarily stores the edited values while editing a row
    const [editedValues, setEditedValues] = useState({});

    // Starts editing mode for a table row
    const startEditing = (post) => {
        setEditingRow(post.id)
        setEditedValues({ ...post })
    }
    // Saves the edited values back to the main Posts state
    const saveChanges = (postId) => {
        const updatedPosts = Posts.map(post =>
            post.id === postId ? editedValues : post
        );
        Setpost(updatedPosts);
        setEditingRow(null);
        setEditedValues({})
    }
    // Cancels the editing mode without saving changes
    const cancelEditing = () => {
        setEditingRow(null);
        setEditedValues({});
    }
    // Handles changes in cell values during editing
    const handleCellEdit = (e, field) => {
        setEditedValues({
            ...editedValues,
            [field]: e.target.value
        })
    }

    // Handles printing the scrap store table
    const handlePrint = () => {
        const printContent = document.getElementById('Scrapstore-table');
        const windowPrint = window.open('', '', 'width=900,height=600');
        windowPrint.document.write(`
                    ${printContent.outerHTML}
        `);
        windowPrint.document.close();
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
    };
    // Updates search term state for filtering
    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    // Handles changes in the new scrap input form
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewScrap({ ...newScrap, [name]: value })
    }

    // Adds a new scrap item to the Posts array
    const handleAddScrap = () => {



        // Add new scrap
        const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
        const newPost = { id: newId, ...newScrap }
        Setpost([...Posts, newPost])

        setNewScrap({
            Quantity: '',
            Type: 'علب الكنز',
            Cost: '',
        })
    }

    // Deletes a scrap item from the Posts array
    const handleDelete = (id) => {
        Setpost(Posts.filter(post => post.id !== id))
    }

    // Filters posts based on search term
    const filteredPosts = Posts.filter(post =>
        post.Type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.id.toString().includes(searchTerm)
    )
    return (

        // Main container for the scrap store interface
        <div className='Suppliers absolute top-0 left-0 w-10/12 '>
            <div className='w-full h-full px-1' >
                {/* Print report button */}
                <Button variant="outline-success" className='my-2' onClick={handlePrint}>
                    طباعة التقرير
                </Button>
                {/* Search input field */}
                <Form.Control
                    aria-label="Example text with button addon"
                    aria-describedby="basic-addon1"
                    className='w-full text-center py-2'
                    value={searchTerm}
                    placeholder='البحث عن طريق النوع'
                    onChange={handleSearch}
                />
                {/* New scrap input form */}
                <InputGroup className="my-3">

                    <Form.Control
                        placeholder="الكمية"
                        name="Quantity"
                        value={newScrap.Quantity}
                        onChange={handleInputChange}
                    />
                    <Form.Select
                        placeholder="النوع"
                        name="Type"
                        value={newScrap.Type}
                        onChange={handleInputChange}
                    >
                    </Form.Select>


                    <Form.Control
                        placeholder="تكلفة الكيلو"
                        name="Cost"
                        value={newScrap.Cost}
                        onChange={handleInputChange}
                    />
                </InputGroup>
                <Button className='mb-3 bg-black'  onClick={handleAddScrap}>
                    إضافة خردة
                </Button>
                {/* Scrap items table */}
                <Table id='Scrapstore-table' striped bordered hover>
                    <thead>
                        <tr>
                            <th className='w-1/8'>الكود</th>
                            <th className='w-2/8'>الكمية</th>
                            <th className='w-2/8'>النوع</th>
                            <th className='w-1/8'>تكلفة الكيلو</th>
                            <th className='w-1/8'>تعديل</th>
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
                                                value={editedValues.Quantity || ''}
                                                onChange={(e) => handleCellEdit(e, 'Quantity')}
                                            />
                                        ) : (
                                            post.Quantity
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Select
                                                value={editedValues.Type || ''}
                                                onChange={(e) => handleCellEdit(e, 'Type')}
                                            >
                                                <option value="علب الكنز">علب الكنز</option>
                                                {/* Add more options as needed */}
                                            </Form.Select>
                                        ) : (
                                            post.Type
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <Form.Control
                                                value={editedValues.Cost || ''}
                                                onChange={(e) => handleCellEdit(e, 'Cost')}
                                            />
                                        ) : (
                                            post.Cost
                                        )}
                                    </td>
                                    <td>
                                        {editingRow === post.id ? (
                                            <div className="d-flex gap-2">
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
                                            </div>
                                        ) : (
                                            <div className="d-flex gap-2">
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
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        ))
                    }
                </Table>
            </div>
        </div>

    )
}

export default Scrapstore