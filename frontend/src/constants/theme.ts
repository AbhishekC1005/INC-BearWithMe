// Design Tokens / Color Palette
export const colors = {
  primary: '#7857e1',
  background: '#f3eded',
  white: '#ffffff',
  textPrimary: '#302f2f',
  textSecondary: '#7857e1',
  inputBackground: 'rgba(120, 87, 225, 0.12)',
  border: '#7857e1',
  error: '#ff6b6b',
  success: '#51cf66',
  warning: '#ffd93d',
  disabled: '#cccccc',
} as const;

// Font sizes
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 53,
} as const;

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 49,
} as const;
