import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import '@testing-library/jest-dom';

describe('Very Simple To Do App', () => {
    beforeEach(() => {
        localStorage.clear(); // Clear local storage before each test
        render(<App />);
    });

    it('should include h1 element with text "Very Simple Todo App"', async () => {
        await waitFor(() => {
            const h1 = screen.getByText('Very Simple Todo App');
            expect(h1).toBeInTheDocument();
        });
    });

    it('should include textarea element with "data-testid" of "create-todo-text" for the user to enter todo text', async () => {
        await waitFor(() => {
            const textarea = screen.getByTestId('create-todo-text');
            expect(textarea).toBeInTheDocument();
        });
    });
    
    it('should include select element with "data-testid" of "create-todo-priority"', async () => {
        await waitFor(() => {
            const priority = screen.getByTestId('create-todo-priority');
            expect(priority).toBeInTheDocument();
        });
    });
    
    it('should include select priority element with 3 options with values of 1 for high, 2 for medium, and 3 for low', async () => {
        await waitFor(() => {
            const priority = screen.getByTestId('create-todo-priority');
            const options = priority.querySelectorAll('option');
            expect(options.length).toBe(3);
            expect(options[0].value).toBe('1');
            expect(options[1].value).toBe('2');
            expect(options[2].value).toBe('3');
        });
    });
    
    it('should include button element with "data-testid" of "create-todo" for the user to create a todo', async () => {
        await waitFor(() => {
            const button = screen.getByTestId('create-todo');
            expect(button).toBeInTheDocument();
        });
    });

    it('should add todo item with a "data-testid" of "todo-item"', async () => {
        const textarea = screen.getByTestId('create-todo-text');
        const select = screen.getByTestId('create-todo-priority');
        const addButton = screen.getByTestId('create-todo');

        fireEvent.change(select, { target: { value: '1' } });
        fireEvent.change(textarea, { target: { value: 'NEW TODO HIGH' } });
        fireEvent.click(addButton);
        
        await waitFor(() => {
            const todoItem = screen.getAllByTestId('todo-item')[0];
            expect(todoItem).toBeInTheDocument();
            expect(todoItem).toHaveTextContent('NEW TODO');
        });
    });
    
    it('should add todo item a class of "priority-high", "priority-medium", or "priority-low" accordingly', async () => {
        const textarea = screen.getByTestId('create-todo-text');
        const select = screen.getByTestId('create-todo-priority');
        const addButton = screen.getByTestId('create-todo');

        fireEvent.change(select, { target: { value: '1' } });
        fireEvent.change(textarea, { target: { value: 'NEW TODO HIGH' } });
        fireEvent.click(addButton);
        
        fireEvent.change(select, { target: { value: '2' } });
        fireEvent.change(textarea, { target: { value: 'NEW TODO MEDIUM' } });
        fireEvent.click(addButton);
        
        fireEvent.change(select, { target: { value: '3' } });
        fireEvent.change(textarea, { target: { value: 'NEW TODO LOW' } });
        fireEvent.click(addButton);

        await waitFor(() => {
            const todoItemHigh = screen.getAllByTestId('todo-item')[0];
            expect(todoItemHigh).toBeInTheDocument();
            expect(todoItemHigh).toHaveTextContent('NEW TODO HIGH');
            expect(todoItemHigh).toHaveClass('priority-high');
            
            const todoItemMedium = screen.getAllByTestId('todo-item')[1];
            expect(todoItemMedium).toBeInTheDocument();
            expect(todoItemMedium).toHaveTextContent('NEW TODO MEDIUM');
            expect(todoItemMedium).toHaveClass('priority-medium');
            
            const todoItemLow = screen.getAllByTestId('todo-item')[2];
            expect(todoItemLow).toBeInTheDocument();
            expect(todoItemLow).toHaveTextContent('NEW TODO LOW');
            expect(todoItemLow).toHaveClass('priority-low');
        });
    });



    it('should show todo item with an edit button with a "data-testid" of "edit-todo"', async () => {
        const textarea = screen.getByTestId('create-todo-text');
        const select = screen.getByTestId('create-todo-priority');
        const addButton = screen.getByTestId('create-todo');

        fireEvent.change(select, { target: { value: '1' } });
        fireEvent.change(textarea, { target: { value: 'NEW TODO' } });
        fireEvent.click(addButton);

        const editButton = screen.getByTestId('edit-todo');

        await waitFor(() => {
            expect(editButton).toBeInTheDocument();
        });
    });
    
    it('should show todo item with an delete button with a "data-testid" of "delete-todo"', async () => {
        const textarea = screen.getByTestId('create-todo-text');
        const select = screen.getByTestId('create-todo-priority');
        const addButton = screen.getByTestId('create-todo');

        fireEvent.change(select, { target: { value: '1' } });
        fireEvent.change(textarea, { target: { value: 'NEW TODO' } });
        fireEvent.click(addButton);

        const deleteButton = screen.getByTestId('delete-todo');

        await waitFor(() => {
            expect(deleteButton).toBeInTheDocument();
        });
    });

    it('should allow editing a todo item and show a text area with a "data-testid" of "update-todo-text" and a button with a "data-testid" of "update-todo"', async () => {
        const textarea = screen.getByTestId('create-todo-text');
        const select = screen.getByTestId('create-todo-priority');
        const addButton = screen.getByTestId('create-todo');

        fireEvent.change(select, { target: { value: '1' } });
        fireEvent.change(textarea, { target: { value: 'NEW TODO' } });
        fireEvent.click(addButton);

        const editButton = screen.getByTestId('edit-todo');
        fireEvent.click(editButton);

        const updateTextarea = screen.getByTestId('update-todo-text');
        fireEvent.change(updateTextarea, { target: { value: ' UPDATED TODO' } });

        const updateButton = screen.getByTestId('update-todo');
        fireEvent.click(updateButton);

        await waitFor(() => {
            const todoItem = screen.getAllByTestId('todo-item')[0];
            expect(todoItem).toHaveTextContent('UPDATED TODO');
        });
    });

    it('should allow deleting a todo item', async () => {
        const textarea = screen.getByTestId('create-todo-text');
        const select = screen.getByTestId('create-todo-priority');
        const addButton = screen.getByTestId('create-todo');

        fireEvent.change(select, { target: { value: '1' } });
        fireEvent.change(textarea, { target: { value: 'NEW TODO' } });
        fireEvent.click(addButton);

        fireEvent.change(select, { target: { value: '1' } });
        fireEvent.change(textarea, { target: { value: 'SECOND TODO' } });
        fireEvent.click(addButton);

        const deleteButton = screen.getAllByTestId('delete-todo')[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const todoItems = screen.getAllByTestId('todo-item');
            expect(todoItems.length).toBe(1);
        });
    });
});
