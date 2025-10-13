import { useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [nextId, setNextId] = useState(1);

  const addTodo = (todoData) => {
    const newTodo = {
      id: nextId,
      text: todoData.text,
      priority: todoData.priority,
      completed: false,
      isEditing: false
    };
    setTodos([...todos, newTodo]);
    setNextId(nextId + 1);
  };

  const updateTodo = (id, updatedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === id ? updatedTodo : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Very Simple Todo App</h1>
        <p>Track all of the things</p>
      </header>
      
      <main className="main-container">
        <TodoForm addTodo={addTodo} />
        <TodoList 
          todos={todos} 
          updateTodo={updateTodo} 
          deleteTodo={deleteTodo} 
        />
      </main>
    </div>
  );
}

export default App;
