import { useState } from 'react';

function TodoItem({ todo, updateTodo, deleteTodo }) {
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 1: return 'priority-high';
      case 2: return 'priority-medium';
      case 3: return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editText.trim()) {
      updateTodo(todo.id, {
        ...todo,
        text: editText.trim(),
        priority: parseInt(editPriority),
        isEditing: false
      });
    }
  };

  const handleEdit = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    updateTodo(todo.id, { ...todo, isEditing: true });
  };

  const handleToggleComplete = () => {
    updateTodo(todo.id, { ...todo, completed: !todo.completed });
  };

  if (todo.isEditing) {
    return (
      <li 
        className={`todo-item ${getPriorityClass(editPriority)}`}
        data-testid="todo-item"
      >
        <form className="edit-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor={`edit-text-${todo.id}`}>Description</label>
            <textarea
              id={`edit-text-${todo.id}`}
              data-testid="update-todo-text"
              className="form-control"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`edit-priority-${todo.id}`}>Priority</label>
            <select
              id={`edit-priority-${todo.id}`}
              data-testid="update-todo-priority"
              className="form-control"
              value={editPriority}
              onChange={(e) => setEditPriority(parseInt(e.target.value))}
            >
              <option value="1">High</option>
              <option value="2">Medium</option>
              <option value="3">Low</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            data-testid="update-todo"
            className="btn btn-success"
          >
            Save
          </button>
        </form>
      </li>
    );
  }

  return (
    <li 
      className={`todo-item ${getPriorityClass(todo.priority)}`}
      data-testid="todo-item"
    >
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
      />
      
      <div className="todo-content">
        <p className={`todo-text ${todo.completed ? 'completed' : ''}`}>
          {todo.text}
        </p>
      </div>
      
      <div className="todo-actions">
        <a 
          data-testid="edit-todo"
          onClick={handleEdit}
        >
          Edit
        </a>
        <a 
          data-testid="delete-todo"
          className="delete-link"
          onClick={() => deleteTodo(todo.id)}
        >
          Delete
        </a>
      </div>
    </li>
  );
}

export default TodoItem;
