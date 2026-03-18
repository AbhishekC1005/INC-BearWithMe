// BearWithMe Theme Constants

export const COLORS = {
  // Primary sage green palette
  primary: '#8FAE8B',
  primaryLight: '#A8C5A0',
  primaryDark: '#6B8F69',

  // Creamy background colors
  background: '#FDF8F3',
  backgroundSecondary: '#FAF5EE',
  card: '#FFFFFF',

  // Text colors
  text: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',

  // Accent colors
  accent: '#E17055',
  accentLight: '#FAB1A0',

  // Mood colors
  moodGreat: '#00B894',
  moodGood: '#8FAE8B',
  moodOkay: '#FDCB6E',
  moodLow: '#E17055',
  moodBad: '#D63031',

  // UI elements
  border: '#DFE6E9',
  shadow: '#00000010',
  overlay: '#00000050',

  // Status
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#D63031',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 100,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};