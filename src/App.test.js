import { render, screen } from '@testing-library/react';
import { act } from 'react'; // ✅ Use 'react' instead of 'react-dom/test-utils'
import App from './App';

test('renders main application title', async () => {
  await act(async () => {
    render(<App />);
  });

  expect(screen.getByText(/Secret Santa Game/i)).toBeInTheDocument();
});
