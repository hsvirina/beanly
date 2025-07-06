import type { LanguageType } from "./Language";
import type { ThemeType } from "./Theme";

export type Settings = {
  theme: ThemeType;
  language: LanguageType;
  notifications: {
    email: boolean;
    push: boolean;
    review: boolean;
  };
  privacy: {
    locationSharing: boolean;
  };
};