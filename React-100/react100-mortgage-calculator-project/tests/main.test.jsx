import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import '@testing-library/jest-dom';
import axios from 'axios';

const url = 'http://localhost:5173';

describe('Mortgage Calculator', () => {
    beforeEach(() => {
        render(<App />);
    });

    it('should load successfully', async () => {
        const response = await axios.get(url);
       expect(response.status).toBe(200);
   });

    // DOM-related tests using React Testing Library
    describe('HTML', () => {
        it('should have an <h1> header element with the content of "Mortgage Calculator"', () => {
            expect(screen.getByRole('heading', { name: /Mortgage Calculator/i })).toBeInTheDocument();
        });

        it('should have an input element with a "data-testid" of "balance"', () => {
            const balance = screen.getByTestId('balance');
            expect(balance).toBeInTheDocument();
        });

        it('should have an input element with a "data-testid" of "rate"', () => {
            const rate = screen.getByTestId('rate');
            expect(rate).toBeInTheDocument();
        });

        it('should have a select element with a "data-testid" of "term"', () => {
            const term = screen.getByTestId('term');
            expect(term).toBeInTheDocument();
        });

        it('should contain a button with a "data-testid" of "submit"', () => {
            const submit = screen.getByTestId('submit');
            expect(submit).toBeInTheDocument();
        });
    });

    // Integration tests - simulated user actions with React Testing Library and userEvent
    describe('Integration', () => {
        it('should display correct mortgage payment for 30 year term', async () => {
            await userEvent.type(screen.getByTestId('balance'), '420000');
            await userEvent.type(screen.getByTestId('rate'), '3.75');
            await userEvent.selectOptions(screen.getByTestId('term'), ['30']);
            await userEvent.click(screen.getByTestId('submit'));
            expect(screen.getByTestId('output')).toHaveTextContent('$1945.09 is your payment');
        });

        it('should display correct mortgage payment for 15 year term', async () => {
            await userEvent.type(screen.getByTestId('balance'), '670000');
            await userEvent.type(screen.getByTestId('rate'), '4.25');
            await userEvent.selectOptions(screen.getByTestId('term'), ['15']);
            await userEvent.click(screen.getByTestId('submit'));
            expect(screen.getByTestId('output')).toHaveTextContent('$5040.27 is your payment');
        });
    });
});
