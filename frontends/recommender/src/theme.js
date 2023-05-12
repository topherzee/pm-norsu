import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#599900',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  spacing: 4,
  typography: {
    // Tell MUI what's the font-size on the html element is.
    htmlFontSize: 20,
    body2: {
      fontSize: 14,
    },
  },
});

export default theme;
