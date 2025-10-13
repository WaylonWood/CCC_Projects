import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import '@testing-library/jest-dom';

describe('Express App', () => {
    beforeEach(() => {
        render(<App />);
    });

    it('should have an <h1> header element with the content of "Weather App"', () => {
        expect(screen.getByRole('heading', { name: /Weather App/i })).toBeInTheDocument();
    });
});