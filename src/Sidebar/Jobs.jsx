import React, { useState } from 'react';
import { Form, Button, ListGroup, Pagination, Dropdown } from 'react-bootstrap';

const Jobs = () => {
    // const [todos, setTodos] = useState([]);
    // const [inputText, setInputText] = useState('');
    // const [itemsPerPage] = useState(5);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [selectedPage, setSelectedPage] = useState('home');

    // const pages = {
    //     home: 'Home Page',
    //     about: 'About Page',
    //     contact: 'Contact Page',
    //     services: 'Services Page'
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (inputText.trim()) {
    //         setTodos([...todos, {
    //             text: inputText,
    //             id: Date.now(),
    //             page: selectedPage
    //         }]);
    //         setInputText('');
    //     }
    // };

    // const deleteTodo = (id) => {
    //     setTodos(todos.filter(todo => todo.id !== id));
    // };

    // const sendToMissions = (todo) => {
    //     const missions = JSON.parse(localStorage.getItem('missions') || '[]');
    //     const newMission = {
    //         ...todo,
    //         fromPage: pages[todo.page],
    //         sentAt: new Date().toISOString()
    //     };
    //     localStorage.setItem('missions', JSON.stringify([...missions, newMission]));
    //     deleteTodo(todo.id);
    // };

    // // Calculate pagination
    // const indexOfLastTodo = currentPage * itemsPerPage;
    // const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
    // const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);
    // const totalPages = Math.ceil(todos.length / itemsPerPage);

    // let pagesArray = [];
    // for (let i = 1; i <= totalPages; i++) {
    //     pagesArray.push(
    //         <Pagination.Item
    //             key={i}
    //             active={i === currentPage}
    //             onClick={() => setCurrentPage(i)}
    //         >
    //             {i}
    //         </Pagination.Item>
    //     );
    // }

    // // Filter todos by page
    // const filterTodosByPage = (page) => {
    //     return todos.filter(todo => todo.page === page);
    // };

    return (
        <div></div>
        // <div className="p-4">
        //     <Form onSubmit={handleSubmit} className="mb-4">
        //         <Form.Group className="d-flex gap-2">
        //             <Form.Control
        //                 type="text"
        //                 value={inputText}
        //                 onChange={(e) => setInputText(e.target.value)}
        //                 placeholder="Add new todo"
        //             />
        //             <Dropdown>
        //                 <Dropdown.Toggle variant="secondary">
        //                     {pages[selectedPage]}
        //                 </Dropdown.Toggle>
        //                 <Dropdown.Menu>
        //                     {Object.entries(pages).map(([key, value]) => (
        //                         <Dropdown.Item
        //                             key={key}
        //                             onClick={() => setSelectedPage(key)}
        //                         >
        //                             {value}
        //                         </Dropdown.Item>
        //                     ))}
        //                 </Dropdown.Menu>
        //             </Dropdown>
        //             <Button type="submit" variant="primary">
        //                 Add
        //             </Button>
        //         </Form.Group>
        //     </Form>

        //     {Object.entries(pages).map(([pageKey, pageName]) => (
        //         <div key={pageKey} className="mb-4">
        //             <h4>{pageName}</h4>
        //             <ListGroup>
        //                 {filterTodosByPage(pageKey).map(todo => (
        //                     <ListGroup.Item
        //                         key={todo.id}
        //                         className="d-flex justify-content-between align-items-center"
        //                     >
        //                         {todo.text}
        //                         <div className="d-flex gap-2">
        //                             <Button
        //                                 variant="success"
        //                                 size="sm"
        //                                 onClick={() => sendToMissions(todo)}
        //                             >
        //                                 Send to Missions
        //                             </Button>
        //                             <Dropdown>
        //                                 <Dropdown.Toggle variant="info" size="sm">
        //                                     Move to
        //                                 </Dropdown.Toggle>
        //                                 <Dropdown.Menu>
        //                                     {Object.entries(pages)
        //                                         .filter(([key]) => key !== todo.page)
        //                                         .map(([key, value]) => (
        //                                             <Dropdown.Item
        //                                                 key={key}
        //                                                 onClick={() => {
        //                                                     setTodos(todos.map(t =>
        //                                                         t.id === todo.id
        //                                                             ? { ...t, page: key }
        //                                                             : t
        //                                                     ));
        //                                                 }}
        //                                             >
        //                                                 {value}
        //                                             </Dropdown.Item>
        //                                         ))}
        //                                 </Dropdown.Menu>
        //                             </Dropdown>
        //                             <Button
        //                                 variant="danger"
        //                                 size="sm"
        //                                 onClick={() => deleteTodo(todo.id)}
        //                             >
        //                                 Delete
        //                             </Button>
        //                         </div>
        //                     </ListGroup.Item>
        //                 ))}
        //             </ListGroup>
        //         </div>
        //     ))}

        //     {totalPages > 1 && (
        //         <Pagination className="mt-3">
        //             {pagesArray}
        //         </Pagination>
        //     )}
        // </div>
    );
};

export default Jobs;