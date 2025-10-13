import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import '@testing-library/jest-dom';
import axios from 'axios';

const url = 'http://localhost:5173';

describe('Change Calculator App', () => {
    beforeEach(() => {
        render(<App />);
    });

    it('should load successfully', async () => {
         const response = await axios.get(url);
        expect(response.status).toBe(200);
    });

    it('should have an <h1> header element with the content of "Change Calculator"', () => {
        expect(screen.getByRole('heading', { name: /Change Calculator/i })).toBeInTheDocument();
    });

    it('should include an input element for the user to enter amount due', () => {
        expect(screen.getByTestId('amountDue')).toBeInTheDocument();
    });

    it('should include an input element for the user to enter amount received', () => {
        expect(screen.getByTestId('amountReceived')).toBeInTheDocument();
    });

    it('should include a button for the user to calculate change, the word "Calculate" must be in the button', () => {
        expect(screen.getByTestId('calculate')).toBeInTheDocument();
    });

    it('should calculate total change correctly', async () => {
        await userEvent.type(screen.getByTestId('amountDue'), '13.01');
        await userEvent.type(screen.getByTestId('amountReceived'), '20');
        await userEvent.click(screen.getByTestId('calculate'));
        expect(await screen.findByText(/The total change due is \$6.99/i)).toBeInTheDocument();
    });
    
    it('should calculate additional money owed correctly', async () => {
        await userEvent.type(screen.getByTestId('amountDue'), '90.85');
        await userEvent.type(screen.getByTestId('amountReceived'), '66.3');
        await userEvent.click(screen.getByTestId('calculate'));
        expect(await screen.findByText(/Additional money owed is \$24.55/i)).toBeInTheDocument();
    });

    it('should calculate individual change correctly', async () => {
        await userEvent.type(document.querySelector('input[id=amountDue]'), '13.01');
        await userEvent.type(document.querySelector('input[id=amountReceived]'), '20');
        await userEvent.click(screen.getByTestId('calculate'));

        const expectedChanges = {
            twenties: '0',
            tens: '0',
            fives: '1',
            ones: '1',
            quarters: '3',
            dimes: '2',
            nickels: '0',
            pennies: '4',
        };

        for (const [denomination, value] of Object.entries(expectedChanges)) {
            expect(screen.getByTestId(denomination)).toHaveTextContent(value);
        }
    });
});