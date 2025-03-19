import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SearchFilter from '../components/SearchFilter';
import { useSearch } from '../context/SearchContext';

// Suppliers Component: Manages supplier information and transactions
const Suppliers = () => {
  // State Management
  // Stores the list of all suppliers
  const [Posts, Setpost] = useState([])
  const { searchQuery } = useSearch();
  // Stores data for new supplier entries
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    phone: '',
    count: '',
    manager: ''
  })
  // Row Editing Management
  // Tracks which row is currently being edited
  const [editingRow, setEditingRow] = useState(null);
  // Stores temporary values during editing
  const [editedValues, setEditedValues] = useState({});

  // CRUD Operations
  // Initiates editing mode for a supplier row
  const startEditing = (post) => {
    setEditingRow(post.id)
    setEditedValues({ ...post })
  }
  // Updates supplier data in the table
  const saveChanges = (postId) => {
    const updatedPosts = Posts.map(post =>
      post.id === postId ? { ...post, ...editedValues } : post
    );
    Setpost(updatedPosts);
    setEditingRow(null);
    setEditedValues({})
  }
  const cancelEditing = () => {
    setEditingRow(null);
    setEditedValues({});
  }
  const handleCellEdit = (e, field) => {
    setEditedValues({
      ...editedValues,
      [field]: e.target.value
    })
  }

  // Updates the newSupplier state when input fields change
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNewSupplier({ ...newSupplier, [name]: value })
  }

  // Adds a new supplier to the Posts array with auto-generated ID
  const handleAddSupplier = () => {
    const newId = Posts.length ? Posts[Posts.length - 1].id + 1 : 1
    const newPost = { id: newId, ...newSupplier }
    Setpost([...Posts, newPost])
    setNewSupplier({ name: '', email: '', count: '', manager: '' })
  }
  // Deletes a supplier from the Posts array
  const handleDelete = (id) => {
    Setpost(Posts.filter(post => post.id !== id))
  }

  // Printing Functionality
  // Handles report generation and printing
  const handlePrint = () => {
    const printContent = document.getElementById('suppliers-table');
    const windowPrint = window.open('', '', 'width=900,height=600');
    windowPrint.document.write(`
          ${printContent.outerHTML}
    `);
    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  };

  const filteredPosts = Posts.filter(post =>
    post.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.id.toString().includes(searchQuery)
  )

  return (
    <div className='Suppliers absolute pt-3 top-0 left-0 w-10/12 '>
      <div className='w-full h-full px-1' >
        <div className='w-full'>
          <div className='flex justify-between mb-3'>
            <Button className='bg-black' onClick={handlePrint}>
              طباعة التقرير
            </Button>
          </div>
          <span className='w-full '>
            <InputGroup className="my-3 w-full">
              <Form.Control
                placeholder="اسم المورد"
                aria-label="اسم المورد"
                name="name"
                value={newSupplier.name}
                onChange={handleInputChange}
              />
              <Form.Control
                placeholder="رقم الهاتف"
                aria-label="رقم الهاتف"
                name="phone"
                value={newSupplier.phone}
                onChange={handleInputChange}
                className='input'
              />
              <Form.Control
                placeholder="الرصيدالحالي"
                aria-label="الرصيد الحالي "
                name="count"
                type="number"
                step="0.01"
                value={newSupplier.count}
                onChange={handleInputChange}
                className='input'
              />
              <Form.Control
                placeholder="المدير"
                aria-label="المدير"
                name="manager"
                value={newSupplier.manager}
                onChange={handleInputChange}
                className='input'
              />
            </InputGroup>
            <Button className="mb-3 bg-black" onClick={handleAddSupplier}>
              اضافة موردين
            </Button>
          </span>
        </div>
        <Table id="suppliers-table" striped bordered hover>
          <thead>
            <tr>
              <th className='w-1/8 ' >الكود</th>
              <th className='w-3/8' >اسم المورد</th>
              <th className='w-2/8' >رقم الهاتف</th>
              <th className='w-2/8'>الرصيدالحالي</th>
              <th className='w-2/8'>المدير</th>

              <th className='w-1/8'>تحديث البيانات</th>
            </tr>
          </thead>
          {filteredPosts.map((post) => (
            <tbody key={post.id}>
              <tr>
                <td>{post.id}</td>
                <td>
                  {editingRow === post.id ? (
                    <Form.Control
                      value={editedValues.name || ''}
                      onChange={(e) => handleCellEdit(e, 'name')}
                    />
                  ) : (
                    post.name
                  )}
                </td>
                <td>
                  {editingRow === post.id ? (
                    <Form.Control
                      value={editedValues.phone || ''}
                      onChange={(e) => handleCellEdit(e, 'phone')}
                    />
                  ) : (
                    post.phone
                  )}
                </td>
                <td>
                  {editingRow === post.id ? (
                    <Form.Control
                      type="number"
                      step="0.01"
                      value={editedValues.count || ''}
                      onChange={(e) => handleCellEdit(e, 'count')}
                    />
                  ) : (
                    post.count
                  )}
                </td>
                <td>
                  {editingRow === post.id ? (
                    <Form.Control
                      value={editedValues.manager || ''}
                      onChange={(e) => handleCellEdit(e, 'manager')}
                    />
                  ) : (
                    post.manager
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

export default Suppliers