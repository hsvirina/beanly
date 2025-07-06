export const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const;

export type ThemeType = typeof Theme[keyof typeof Theme];