import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders Art Institute header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Art Institute of Chicago/i);
  expect(headerElement).toBeInTheDocument();
});
