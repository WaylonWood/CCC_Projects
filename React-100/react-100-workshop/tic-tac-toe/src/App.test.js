import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tic-tac-toe game', () => {
  render(<App />);
  const nextPlayerElement = screen.getByText(/Next player: X/i);
  expect(nextPlayerElement).toBeInTheDocument();
});

test('renders game start button', () => {
  render(<App />);
  const startButton = screen.getByText(/Go to game start/i);
  expect(startButton).toBeInTheDocument();
});
