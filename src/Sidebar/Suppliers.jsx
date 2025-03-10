import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const Suppliers = () => {
  const [Posts, Setpost] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    phone: '',
    count: '',
  })

  // useEffect(() => {
  //   axios.get("https://jsonplaceholder.typicode.com/users")
  //     .then((res) => {
  //       Setpost(res.data)
  //       console.log(res.data);
  //     })
  // }, [])
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const startEditing = (post) => {
    setEditingRow(post.id)
    setEditedValues({ ...post })
  }
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
    setNewSupplier({ name: '', email: '', count: '' })
  }
  // Deletes a supplier from the Posts array
  const handleDelete = (id) => {
    Setpost(Posts.filter(post => post.id !== id))
  }

  // Updates search term state for filtering suppliers
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

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
    post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.id.toString().includes(searchTerm)
  )

  return (
    <div className='Suppliers absolute top-0 left-0 w-10/12 '>
      <div className='w-full h-full px-1' >
        <div className='w-full'>
          <div className='flex justify-between mb-3'>
            <Button variant="outline-success" onClick={handlePrint}>
              طباعة التقرير
            </Button>
          </div>
          <span className='w-full '>
            <Form.Control
              value={searchTerm}
              onChange={handleSearch}
              className='w-full text-center py-2'
              label="asc"
              placeholder='البحث عن طريق الكود او الاسم'
            />
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
                value={newSupplier.count}
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
                      value={editedValues.count || ''}
                      onChange={(e) => handleCellEdit(e, 'count')}
                    />
                  ) : (
                    post.count
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