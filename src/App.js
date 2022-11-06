import React from "react";
import "./App.css";
import { Button, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import { colors } from "@material-ui/core";
import { useEffect, useState, useRef } from "react";
import SearchField from 'react-search-field';
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';



function Todo({ todo, index, markTodo, removeTodo, checkTask }) {
  return (
    <div className="todo">
      <span style={{ textDecoration: todo.isDone ? "line-through" : "" }}>{todo.text}</span>
      <div className="checkbox">
        {checkTask && <Checkbox defaultChecked={checkTask} label={"Checked state"} onClick={() => markTodo(index)} />}
        {!checkTask && <Checkbox defaultChecked={checkTask} label={"Checked state"} onClick={() => markTodo(index)} />}
        <DeleteIcon variant="outline-danger" onClick={() => removeTodo(index)} />
      </div>
    </div>
  );
}


function FormTodo({ addTodo }) {
  const [value, setValue] = React.useState("");
  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <div className="addtodo"><b>Add Todo</b></div>
        {/* <SearchField placeholder='Search item' onChange={onChange}/> */}
        <input type="text" className="input" value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <Button className="btn" variant="primary mb-3" type="submit">Add Task</Button>
    </Form>
  );
}


function App() {
  const draggingItem = useRef();
  const dragOverItem = useRef();
  const [todos, setTodos] = React.useState([]);
  const [newTodo, setNewTodo] = useState("");
  const saveData = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };


  useEffect(() => {
    if (localStorage.getItem("todos")) {
      setTodos(JSON.parse(localStorage.getItem("todos")));
    }
  }, []);




  const addTodo = text => {
    const newTodos = [...todos, { text, isDone: false }];
    console.log(todos)
    setTodos(newTodos);
    setNewTodo("");
    saveData(newTodos);
    console.log(todos)
  };

  const markTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isDone = !todos[index].isDone;
    setTodos(newTodos);
    setNewTodo("");
    saveData(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    console.log(index)
    newTodos.splice(index, 1);
    setTodos(newTodos);
    saveData(newTodos);
  };

  const handleDragStart = (e, position) => {
    draggingItem.current = position;
    console.log(e.target.innerHTML);
  };
  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
  };

  const handleDragEnd = (e) => {
    const listCopy = [...todos];
    const draggingItemContent = listCopy[draggingItem.current];
    listCopy.splice(draggingItem.current, 1);
    listCopy.splice(dragOverItem.current, 0, draggingItemContent);
    saveData(listCopy)
    draggingItem.current = null;
    dragOverItem.current = null;
    setTodos(listCopy);
  };


  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4" >Todo List</h1>
        {/* <SearchField placeholder='Search item' onChange={onChange}/> */}
        <Button className="btn" variant="primary mb-3" type="submit">Logout</Button>
        <FormTodo addTodo={addTodo} />
        <div>
          {todos && todos.map((todo, index) => (
             <div onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  key={index}
                  draggable >


              <div className="card">
                <Todo
                  key={index}
                  index={index}
                  todo={todo}
                  markTodo={markTodo}
                  removeTodo={removeTodo}
                  checkTask={todo.isDone}
            
                />
                {todo.isDone && <p className="comp">Completed</p>}
              </div>
            </div> 
          ))}
          {todos && <h3>Completed task  {todos.filter(item => item.isDone).length}</h3>}
        </div>
      </div>
    </div>
  );
}



export default App;

