export const Language = {
  English: 'ENG',
  Ukrainian: 'UKR',
} as const;

export type LanguageType = typeof Language[keyof typeof Language];