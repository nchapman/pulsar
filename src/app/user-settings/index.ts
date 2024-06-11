export interface UserSettings {
  models: {
    defaultModel: string;
  };
}

export function getUserSettings(key: keyof UserSettings) {
  const settings: UserSettings = { models: { defaultModel: 'some-model' } };

  return settings[key];
}
