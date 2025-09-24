const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

let todoItems = [
    {
        todoItemId: 0,
        name: 'an item',
        priority: 3,
        completed: false
    },
    {
        todoItemId: 1,
        name: 'another item',
        priority: 2,
        completed: false
    },
    {
        todoItemId: 2,
        name: 'a done item',
        priority: 1,
        completed: true
    }
];

const serverStartTime = Date.now();

// Returns the API status and server uptime
app.get('/', (req, res) => {
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
    res.status(200).json({ 
        status: 'ok',
        uptime: `${uptime} seconds`
    });
});

// Returns all todo items
app.get('/api/TodoItems', (req, res) => {
    res.status(200).json(todoItems);
});

// Finds and returns a single todo item by its ID
app.get('/api/TodoItems/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = todoItems.find(todo => todo.todoItemId === id);
    
    if (!item) {
        return res.status(404).json({ error: 'Todo item not found' });
    }
    
    res.status(200).json(item);
});

// Creates a new todo item and adds it to the list
app.post('/api/TodoItems', (req, res) => {
    const newItem = req.body;
    
    if (!newItem.hasOwnProperty('todoItemId') || 
        !newItem.hasOwnProperty('name') || 
        !newItem.hasOwnProperty('priority') || 
        !newItem.hasOwnProperty('completed')) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    todoItems.push(newItem);
    res.status(201).json(newItem);
});

// Removes a todo item from the list by ID
app.delete('/api/TodoItems/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = todoItems.findIndex(todo => todo.todoItemId === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Todo item not found' });
    }
    
    const deletedItem = todoItems.splice(itemIndex, 1)[0];
    res.status(200).json(deletedItem);
});

// Returns only the completed todo items
app.get('/api/TodoItems/filter/completed', (req, res) => {
    const completedItems = todoItems.filter(item => item.completed === true);
    res.status(200).json(completedItems);
});

// Returns only the incomplete todo items
app.get('/api/TodoItems/filter/incomplete', (req, res) => {
    const incompleteItems = todoItems.filter(item => item.completed === false);
    res.status(200).json(incompleteItems);
});

// Replaces an entire todo item with new data
app.put('/api/TodoItems/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = todoItems.findIndex(todo => todo.todoItemId === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Todo item not found' });
    }
    
    const updatedItem = req.body;
    if (!updatedItem.hasOwnProperty('todoItemId') || 
        !updatedItem.hasOwnProperty('name') || 
        !updatedItem.hasOwnProperty('priority') || 
        !updatedItem.hasOwnProperty('completed')) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    todoItems[itemIndex] = updatedItem;
    res.status(200).json(updatedItem);
});

// Updates only the specified fields of a todo item
app.patch('/api/TodoItems/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = todoItems.findIndex(todo => todo.todoItemId === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Todo item not found' });
    }
    
    const updates = req.body;
    todoItems[itemIndex] = { ...todoItems[itemIndex], ...updates };
    
    res.status(200).json(todoItems[itemIndex]);
});

// Handles any server errors that occur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
