import { useState } from 'react';

function AddTodoForm({ onAddTodo }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('1');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo({
        text: text.trim(),
        priority: parseInt(priority)
      });
      setText('');
      setPriority('1');
    }
  };

  return (
    <div className="add-todo-card">
      <h2>Add New Todo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="todo-text">I want to...</label>
          <textarea
            id="todo-text"
            data-testid="create-todo-text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Enter your todo item"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="todo-priority">How much of a priority is this?</label>
          <select
            id="todo-priority"
            data-testid="create-todo-priority"
            className="form-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          data-testid="create-todo"
          className="btn btn-primary"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}

export default AddTodoForm;