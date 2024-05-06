import { createEvent, createStore } from 'effector';

export const $isSettingsModalOpen = createStore(false);

const setModalOpen = createEvent<boolean>();
$isSettingsModalOpen.on(setModalOpen, (_, payload) => payload);

export const openSettingsModal = () => setModalOpen(true);
export const closeSettingsModal = () => setModalOpen(false);
