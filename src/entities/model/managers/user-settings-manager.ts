interface UserSettings {
  defaultModel: string | null;
}

const defaultSettings: UserSettings = {
  defaultModel: null,
};

const LS_KEY = 'user-settings';

class UserSettingsManager {
  private settings: UserSettings;

  constructor() {
    this.settings = this.getLSValue();
  }

  get(key: keyof UserSettings) {
    return this.settings[key];
  }

  set<T extends keyof UserSettings>(key: T, value: UserSettings[T]) {
    this.settings[key] = value;
    this.saveToLS();
  }

  private getLSValue(): UserSettings {
    const strValue = localStorage.getItem(LS_KEY);

    if (!strValue) {
      this.settings = defaultSettings;
      this.saveToLS();
      return this.settings;
    }

    return JSON.parse(strValue);
  }

  private saveToLS() {
    localStorage.setItem(LS_KEY, JSON.stringify(this.settings));
  }
}

export const userSettingsManager = new UserSettingsManager();

export type { UserSettingsManager };
