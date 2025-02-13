import '@testing-library/jest-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { render } from '@testing-library/react';

// 👇 Lazy import to avoid issues with Jest
const AllTheProviders = ({ children }) => {
  const { createTheme, ThemeProvider } = require('@mui/material/styles'); // Use CommonJS here
  const { CssBaseline } = require('@mui/material');

  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
