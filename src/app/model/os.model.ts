import { os } from '@tauri-apps/api';
import { createEvent, createStore } from 'effector';

export const $osType = createStore<os.OsType | null>(null);
const setOsType = createEvent<os.OsType>();
$osType.on(setOsType, (_, osType) => osType);
os.type().then(setOsType);

export const $isMac = $osType.map((osType) => osType === 'Darwin');
