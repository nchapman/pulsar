import { createEvent, createStore, StoreWritable } from 'effector';

interface UserSettings {
  defaultModel: string | null;
  downloadsQueue: Id[];
  downloadsCurrent: Id | null;
}

const defaultSettings: UserSettings = {
  defaultModel: null,
  downloadsQueue: [],
  downloadsCurrent: null,
};

const LS_KEY = 'user-settings';

class UserSettingsManager {
  private settings: UserSettings;

  $settings: StoreWritable<UserSettings>;

  events = {
    set: createEvent<Partial<UserSettings>>(),
  };

  constructor() {
    this.settings = this.getLSValue();
    this.$settings = createStore(this.settings);
    this.$settings.on(this.events.set, (old, changed) => ({ ...old, ...changed }));
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

export const $defaultModel = userSettingsManager.$settings.map((settings) => settings.defaultModel);

export type { UserSettingsManager };
