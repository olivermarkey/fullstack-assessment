import { createTheme, rem } from '@mantine/core';

// Generate a color palette based on your primary color #005A75
const customPrimary = [
  '#E6F0F3',
  '#CCE1E7',
  '#99C3CF',
  '#66A5B7',
  '#33879F',
  '#005A75', // Your main color
  '#004E66',
  '#004157',
  '#003547',
  '#002938',
] as const;

// Generate a grey palette based on #727883
const customGrey = [
  '#F2F3F4',
  '#E5E6E8',
  '#CBCED1',
  '#B1B5BA',
  '#979DA3',
  '#727883', // Your main grey
  '#5B6069',
  '#44474F',
  '#2D2F34',
  '#16171A',
] as const;

export const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'custom-primary',
  defaultRadius: 'md',
  
  colors: {
    'custom-primary': customPrimary,
    'custom-grey': customGrey,
  },

  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
  },

  // Set default text color
  black: '#1C232C',
});